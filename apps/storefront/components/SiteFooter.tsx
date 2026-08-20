import Link from "next/link";

const shopLinks = [
  { href: "/thca", label: "THCA" },
  { href: "/vape-nicotine", label: "Vape / Nicotine" },
  {
    href: "/glass-accessories",
    label: "Glass / Accessories / Merch",
  },
] as const;

const houseLinks = [
  { href: "/learn", label: "Learn" },
  { href: "/support", label: "Support" },
  { href: "/about", label: "About" },
  { href: "/standards", label: "Standards" },
  { href: "/cart", label: "Cart status" },
] as const;

const policyLinks = [
  { href: "/policies", label: "All policies" },
  { href: "/policies/shipping", label: "Shipping" },
  { href: "/policies/returns", label: "Returns & damage" },
  { href: "/policies/privacy", label: "Privacy" },
  { href: "/policies/terms", label: "Terms" },
  { href: "/policies/age-eligibility", label: "Age & eligibility" },
  { href: "/policies/accessibility", label: "Accessibility" },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <section className="site-footer__house" aria-labelledby="footer-house-title">
          <h2 id="footer-house-title">
            <Link href="/">Blowin&apos; Smoke</Link>
          </h2>
          <p>Independent judgment. Exact product truth. A clear next move.</p>
          <p className="site-footer__note">
            One house. Three product-informed divisions.
          </p>
        </section>

        <nav className="site-footer__nav" aria-label="Footer shop navigation">
          <h2>Shop</h2>
          {shopLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <nav className="site-footer__nav" aria-label="Footer house navigation">
          <h2>House</h2>
          {houseLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <nav className="site-footer__nav" aria-label="Footer policy navigation">
          <h2>Policies</h2>
          {policyLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
