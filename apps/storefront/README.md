# Blowin' Smoke Storefront

This is the independently deployable, customer-facing Blowin' Smoke application. The existing Admin commerce system remains the sole catalog and inventory authority; this application does not create a second database or inventory truth.

## Permanent global retail token source

Every customer-facing route inherits the Glossier-derived retail baseline captured in `docs/research/glossier/firecrawl/glossier-branding-scrape-2026-08-21.json`. The shared token layer in `app/globals.css` is the required source for storefront typography, the 4px spacing rhythm, white/black/light-gray surfaces, square geometry, shadow-free elevation, controls, inputs, borders, media wells, and standard UI type scale. Division-specific commerce facts may change; division-specific visual systems may not be introduced without explicit owner authorization.

Shared shell, component, card, overlay, and THCA spacing consumes that named ladder directly. Deliberate non-token measurements are limited to functional constraints such as the accessible 44px minimum target, media aspect ratios, one-pixel rules, font metrics, viewport formulas, and coupled horizontal-rail track math; they are not a second spacing language.

The extracted body family, Apercu, is not bundled because no redistributable project license or font file is present. The storefront uses OFL-licensed **DM Sans** as the closest delivered substitute: it has a comparable neutral retail character, high x-height, normal width, and useful small-text weight behavior. Headings request locally installed **Gill Sans** or **Gill Sans MT** first; the proprietary system font is never copied into the application. OFL-licensed **Cabin** is delivered as the deterministic Gill-inspired humanist fallback, followed by the body stack. Archivo is intentionally excluded. Standard UI starts at a 14px body with restrained 16–20px naming and section hierarchy; larger typography is reserved for bounded, evidence-supported campaign and editorial moments.

## Local validation

Use Node.js 20.9 or newer and run commands from this directory:

```sh
cd apps/storefront
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run dev
```

`npm run dev` starts the local Next.js development server. The other commands are the required static, contract, and production-build checks.

## Independent Vercel deployment

Create a separate Vercel project with its **Root Directory** set to `apps/storefront`. Do not attach the storefront build to the existing Admin project and do not manually redeploy Admin as part of storefront deployment.

Configure only this server-side integration variable in the Storefront project:

```text
STOREFRONT_COMMERCE_API_ORIGIN=https://admin.example.com
```

The value must be the absolute `http` or `https` origin of the deployment serving the canonical public commerce reads. It is intentionally server-only: do not rename it with a `NEXT_PUBLIC_` prefix or expose it to browser code.

The storefront consumes these existing Admin endpoints:

- `GET /api/products` — published catalog projection
- `GET /api/products/:sku` — published product lookup by canonical SKU
- `GET /api/media/:mediaId` — canonical product media

Do not provide database, Auth0, Admin-authentication, or object-storage credentials to this application. In particular, the Storefront project must not receive `DATABASE_URL`, `AUTH0_*`, `ADMIN_*`, `AWS_*`, or `S3_*` variables. All canonical reads stay behind the public Admin API boundary.

## Fail-closed commerce boundary

The storefront accepts only complete modern `PUBLISHED` product projections. Legacy, unpublished, and malformed records are suppressed. If the API origin is absent, unreachable, non-successful, or malformed, the UI must show an honest unconfigured or unavailable state; it must not synthesize products, prices, availability, or operational claims.

Publication and positive inventory can support an availability display, but they do not authorize purchase. The current public projection does not provide all required THCA proof and eligibility, Vape/Nicotine role and compatibility, or Glass/Accessories physical-fit and required-parts evidence. Add-to-cart/ready actions therefore remain unavailable. Quick Cart and Full Cart are presentation architecture only until a canonical reservation/cart/checkout boundary exists.

Legal and policy claims, age or shipping eligibility decisions, checkout/purchase behavior, and analytics are also gated off until their canonical specifications and approved integration boundaries exist. Do not infer or hard-code them from competitor research, prototype fixtures, or browser state.

No Admin code, schema, authentication, security boundary, deployment configuration, or production environment variable is changed by this storefront application.
