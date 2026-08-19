import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

const STATE_COOKIE = "bs_admin_oauth";
const SESSION_COOKIE = "bs_admin_session";
const DEVICE_COOKIE = "bs_admin_device";
const STATE_TTL_SECONDS = 10 * 60;
const DEVICE_TTL_SECONDS = 365 * 24 * 60 * 60;
const DEVICE_ENROLLMENT_TTL_SECONDS = 10 * 60;

function requiredText(value, code) {
  if (typeof value !== "string" || value.trim() === "") throw new Error(code);
  return value.trim();
}

function issuerUrl(value) {
  const raw = requiredText(value, "AUTH0_DOMAIN_REQUIRED");
  const url = new URL(raw.includes("://") ? raw : `https://${raw}`);
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new Error("AUTH0_DOMAIN_INVALID");
  }
  url.pathname = "/";
  url.search = "";
  url.hash = "";
  return url;
}

function encryptionKey(secret) {
  const value = requiredText(secret, "ADMIN_SESSION_SECRET_REQUIRED");
  if (Buffer.byteLength(value) < 32) throw new Error("ADMIN_SESSION_SECRET_TOO_SHORT");
  return createHash("sha256").update(value).digest();
}

function seal(value, key) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(value), "utf8"),
    cipher.final(),
  ]);
  return [iv, cipher.getAuthTag(), ciphertext]
    .map((part) => part.toString("base64url"))
    .join(".");
}

function unseal(value, key) {
  if (typeof value !== "string") throw new Error("SESSION_COOKIE_INVALID");
  const parts = value.split(".");
  if (parts.length !== 3) throw new Error("SESSION_COOKIE_INVALID");
  const [iv, tag, ciphertext] = parts.map((part) => Buffer.from(part, "base64url"));
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return JSON.parse(plaintext.toString("utf8"));
}

function cookies(request) {
  const headers = request?.headers ?? {};
  const raw =
    typeof headers.get === "function"
      ? headers.get("cookie")
      : headers.cookie ?? headers.Cookie;
  if (typeof raw !== "string") return Object.freeze({});
  return Object.freeze(
    Object.fromEntries(
      raw.split(";").flatMap((item) => {
        const separator = item.indexOf("=");
        if (separator < 1) return [];
        return [
          [
            item.slice(0, separator).trim(),
            decodeURIComponent(item.slice(separator + 1).trim()),
          ],
        ];
      }),
    ),
  );
}

function constantEqual(left, right) {
  if (typeof left !== "string" || typeof right !== "string") return false;
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function cookie(name, value, { maxAge, secure }) {
  const attributes = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/admin",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];
  if (secure) attributes.push("Secure");
  return attributes.join("; ");
}

function adapterResponse(status, body = "", headers = {}) {
  return Object.freeze({
    status,
    headers: Object.freeze({
      "cache-control": "no-store",
      "content-type": "text/plain; charset=utf-8",
      ...headers,
    }),
    body,
  });
}

function normalizedEnrollmentCode(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") throw new Error("DEVICE_ENROLLMENT_CODE_INVALID");
  const code = value.trim();
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(code)) {
    throw new Error("DEVICE_ENROLLMENT_CODE_INVALID");
  }
  return code;
}

