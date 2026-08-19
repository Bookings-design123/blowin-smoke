import { MAX_UPLOAD_BINARY_BYTES } from "./upload-policy.mjs";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function money(amountCents, currency = "USD") {
  if (!Number.isSafeInteger(amountCents)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amountCents / 100);
}

function selectOptions(items, valueKey, label) {
  return items
    .map(
      (item) =>
        `<option value="${escapeHtml(item[valueKey])}">${escapeHtml(label(item))}</option>`,
    )
    .join("");
}

function productRows(products) {
  if (products.length === 0) {
    return '<tr><td colspan="8">No operational products yet.</td></tr>';
  }

  return products
    .map((product) => {
      const skus =
        product.skus ??
        product.variants?.flatMap((variant) =>
          variant.skus ?? (variant.sku ? [variant] : []),
        ) ??
        [];
      const skuSummary =
        skus.length === 0
          ? "No SKU"
          : skus
              .map(
                (sku) =>
                  `${escapeHtml(sku.sku ?? sku.code)} · ${money(
                    sku.retailPrice?.amountCents,
                    sku.retailPrice?.currency,
                  )} · ${escapeHtml(sku.availableQuantity ?? 0)} available`,
              )
              .join("<br>");
      const firstImage = (product.images ?? product.media ?? []).find(
        (image) => image.active !== false && image.lifecycleState !== "REMOVED",
      );
      const image = firstImage
        ? `<img src="/admin/media/${encodeURIComponent(firstImage.id)}" alt="" loading="lazy">`
        : '<span class="image-placeholder">No image</span>';
      return `<tr>
        <td class="product-image">${image}</td>
        <td><strong>${escapeHtml(product.name)}</strong><small>${escapeHtml(product.id)}</small></td>
        <td>${escapeHtml(product.division ?? "UNASSIGNED")}</td>
        <td>${skuSummary}</td>
        <td>${escapeHtml(product.currentQuantity ?? 0)}</td>
        <td>${escapeHtml(product.reservedQuantity ?? 0)}</td>
        <td>${money(product.inventoryValueCents ?? 0)}</td>
        <td><span class="status status--${escapeHtml(
          String(product.publicationState ?? "UNPUBLISHED").toLowerCase(),
        )}">${escapeHtml(product.publicationState ?? "UNPUBLISHED")}</span></td>
      </tr>`;
    })
    .join("");
}

function inventoryRows(entries) {
  if (entries.length === 0) return '<tr><td colspan="7">No inventory events.</td></tr>';
  return entries
    .slice()
    .reverse()
    .slice(0, 80)
    .map(
      (entry) => `<tr>
        <td>${escapeHtml(entry.occurredAt)}</td>
        <td>${escapeHtml(entry.sku)}</td>
        <td>${escapeHtml(entry.eventType)}</td>
        <td>${escapeHtml(entry.quantityDelta ?? 0)}</td>
        <td>${escapeHtml(entry.reservedDelta ?? 0)}</td>
        <td>${escapeHtml(entry.lotCode ?? "—")}</td>
        <td>${escapeHtml(entry.reason ?? entry.disposition ?? "—")}</td>
      </tr>`,
    )
    .join("");
}

function auditRows(records) {
  if (records.length === 0) return '<tr><td colspan="5">No audit records.</td></tr>';
  return records
    .slice()
    .reverse()
    .slice(0, 80)
    .map(
      (record) => `<tr>
        <td>${escapeHtml(record.occurredAt)}</td>
        <td>${escapeHtml(record.action)}</td>
        <td>${escapeHtml(record.actorId)}</td>
        <td>${escapeHtml(record.target?.sku ?? record.target?.productId ?? record.target?.reservationId ?? "—")}</td>
        <td>${escapeHtml(record.result)}</td>
      </tr>`,
    )
    .join("");
}

