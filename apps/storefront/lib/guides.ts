export type Guide = Readonly<{
  slug: string;
  eyebrow: string;
  title: string;
  outcome: string;
  forWhom: string;
  limits: string;
  steps: readonly Readonly<{ title: string; body: string }>[];
  verify: string;
  recovery: string;
  owner: string;
  sourceBasis: string;
  reviewed: string;
}>;

export const GUIDES: readonly Guide[] = [
  {
    slug: "thca-proof",
    eyebrow: "Verify · THCA",
    title: "Keep proof attached to the exact record.",
    outcome: "Understand what has to match before a proof document can inform a product decision.",
    forWhom: "Customers comparing a THCA product form, quantity, or selected record.",
    limits:
      "This guide does not determine legal eligibility, safety, composition, or purchase readiness and does not replace an applicable proof document.",
    steps: [
      { title: "Name the product state", body: "Keep the product, exact option, quantity, and any batch or lot identity separate." },
      { title: "Check applicability", body: "A document must name the scope it supports. Similar titles and packaging are not a match." },
      { title: "Check status", body: "Current, stale, missing, unmatched, and superseded are different conclusions." },
      { title: "Keep eligibility separate", body: "A current proof record does not establish customer or destination eligibility." },
    ],
    verify: "The product, selected option, batch where applicable, document, status, and date should form one traceable record.",
    recovery: "If any link is missing or unclear, stop at unknown and carry the exact product context to Support.",
    owner: "Blowin’ Smoke storefront system specification",
    sourceBasis: "Canonical proof-scope and evidence-firewall requirements",
    reviewed: "Production content review date not published",
  },
  {
    slug: "device-identification",
    eyebrow: "Identify · Vape & Nicotine",
    title: "Bring the exact device, not just the family name.",
    outcome: "Collect the identity cues needed before asking whether a replacement or consumable works with what you own.",
    forWhom: "Customers replacing a pod, cartridge, coil, tank, consumable, or other device-specific part.",
    limits:
      "A matching name, visual resemblance, or shared brand does not establish compatibility. Only a governed relationship can do that.",
    steps: [
      { title: "Find the model", body: "Record the full model name exactly as it appears on the device, package, or trusted record." },
      { title: "Find the revision", body: "Look for generation, revision, platform, or connector details that distinguish similar versions." },
      { title: "Name the needed role", body: "State whether you need a consumable, replacement component, accessory, or complete setup." },
      { title: "Verify both endpoints", body: "The owned device and proposed item must be named in the same scoped relationship." },
    ],
    verify: "The final answer should identify both exact endpoints, the relationship state, any conditions, and the evidence scope.",
    recovery: "When the revision or relationship is unknown, preserve the model details and ask Support instead of guessing.",
    owner: "Blowin’ Smoke storefront system specification",
    sourceBasis: "Canonical product-role and relationship-state requirements",
    reviewed: "Production content review date not published",
  },
  {
    slug: "measure-a-connection",
    eyebrow: "Measure · Glass & Accessories",
    title: "Measure the route, not the resemblance.",
    outcome: "Collect the physical details that can change whether two pieces connect and clear safely.",
    forWhom: "Customers comparing a fitted component, replacement part, adapter, or complete piece.",
    limits:
      "A drawing, photo, nominal size, or this guide alone cannot certify fit. Measurement method and pair verification still matter.",
    steps: [
      { title: "Name both objects", body: "Record the complete piece and the exact component or adapter under consideration." },
      { title: "Record the connection", body: "Keep size, type, gender, angle, and orientation as separate fields." },
      { title: "Check the assembled path", body: "Length, insertion depth, surrounding clearance, and any intermediary can change the outcome." },
      { title: "Keep unknowns visible", body: "If one measurement is missing, the relationship remains unresolved rather than approximately compatible." },
    ],
    verify: "A fit conclusion should name the endpoints, measurements, conditions, method, and current verification state.",
    recovery: "Carry the exact objects and unresolved measurement to Support; do not infer fit from appearance.",
    owner: "Blowin’ Smoke storefront system specification",
    sourceBasis: "Canonical physical-fit and measurement requirements",
    reviewed: "Production content review date not published",
  },
] as const;

export function guideBySlug(slug: string): Guide | null {
  return GUIDES.find((guide) => guide.slug === slug) ?? null;
}