export function createAuth0WebFlow({
  domain,
  clientId,
  clientSecret,
  audience,
  baseUrl,
  sessionSecret,
  authenticateToken,
  sessionStore,
  fetchImpl = fetch,
  now = () => Date.now(),
} = {}) {
  const issuer = issuerUrl(domain);
  const resolvedClientId = requiredText(clientId, "AUTH0_CLIENT_ID_REQUIRED");
  const resolvedClientSecret = requiredText(
    clientSecret,
    "AUTH0_CLIENT_SECRET_REQUIRED",
  );
  const resolvedAudience = requiredText(audience, "AUTH0_AUDIENCE_REQUIRED");
  const adminBaseUrl = new URL(requiredText(baseUrl, "ADMIN_BASE_URL_REQUIRED"));
  const localHttp =
    adminBaseUrl.protocol === "http:" &&
    ["localhost", "127.0.0.1", "::1"].includes(adminBaseUrl.hostname);
  if (adminBaseUrl.protocol !== "https:" && !localHttp) {
    throw new Error("ADMIN_BASE_URL_INVALID");
  }
  const callbackUrl = new URL("/admin/callback", adminBaseUrl).toString();
  const key = encryptionKey(sessionSecret);
  const secure = adminBaseUrl.protocol === "https:";
  if (typeof authenticateToken !== "function") {
    throw new Error("AUTH0_TOKEN_AUTHENTICATOR_UNBOUND");
  }
  if (typeof fetchImpl !== "function") throw new Error("AUTH0_FETCH_UNBOUND");
  if (
    !sessionStore ||
    typeof sessionStore.registerAdminDevice !== "function" ||
    typeof sessionStore.createAdminDeviceEnrollmentGrant !== "function" ||
    typeof sessionStore.createAdminSession !== "function" ||
    typeof sessionStore.readAdminSession !== "function" ||
    typeof sessionStore.revokeAdminSession !== "function"
  ) {
    throw new Error("ADMIN_SESSION_STORE_UNBOUND");
  }

  async function beginLogin(request = {}) {
    const loginUrl = new URL(String(request.url ?? "/admin/login"), adminBaseUrl);
    const enrollmentCode = normalizedEnrollmentCode(
      loginUrl.searchParams.get("enrollment_code"),
    );
    const state = randomBytes(24).toString("base64url");
    const nonce = randomBytes(24).toString("base64url");
    const verifier = randomBytes(48).toString("base64url");
    const challenge = createHash("sha256").update(verifier).digest("base64url");
    const stateValue = seal(
      {
        state,
        nonce,
        verifier,
        enrollmentCode,
        expiresAt: Math.floor(now() / 1_000) + STATE_TTL_SECONDS,
      },
      key,
    );
    const authorize = new URL("authorize", issuer);
    authorize.search = new URLSearchParams({
      response_type: "code",
      client_id: resolvedClientId,
      redirect_uri: callbackUrl,
      scope: "openid profile",
      audience: resolvedAudience,
      state,
      nonce,
      prompt: "login",
      max_age: "300",
      code_challenge: challenge,
      code_challenge_method: "S256",
    }).toString();
    return adapterResponse(302, "", {
      location: authorize.toString(),
      "set-cookie": cookie(STATE_COOKIE, stateValue, {
        maxAge: STATE_TTL_SECONDS,
        secure,
      }),
    });
  }

  async function completeLogin(request) {
    const url = new URL(String(request?.url ?? "/admin/callback"), adminBaseUrl);
    const code = url.searchParams.get("code");
    const returnedState = url.searchParams.get("state");
    const stateValue = unseal(cookies(request)[STATE_COOKIE], key);
    if (
      typeof code !== "string" ||
      code === "" ||
      !constantEqual(returnedState, stateValue.state) ||
      !Number.isSafeInteger(stateValue.expiresAt) ||
      stateValue.expiresAt < Math.floor(now() / 1_000)
    ) {
      throw new Error("AUTH0_CALLBACK_INVALID");
    }
    const tokenResponse = await fetchImpl(new URL("oauth/token", issuer), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: resolvedClientId,
        client_secret: resolvedClientSecret,
        code,
        code_verifier: stateValue.verifier,
        redirect_uri: callbackUrl,
      }),
    });
    if (!tokenResponse.ok) throw new Error("AUTH0_TOKEN_EXCHANGE_FAILED");
    const token = await tokenResponse.json();
    if (typeof token.access_token !== "string") {
      throw new Error("AUTH0_ACCESS_TOKEN_MISSING");
    }
    const actor = await authenticateToken({
      headers: { authorization: `Bearer ${token.access_token}` },
    }, { requireFresh: true });
    if (
      !actor ||
      actor.freshAuthentication !== true ||
      !Array.isArray(actor.capabilities) ||
      !actor.capabilities.includes("device.manage")
    ) {
      throw new Error("AUTH0_FRESH_PASSKEY_REQUIRED");
    }
    let deviceId;
    try {
      const existingDevice = unseal(cookies(request)[DEVICE_COOKIE], key);
      if (
        existingDevice.actorId === actor.id &&
        typeof existingDevice.deviceId === "string" &&
        existingDevice.deviceId !== ""
      ) {
        deviceId = existingDevice.deviceId;
      }
    } catch {
      // The first successful owner login may enroll the single initial device.
    }
    deviceId ??= randomBytes(24).toString("base64url");
    const enrollmentCodeHash = stateValue.enrollmentCode
      ? createHash("sha256").update(stateValue.enrollmentCode).digest("hex")
      : null;
    await sessionStore.registerAdminDevice({
      deviceId,
      actorId: actor.id,
      enrollmentCodeHash,
    });
    const sessionId = randomBytes(24).toString("base64url");
    const tokenExpiry = actor.authentication?.expiresAt;
    const expiresAt = Number.isSafeInteger(tokenExpiry)
      ? tokenExpiry
      : Math.floor(now() / 1_000) + 60 * 60;
    await sessionStore.createAdminSession({
      sessionId,
      actorId: actor.id,
      deviceId,
      subject: actor.subject ?? actor.authentication?.subject,
      expiresAt: new Date(expiresAt * 1_000).toISOString(),
    });
    const sessionValue = seal(
      { sessionId, accessToken: token.access_token, expiresAt },
      key,
    );
    return adapterResponse(302, "", {
      location: "/admin",
      "set-cookie": [
        cookie(STATE_COOKIE, "", { maxAge: 0, secure }),
        cookie(SESSION_COOKIE, sessionValue, {
          maxAge: Math.max(1, expiresAt - Math.floor(now() / 1_000)),
          secure,
        }),
        cookie(
          DEVICE_COOKIE,
          seal({ deviceId, actorId: actor.id }, key),
          { maxAge: DEVICE_TTL_SECONDS, secure },
        ),
      ],
    });
  }

  async function authenticateAdmin(request, requirements) {
    try {
      const session = unseal(cookies(request)[SESSION_COOKIE], key);
      const device = unseal(cookies(request)[DEVICE_COOKIE], key);
      if (
        !Number.isSafeInteger(session.expiresAt) ||
        session.expiresAt <= Math.floor(now() / 1_000) ||
        typeof device.deviceId !== "string" ||
        device.deviceId === "" ||
        typeof device.actorId !== "string" ||
        device.actorId === ""
      ) {
        return null;
      }
      const registered = await sessionStore.readAdminSession({
        sessionId: session.sessionId,
      });
      if (
        !registered ||
        registered.revoked === true ||
        registered.revokedAt ||
        registered.status !== "ACTIVE" ||
        registered.deviceId !== device.deviceId ||
        registered.actorId !== device.actorId
      ) {
        return null;
      }
      const actor = await authenticateToken(
        {
          ...request,
          headers: {
            ...(request?.headers ?? {}),
            authorization: `Bearer ${session.accessToken}`,
          },
        },
        requirements,
      );
      return actor?.id === registered.actorId ? actor : null;
    } catch {
      return null;
    }
  }

  async function logout(request) {
    try {
      const session = unseal(cookies(request)[SESSION_COOKIE], key);
      const actor = await authenticateAdmin(request);
      await sessionStore.revokeAdminSession({
        sessionId: session.sessionId,
        actorId: actor?.id,
      });
    } catch {
      // Clearing the browser cookie is still fail-safe when the registry is unavailable.
    }
    return adapterResponse(200, JSON.stringify({ status: "OK" }), {
      "content-type": "application/json; charset=utf-8",
      "set-cookie": cookie(SESSION_COOKIE, "", { maxAge: 0, secure }),
    });
  }

  async function createDeviceEnrollmentGrant(request) {
    const actor = await authenticateAdmin(request, { requireFresh: true });
    if (
      !actor ||
      actor.freshAuthentication !== true ||
      !Array.isArray(actor.capabilities) ||
      !actor.capabilities.includes("device.manage")
    ) {
      return adapterResponse(
        403,
        JSON.stringify({ status: "DENIED", code: "FRESH_AUTHENTICATION_REQUIRED" }),
        { "content-type": "application/json; charset=utf-8" },
      );
    }
    const session = unseal(cookies(request)[SESSION_COOKIE], key);
    const enrollmentCode = randomBytes(9).toString("base64url");
    const codeHash = createHash("sha256").update(enrollmentCode).digest("hex");
    const expiresAt = new Date(
      now() + DEVICE_ENROLLMENT_TTL_SECONDS * 1_000,
    ).toISOString();
    await sessionStore.createAdminDeviceEnrollmentGrant({
      actorId: actor.id,
      sessionId: session.sessionId,
      codeHash,
      expiresAt,
    });
    return adapterResponse(
      201,
      JSON.stringify({ status: "OK", enrollmentCode, expiresAt }),
      { "content-type": "application/json; charset=utf-8" },
    );
  }

  return Object.freeze({
    beginLogin,
    completeLogin,
    createDeviceEnrollmentGrant,
    logout,
    authenticateAdmin,
  });
}
