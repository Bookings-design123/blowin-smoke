import Image from "next/image";
import Link from "next/link";

const shopLinks = [
  { href: "/thca", label: "THCA" },
  { href: "/vape-nicotine", label: "Vape / Nicotine" },
  { href: "/glass-accessories", label: "Glass / Accessories / Merch" },
] as const;

const helpLinks = [
  { href: "/support", label: "Support" },
  { href: "/cart", label: "Cart status" },
] as const;

const houseLinks = [
  { href: "/learn", label: "Learn" },
  { href: "/about", label: "About" },
  { href: "/standards", label: "Standards" },
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
          <h2 className="visually-hidden" id="footer-house-title">
            Blowin’ Smoke
          </h2>
          <Link className="site-footer__identity" href="/" aria-label="Blowin’ Smoke home">
            <Image
              src="/blowin-smoke-logo.png"
              alt=""
              width={8000}
              height={4500}
              sizes="180px"
            />
          </Link>
        </section>

        <nav className="site-footer__nav" aria-label="Footer shop navigation">
          <h2>Shop</h2>
          {shopLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <nav className="site-footer__nav" aria-label="Footer help navigation">
          <h2>Help</h2>
          {helpLinks.map((link) => (
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

        <nav
          className="site-footer__nav site-footer__nav--policies"
          aria-label="Footer policy navigation"
        >
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
