import type { DivisionKey } from "./catalog/types";

export type DivisionContent = Readonly<{
  key: DivisionKey;
  slug: string;
  label: string;
  eyebrow: string;
  title: string;
  lede: string;
  mediaLabel: string;
  jobs: readonly Readonly<{ code: string; title: string; body: string; href: string; action: string }>[];
  decisions: readonly Readonly<{ label: string; value: string }>[];
  houseRead: Readonly<{ conclusion: string; rationale: string; limitation: string }>;
}>;

export const DIVISIONS: Readonly<Record<string, DivisionContent>> = {
  thca: {
    key: "THCA",
    slug: "thca",
    label: "THCA",
    eyebrow: "Room 01 · Format + proof",
    title: "Choose the format. Keep the exact record.",
    lede:
      "THCA is one room with different product forms, quantities, proof records, and eligibility questions. Those facts stay separate all the way to the decision.",
    mediaLabel: "Production THCA identity media has not been assigned.",
    jobs: [
      {
        code: "01",
        title: "Browse published THCA",
        body: "See only active, published catalog records. No research candidate becomes merchandise here.",
        href: "/thca/shop",
        action: "Enter the published shelf",
      },
      {
        code: "02",
        title: "Understand proof",
        body: "Learn why product, variant, batch, and proof applicability must stay connected.",
        href: "/learn/thca-proof",
        action: "Read the proof guide",
      },
      {
        code: "03",
        title: "Resolve eligibility",
        body: "Availability is not an eligibility result. Keep an unresolved question unresolved.",
        href: "/support?intent=eligibility",
        action: "Take the question to Support",
      },
    ],
    decisions: [
      { label: "Identity", value: "Exact format and quantity" },
      { label: "Proof", value: "Applicable record, scope, and currentness" },
      { label: "Action", value: "Only after eligibility and readiness resolve" },
    ],
    houseRead: {
      conclusion: "A published record is not automatically ready to buy.",
      rationale: "The house keeps product identity, proof, eligibility, availability, and action as separate states.",
      limitation: "The current public catalog projection does not expose proof applicability or eligibility results.",
    },
  },
  "vape-nicotine": {
    key: "VAPE_NICOTINE",
    slug: "vape-nicotine",
    label: "Vape & Nicotine",
    eyebrow: "Room 02 · Setup + replacement",
    title: "Start with the job, not the aisle.",
    lede:
      "A device, consumable, and replacement can all be legitimate products and still fail each other. Tell us where you are starting.",
    mediaLabel: "Production device-identification media has not been assigned.",
    jobs: [
      {
        code: "I WANT",
        title: "A complete starting setup",
        body: "Begin with the role and the exact parts a complete setup requires.",
        href: "/vape-nicotine/shop",
        action: "Browse published records",
      },
      {
        code: "I OWN",
        title: "A device that needs the right next part",
        body: "Bring the exact model and revision before a relationship is called compatible.",
        href: "/learn/device-identification",
        action: "Identify what you own",
      },
      {
        code: "I NEED",
        title: "A pod, coil, cartridge, or replacement",
        body: "Search by the exact part or package record, then verify the relationship.",
        href: "/search?scope=vape-nicotine",
        action: "Search the house",
      },
    ],
    decisions: [
      { label: "Choose", value: "Device, consumable, replacement, or accessory" },
      { label: "Keep", value: "Exact model, platform, and revision" },
      { label: "Replace", value: "Only through a verified relationship" },
    ],
    houseRead: {
      conclusion: "Familiar names do not prove compatible parts.",
      rationale: "The house starts from what the customer owns and the role of the item being considered.",
      limitation: "The current public catalog projection does not expose verified compatibility relationships.",
    },
  },
  "glass-accessories": {
    key: "GLASS_ACCESSORIES",
    slug: "glass-accessories",
    label: "Glass / Accessories / Merch",
    eyebrow: "Room 03 · Piece + fit + care",
    title: "Start with the piece. Then prove the fit.",
    lede:
      "Complete pieces, fitted parts, care, accessories, and house merch share one room—but only the applicable facts travel with each product.",
    mediaLabel: "Production scale and connection media has not been assigned.",
    jobs: [
      {
        code: "01",
        title: "Complete pieces",
        body: "Start with the complete object, its material, dimensions, and included parts.",
        href: "/glass-accessories/shop",
        action: "Browse published records",
      },
      {
        code: "02",
        title: "Fitted parts",
        body: "Size alone is not fit. Type, gender, angle, orientation, length, and clearance may all matter.",
        href: "/learn/measure-a-connection",
        action: "Measure a connection",
      },
      {
        code: "03",
        title: "Care, accessories, and merch",
        body: "Only applicable care and relationship facts belong to an object; merch does not inherit glass-fit fields.",
        href: "/glass-accessories/shop",
        action: "Enter the room",
      },
    ],
    decisions: [
      { label: "Object", value: "Complete piece, component, accessory, care, or merch" },
      { label: "Fit", value: "Structured geometry and verified endpoints" },
      { label: "Support", value: "Measurement, care, and issue context stay attached" },
    ],
    houseRead: {
      conclusion: "Visual similarity is not a fit record.",
      rationale: "The house names the exact object and keeps geometry, contents, material, and relationship state inspectable.",
      limitation: "The current public catalog projection does not expose physical-fit or required-component records.",
    },
  },
};

export function divisionBySlug(slug: string): DivisionContent | null {
  return DIVISIONS[slug] ?? null;
}
