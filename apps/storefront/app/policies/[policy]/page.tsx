import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type PolicyDefinition = Readonly<{
  title: string;
  summary: string;
  unresolved: readonly string[];
  authority: string;
}>;

const POLICIES = {
  shipping: {
    title: "Shipping",
    summary:
      "No customer-facing shipping policy has been approved or published.",
    unresolved: [
      "Eligible destinations and product combinations",
      "Carriers, services, rates, packaging, and taxes",
      "Processing, transit, tracking, exception, and loss procedures",
    ],
    authority:
      "Qualified compliance decisions and an owner-approved carrier and operations policy are still required.",
  },
  returns: {
    title: "Returns & damage",
    summary:
      "No customer-facing return, exchange, warranty, or damage policy has been approved or published.",
    unresolved: [
      "Eligibility, windows, conditions, exclusions, and required records",
      "Defect, damage, missing-part, and fragile-item procedures",
      "Refund, replacement, disposition, and escalation authority",
    ],
    authority:
      "An owner-approved operations and policy matrix, with the systems needed to carry it out, is still required.",
  },
  privacy: {
    title: "Privacy",
    summary:
      "No customer-facing privacy policy has been approved or published.",
    unresolved: [
      "Purposes and categories of any customer data collection",
      "Processors, consent, retention, access, correction, and deletion",
      "Sensitive age, eligibility, order, support, and analytics boundaries",
    ],
    authority:
      "Qualified privacy and security decisions plus an accountable data-governance record are still required.",
  },
  terms: {
    title: "Terms",
    summary:
      "No customer-facing terms of use or sale have been approved or published.",
    unresolved: [
      "The scope and effective version of any agreement",
      "Customer and merchant responsibilities",
      "Purchase, payment, cancellation, dispute, and governing provisions",
    ],
    authority:
      "Qualified legal review and owner approval are still required. This page is not a contract.",
  },
  "age-eligibility": {
    title: "Age & eligibility",
    summary:
      "No customer-facing age-verification or product-eligibility policy has been approved or published.",
    unresolved: [
      "Exact age, product, customer, destination, and surface scope",
      "Verification timing, provider, retry, and failure behavior",
      "Privacy, retention, audit, and handoff requirements",
    ],
    authority:
      "A qualified current compliance and privacy rule set is still required. No age threshold is asserted here.",
  },
  accessibility: {
    title: "Accessibility",
    summary:
      "No customer-facing accessibility policy or conformance statement has been approved or published.",
    unresolved: [
      "The accountable accessibility standard and statement scope",
      "Testing, reporting, remediation, and review procedures",
      "A governed route for accessibility feedback and assistance",
    ],
    authority:
      "Production testing and an owner-approved accessibility policy are still required. This route makes no conformance claim.",
  },
  "product-warnings": {
    title: "Product warnings",
    summary:
      "No complete customer-facing product-warning policy has been approved or published.",
    unresolved: [
      "Applicable product, format, and jurisdiction scope",
      "Authoritative warning language and placement",
      "Versioning, correction, and product-record linkage",
    ],
    authority:
      "Qualified product and compliance authority is still required. Research or merchandising copy cannot supply a warning rule.",
  },
  "authenticity-proof": {
    title: "Authenticity & proof",
    summary:
      "No complete customer-facing authenticity or proof policy has been approved or published.",
    unresolved: [
      "Supplier, maker, laboratory, document, and rights requirements",
      "Exact product, variant, lot, batch, and time applicability",
      "Currentness, correction, archive, and customer-access behavior",
    ],
    authority:
      "Qualified proof governance and real applicable records are still required. No certification or product approval is implied.",
  },
} as const satisfies Readonly<Record<string, PolicyDefinition>>;

type PolicyPageProps = Readonly<{
  params: Promise<{ policy: string }>;
}>;

function policyDefinition(slug: string): PolicyDefinition | undefined {
  return POLICIES[slug as keyof typeof POLICIES];
}

export function generateStaticParams() {
  return Object.keys(POLICIES).map((policy) => ({ policy }));
}

export async function generateMetadata({
  params,
}: PolicyPageProps): Promise<Metadata> {
  const { policy: slug } = await params;
  const policy = policyDefinition(slug);

  if (!policy) {
    return { title: "Policy not found", robots: { index: false } };
  }

  return {
    title: `${policy.title} policy status`,
    description: policy.summary,
    robots: { index: false, follow: true },
  };
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { policy: slug } = await params;
  const policy = policyDefinition(slug);

  if (!policy) notFound();

  return (
    <>
      <section className="section shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/policies">Policies</Link>
            </li>
            <li aria-current="page">{policy.title}</li>
          </ol>
        </nav>
        <p className="eyebrow">Policy status</p>
        <h1 className="quiet-h1">{policy.title}</h1>
        <p className="lede measure">{policy.summary}</p>
      </section>

      <section className="section section-compact bright">
        <div className="shell">
          <div className="state-panel state-blocked" role="status">
            <p className="data-label">Not governed · Not published</p>
            <h2>This route does not create customer terms.</h2>
            <p className="measure">
              The absence of a published policy remains visible. Competitor terms,
              prototype copy, research notes, and operating intent are not being
              substituted for an approved commitment.
            </p>
          </div>

          <h2>What remains unresolved</h2>
          <ul>
            {policy.unresolved.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <details className="disclosure">
            <summary>Authority still required</summary>
            <p className="measure">{policy.authority}</p>
          </details>

          <div className="button-row">
            <Link className="button" href="/policies">
              Review all policy gaps
            </Link>
            <Link className="button secondary" href="/support">
              Use available guidance
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