function supplierRows(suppliers) {
  if (suppliers.length === 0) return '<li>No suppliers yet.</li>';
  return suppliers
    .map(
      (supplier) =>
        `<li><strong>${escapeHtml(supplier.name)}</strong><span>${escapeHtml(
          supplier.code,
        )} · ${escapeHtml(supplier.id)}</span></li>`,
    )
    .join("");
}

function reservationRows(reservations) {
  if (reservations.length === 0) return '<tr><td colspan="5">No reservations.</td></tr>';
  return reservations
    .slice()
    .reverse()
    .map(
      (reservation) => `<tr>
        <td>${escapeHtml(reservation.id)}</td>
        <td>${escapeHtml(reservation.status)}</td>
        <td>${escapeHtml(
          (reservation.items ?? [])
            .map((item) => `${item.sku} × ${item.quantity}`)
            .join(", "),
        )}</td>
        <td>${escapeHtml(reservation.totalCogsCents == null ? "—" : money(reservation.totalCogsCents))}</td>
        <td>${escapeHtml(reservation.expiresAt ?? "—")}</td>
      </tr>`,
    )
    .join("");
}

export function buildAdminPage(dashboard = {}, actor = {}) {
  const products = dashboard.products ?? [];
  const suppliers = dashboard.suppliers ?? [];
  const reservations = dashboard.reservations ?? [];
  const devices = dashboard.devices ?? [];
  const inventoryHistory =
    dashboard.inventoryHistory ??
    products.flatMap((product) => product.inventoryHistory ?? []);
  const audits = dashboard.auditRecords ?? [];
  const productOptions = selectOptions(products, "id", (product) => product.name);
  const skuItems = products.flatMap((product) => {
    const skus =
      product.skus ??
      product.variants?.flatMap((variant) =>
        variant.skus ?? (variant.sku ? [variant] : []),
      ) ??
      [];
    return skus.map((sku) => ({ ...sku, productName: product.name }));
  });
  const skuOptions = selectOptions(
    skuItems,
    "sku",
    (sku) => `${sku.sku ?? sku.code} — ${sku.productName}`,
  );
  const mediaItems = products.flatMap((product) =>
    (product.images ?? product.media ?? []).map((media) => ({
      ...media,
      productName: product.name,
    })),
  );
  const mediaOptions = selectOptions(
    mediaItems,
    "id",
    (media) => `${media.productName} — ${media.filename} — ${media.id}`,
  );
  const lotItems = products.flatMap((product) =>
    (product.lots ?? []).map((lot) => ({ ...lot, productName: product.name })),
  );
  const lotOptions = selectOptions(
    lotItems,
    "id",
    (lot) => `${lot.productName} — ${lot.sku ?? "SKU"} — ${lot.lotCode ?? lot.id}`,
  );
  const supplierOptions = selectOptions(suppliers, "id", (supplier) => supplier.name);
  const reservationOptions = selectOptions(
    reservations.filter((reservation) => reservation.status === "ACTIVE"),
    "id",
    (reservation) => reservation.id,
  );
  const activeDeviceOptions = selectOptions(
    devices.filter((device) => device.status === "ACTIVE"),
    "id",
    (device) => `${device.createdAt ?? "Trusted device"} — ${device.id}`,
  );

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>Blowin' Smoke Admin</title>
  <style>
    :root{color-scheme:light;--ink:#151515;--muted:#666;--line:#d8d5cf;--paper:#f4f1ea;--panel:#fff;--signal:#ddff43;--danger:#9b241c;--radius:14px;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    *{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-size:15px;line-height:1.45}button,input,select,textarea{font:inherit}button,input,select,textarea{min-height:44px;border:1px solid var(--line);border-radius:9px;background:#fff;color:var(--ink);padding:.7rem .8rem}textarea{min-height:88px;resize:vertical}button{cursor:pointer;background:var(--ink);color:#fff;border-color:var(--ink);font-weight:750}button:hover{background:#333}button.secondary{background:#fff;color:var(--ink)}a{color:inherit}.masthead{position:sticky;top:0;z-index:5;display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.85rem clamp(1rem,3vw,2rem);background:rgba(244,241,234,.96);border-bottom:1px solid var(--line);backdrop-filter:blur(10px)}.masthead strong{font-size:1.05rem;letter-spacing:.02em}.masthead small{display:block;color:var(--muted)}main{width:min(1500px,100%);margin:auto;padding:clamp(1rem,3vw,2rem);display:grid;gap:1rem}.hero{background:var(--ink);color:#fff;border-radius:var(--radius);padding:clamp(1.25rem,4vw,2.5rem);display:grid;grid-template-columns:1.5fr 1fr;gap:1rem;align-items:end}.hero h1{font-size:clamp(2rem,6vw,4.75rem);line-height:.9;letter-spacing:-.055em;margin:0;max-width:10ch}.hero p{margin:0;color:#ddd;max-width:52ch}.metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.7rem}.metric{background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);padding:1rem}.metric strong{font-size:1.55rem;display:block}.metric span{color:var(--muted);font-size:.82rem;text-transform:uppercase;letter-spacing:.06em}.panel{background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);padding:clamp(1rem,2vw,1.5rem);min-width:0}.panel h2{margin:0 0 .3rem;font-size:1.3rem}.panel>p{margin:.15rem 0 1rem;color:var(--muted)}.wide{grid-column:1/-1}.workspace{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.7rem}.form-grid label{display:grid;gap:.25rem;color:var(--muted);font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em}.form-grid .full{grid-column:1/-1}.form-grid button{align-self:end}.stack{display:grid;gap:.7rem}.table-wrap{overflow:auto;border:1px solid var(--line);border-radius:10px}table{width:100%;border-collapse:collapse;min-width:760px}th,td{text-align:left;padding:.75rem;border-bottom:1px solid var(--line);vertical-align:top}th{font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;background:#f8f7f3}tr:last-child td{border-bottom:0}.product-image img,.image-placeholder{width:64px;height:64px;border-radius:8px;object-fit:cover;background:#ece9e1;display:grid;place-items:center;font-size:.7rem;color:var(--muted)}td small{display:block;color:var(--muted);max-width:26ch;overflow-wrap:anywhere}.status{display:inline-flex;border-radius:999px;background:#ece9e1;padding:.28rem .55rem;font-size:.72rem;font-weight:800}.status--published{background:var(--signal)}.plain-list{list-style:none;margin:0;padding:0;display:grid;gap:.55rem}.plain-list li{display:flex;justify-content:space-between;gap:1rem;border-bottom:1px solid var(--line);padding-bottom:.55rem}.plain-list span{color:var(--muted);font-size:.8rem;overflow-wrap:anywhere}.notice{display:none;position:fixed;right:1rem;bottom:1rem;z-index:10;max-width:min(420px,calc(100vw - 2rem));padding:1rem;border-radius:10px;background:var(--ink);color:#fff;box-shadow:0 10px 35px #0004}.notice[data-visible="true"]{display:block}.notice[data-error="true"]{background:var(--danger)}details{border-top:1px solid var(--line);padding:.8rem 0}details:first-of-type{border-top:0}summary{cursor:pointer;font-weight:800}.hint{font-size:.78rem;color:var(--muted);margin:.2rem 0 0}
    @media(max-width:900px){.hero,.workspace{grid-template-columns:1fr}.metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.wide{grid-column:auto}.masthead small{display:none}}
    @media(max-width:560px){main{padding:.75rem}.masthead{padding:.7rem .75rem}.hero{border-radius:11px}.metrics{grid-template-columns:1fr 1fr}.form-grid{grid-template-columns:1fr}.form-grid .full{grid-column:auto}.panel{padding:.9rem;border-radius:11px}button,input,select,textarea{width:100%;font-size:16px}.masthead button{width:auto}.table-wrap{margin-inline:-.9rem;border-inline:0;border-radius:0}}
  </style>
</head>
<body>
  <header class="masthead"><div><strong>Blowin' Smoke Admin</strong><small>Canonical Day-1 commerce control</small></div><form data-api data-endpoint="/admin/logout" data-method="POST"><button class="secondary" type="submit">Log out</button></form></header>
  <main>
    <section class="hero"><h1>Run the house.</h1><p>Products, cost, stock, proof, publication, and reservations move through authenticated server commands with immutable inventory and audit history.</p></section>
    <section class="metrics" aria-label="Operational summary">
      <div class="metric"><strong>${products.length}</strong><span>Products</span></div>
      <div class="metric"><strong>${skuItems.reduce((sum, sku) => sum + (sku.availableQuantity ?? 0), 0)}</strong><span>Available units</span></div>
      <div class="metric"><strong>${reservations.filter((item) => item.status === "ACTIVE").length}</strong><span>Active reservations</span></div>
      <div class="metric"><strong>${money(products.reduce((sum, product) => sum + (product.inventoryValueCents ?? 0), 0))}</strong><span>Inventory value</span></div>
    </section>

    <section class="panel wide"><h2>Trusted Admin devices</h2><p>To add the owner's iPhone or desktop, create a short-lived one-time code here, then open <a href="/admin/device-enrollment">device enrollment</a> on the new device. Auth0 will require a fresh passkey check.</p><div class="workspace"><form class="form-grid" data-api data-device-grant data-endpoint="/admin/devices/enrollment-grant" data-method="POST"><button type="submit">Create enrollment code</button><output id="device-enrollment-code" class="hint" aria-live="polite">No active code.</output></form><form class="form-grid" data-api data-endpoint="/admin/devices/[deviceId]" data-method="DELETE"><label>Revoke trusted device<select name="deviceId" required><option value="">Select by enrollment time</option>${activeDeviceOptions}</select></label><button type="submit">Revoke device and sessions</button></form></div><ul class="plain-list">${
      devices.length === 0
        ? "<li>No registered devices.</li>"
        : devices
            .map(
              (device) =>
                `<li><strong>${escapeHtml(device.status)}</strong><span>${escapeHtml(
                  device.createdAt ?? "Unknown enrollment time",
                )} · ${escapeHtml(device.id)}</span></li>`,
            )
            .join("")
    }</ul></section>

    <section class="panel wide"><h2>Catalog and stock</h2><p>Canonical Admin projection. Operational data is not Git-managed.</p><div class="table-wrap"><table><thead><tr><th>Media</th><th>Product</th><th>Division</th><th>SKU / price / availability</th><th>On hand</th><th>Reserved</th><th>Cost value</th><th>State</th></tr></thead><tbody>${productRows(products)}</tbody></table></div></section>

    <div class="workspace">
      <section class="panel"><h2>Catalog commands</h2><p>Create and maintain products, variants, SKUs, prices, and publication.</p>
        <details open><summary>Create product</summary><form class="form-grid" data-api data-endpoint="/admin/products" data-method="POST">
          <label>Name<input name="name" required maxlength="160"></label><label>Division<select name="division" required><option value="THCA">THCA</option><option value="VAPE_NICOTINE">Vape &amp; Nicotine</option><option value="GLASS_ACCESSORIES">Glass &amp; Accessories</option></select></label><label class="full">Description<textarea name="description" maxlength="4000"></textarea></label><button type="submit">Create product</button>
        </form></details>
        <details><summary>Edit or archive product</summary><form class="form-grid" data-api data-endpoint="/admin/products/[productId]" data-method="PUT"><label>Product<select name="productId" required><option value="">Select</option>${productOptions}</select></label><label>Name<input name="name" maxlength="160"></label><label>Division<select name="division"><option value="">No change</option><option value="THCA">THCA</option><option value="VAPE_NICOTINE">Vape &amp; Nicotine</option><option value="GLASS_ACCESSORIES">Glass &amp; Accessories</option></select></label><label class="full">Description<textarea name="description" maxlength="4000"></textarea></label><button type="submit">Save product</button></form><form class="form-grid" data-api data-endpoint="/admin/products/[productId]" data-method="DELETE"><label>Product<select name="productId" required><option value="">Select</option>${productOptions}</select></label><button type="submit">Archive product</button></form></details>
        <details><summary>Create variant / SKU</summary><form class="form-grid" data-api data-endpoint="/admin/products/[productId]/variants" data-method="POST"><label>Product<select name="productId" required><option value="">Select</option>${productOptions}</select></label><label>Variant name<input name="variantName" required maxlength="120"></label><label>SKU<input name="sku" required maxlength="64" autocapitalize="characters"></label><label>Attributes JSON<input name="attributes" data-type="json" value="{}"></label><button type="submit">Create SKU</button></form></details>
        <details><summary>Edit or archive SKU</summary><form class="form-grid" data-api data-endpoint="/admin/skus/[sku]" data-method="PUT"><label>SKU<select name="sku" required><option value="">Select</option>${skuOptions}</select></label><label>New SKU<input name="newSku" maxlength="64"></label><label>Variant name<input name="variantName" maxlength="120"></label><label>Attributes JSON<input name="attributes" data-type="json"></label><button type="submit">Save SKU</button></form><form class="form-grid" data-api data-endpoint="/admin/skus/[sku]" data-method="DELETE"><label>SKU<select name="sku" required><option value="">Select</option>${skuOptions}</select></label><button type="submit">Archive SKU</button></form></details>
        <details><summary>Price and publication</summary><form class="form-grid" data-api data-endpoint="/admin/skus/[sku]/retail-price" data-method="PUT"><label>SKU<select name="sku" required><option value="">Select</option>${skuOptions}</select></label><label>Price, cents<input name="amountCents" type="number" min="0" step="1" data-type="integer" required></label><input name="currency" type="hidden" value="USD"><button type="submit">Set retail price</button></form><form class="form-grid" data-api data-endpoint="/admin/products/[productId]/publish" data-method="POST"><label>Product<select name="productId" required><option value="">Select</option>${productOptions}</select></label><button type="submit">Publish</button></form><form class="form-grid" data-api data-endpoint="/admin/products/[productId]/unpublish" data-method="POST"><label>Product<select name="productId" required><option value="">Select</option>${productOptions}</select></label><button type="submit">Unpublish</button></form></details>
      </section>

      <section class="panel"><h2>Supplier, receiving, and stock</h2><p>All quantities derive from immutable ledger events; costs use integer cents.</p>
        <details open><summary>Add supplier</summary><form class="form-grid" data-api data-endpoint="/admin/suppliers" data-method="POST"><label>Name<input name="name" required maxlength="160"></label><label>Code<input name="code" required maxlength="48" autocapitalize="characters"></label><button type="submit">Add supplier</button></form></details>
        <details><summary>Receive inventory + cost</summary><form class="form-grid" data-api data-endpoint="/admin/skus/[sku]/receipts" data-method="POST"><label>SKU<select name="sku" required><option value="">Select</option>${skuOptions}</select></label><label>Supplier<select name="supplierId" required><option value="">Select</option>${supplierOptions}</select></label><label>Quantity<input name="quantityDelta" type="number" min="1" step="1" data-type="integer" required></label><label>Unit cost, cents<input name="unitCostCents" type="number" min="0" step="1" data-type="integer" required></label><label>Lot code<input name="lotCode" required maxlength="96"></label><input name="currency" type="hidden" value="USD"><button type="submit">Receive stock</button></form></details>
        <details><summary>Adjust inventory</summary><form class="form-grid" data-api data-endpoint="/admin/skus/[sku]/adjustments" data-method="POST"><label>SKU<select name="sku" required><option value="">Select</option>${skuOptions}</select></label><label>Quantity delta<input name="quantityDelta" type="number" step="1" data-type="integer" required></label><label class="full">Reason<input name="reason" required maxlength="240"></label><label>Positive-unit cost, cents<input name="unitCostCents" type="number" min="0" step="1" data-type="integer"></label><input name="currency" type="hidden" value="USD"><button type="submit">Post adjustment</button></form><p class="hint">Negative adjustments cannot exceed unreserved available stock.</p></details>
        <h3>Suppliers</h3><ul class="plain-list">${supplierRows(suppliers)}</ul>
      </section>

      <section class="panel"><h2>Media and evidence</h2><p>Uploads pass server-side type validation. Public images are decoded and re-encoded without EXIF/GPS metadata; masters remain private. Maximum source file size: 3 MiB.</p>
        <details open><summary>Upload product image</summary><form class="form-grid" data-api data-file-upload data-endpoint="/admin/products/[productId]/images" data-method="POST"><label>Product<select name="productId" required><option value="">Select</option>${productOptions}</select></label><label>Image<input name="file" type="file" accept="image/jpeg,image/png,image/webp" required></label><button type="submit">Upload image</button></form></details>
        <details><summary>Replace product image</summary><form class="form-grid" data-api data-file-upload data-endpoint="/admin/products/[productId]/images/[previousMediaId]" data-method="PUT"><label>Product<select name="productId" required><option value="">Select</option>${productOptions}</select></label><label>Existing image<select name="previousMediaId" required><option value="">Select</option>${mediaOptions}</select></label><label>Replacement image<input name="file" type="file" accept="image/jpeg,image/png,image/webp" required></label><button type="submit">Replace image</button></form></details>
        <details><summary>Remove product image</summary><form class="form-grid" data-api data-endpoint="/admin/products/[productId]/images/[mediaId]" data-method="DELETE"><label>Product<select name="productId" required><option value="">Select</option>${productOptions}</select></label><label>Image<select name="mediaId" required><option value="">Select</option>${mediaOptions}</select></label><button type="submit">Remove image</button></form></details>
        <details><summary>Attach COA / evidence</summary><form class="form-grid" data-api data-file-upload data-endpoint="/admin/evidence" data-method="POST"><label>Product (optional)<select name="productId"><option value="">Select</option>${productOptions}</select></label><label>Lot (optional)<select name="lotId"><option value="">Select</option>${lotOptions}</select></label><label>Kind<select name="kind"><option value="COA">COA</option><option value="SUPPLIER_DOCUMENT">Supplier document</option><option value="PRODUCT_EVIDENCE">Product evidence</option></select></label><label>PDF or image<input name="file" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" required></label><button type="submit">Attach evidence</button></form><p class="hint">Select the product, the receiving lot, or both. Lot choices display their product and SKU.</p></details>
      </section>

      <section class="panel"><h2>Order reservations</h2><p>Reservation commands lock canonical SKU state and fail when requested quantity exceeds availability.</p>
        <details open><summary>Create reservation</summary><form class="form-grid" data-api data-endpoint="/admin/reservations" data-method="POST"><label class="full">Items JSON<textarea name="items" data-type="json" required>[{"sku":"","quantity":1}]</textarea></label><label>Expires at<input name="expiresAt" type="datetime-local"></label><button type="submit">Reserve stock</button></form></details>
        <details><summary>Commit reservation</summary><form class="form-grid" data-api data-endpoint="/admin/reservations/[reservationId]/commit" data-method="POST"><label>Reservation<select name="reservationId" required><option value="">Select</option>${reservationOptions}</select></label><button type="submit">Commit order</button></form></details>
        <details><summary>Release reservation</summary><form class="form-grid" data-api data-endpoint="/admin/reservations/[reservationId]/release" data-method="POST"><label>Reservation<select name="reservationId" required><option value="">Select</option>${reservationOptions}</select></label><button type="submit">Release stock</button></form></details>
        <div class="table-wrap"><table><thead><tr><th>ID</th><th>Status</th><th>Items</th><th>COGS</th><th>Expiry</th></tr></thead><tbody>${reservationRows(reservations)}</tbody></table></div>
      </section>
    </div>

    <section class="panel wide"><h2>Inventory history</h2><p>Physical and reserved deltas remain append-only.</p><div class="table-wrap"><table><thead><tr><th>Time</th><th>SKU</th><th>Event</th><th>Physical Δ</th><th>Reserved Δ</th><th>Lot</th><th>Reason</th></tr></thead><tbody>${inventoryRows(inventoryHistory)}</tbody></table></div></section>
    <section class="panel wide"><h2>Audit history</h2><p>Material commands are attributed and versioned.</p><div class="table-wrap"><table><thead><tr><th>Time</th><th>Action</th><th>Actor</th><th>Target</th><th>Result</th></tr></thead><tbody>${auditRows(audits)}</tbody></table></div></section>
  </main>
  <div id="notice" class="notice" role="status" aria-live="polite"></div>
  <script type="module">
    const notice=document.querySelector("#notice");
    const show=(message,error=false)=>{notice.textContent=message;notice.dataset.visible="true";notice.dataset.error=String(error);window.setTimeout(()=>{notice.dataset.visible="false"},5000)};
    const maximumUploadBytes=${MAX_UPLOAD_BINARY_BYTES};
    const base64=async(file)=>{if(file.size>maximumUploadBytes)throw new Error("File exceeds the 3 MiB upload limit");const bytes=new Uint8Array(await file.arrayBuffer());let binary="";const size=0x8000;for(let i=0;i<bytes.length;i+=size)binary+=String.fromCharCode(...bytes.subarray(i,i+size));return btoa(binary)};
    document.addEventListener("submit",async(event)=>{
      const form=event.target.closest("form[data-api]");if(!form)return;event.preventDefault();
      const button=form.querySelector("button[type=submit]");if(button)button.disabled=true;
      try{
        const data=new FormData(form);const body={};
        for(const [key,value] of data.entries()){
          if(value instanceof File){if(value.size===0)continue;body.filename=value.name;body.mimeType=value.type;body.contentBase64=await base64(value);continue}
          if(value==="")continue;
          const input=form.elements.namedItem(key);
          if(input?.dataset?.type==="integer"){const number=Number(value);if(!Number.isSafeInteger(number))throw new Error(key+" must be an integer");body[key]=number}
          else if(input?.dataset?.type==="json"){body[key]=JSON.parse(value)}
          else body[key]=value;
        }
        let endpoint=form.dataset.endpoint;
        for(const [key,value] of Object.entries(body))endpoint=endpoint.replaceAll("["+key+"]",encodeURIComponent(String(value)));
        if(endpoint.includes("["))throw new Error("A required route value is missing");
        const headers={"content-type":"application/json","idempotency-key":crypto.randomUUID(),"x-correlation-id":crypto.randomUUID()};
        const result=await fetch(endpoint,{method:form.dataset.method,credentials:"same-origin",headers,body:JSON.stringify(body)});
        const payload=await result.json().catch(()=>({}));
        if(!result.ok)throw new Error(payload.code||"COMMAND_FAILED");
        if(payload.enrollmentCode){document.querySelector("#device-enrollment-code").textContent="Code: "+payload.enrollmentCode+" · expires "+payload.expiresAt;show("Enrollment code created");return}
        show("Command completed");window.setTimeout(()=>location.reload(),350);
      }catch(error){show(error.message||"Command failed",true)}finally{if(button)button.disabled=false}
    });
  </script>
</body>
</html>`;
}
