import Image from "next/image";
import Link from "next/link";

const divisionRoutes = [
  {
    number: "01",
    label: "THCA",
    mediaWord: "THCA",
    detail: "Choose by format",
    href: "/thca",
    action: "Shop",
    className: "division-portal--thca",
  },
  {
    number: "02",
    label: "Vape / Nicotine",
    mediaWord: "VAPE",
    detail: "Start, replenish, replace",
    href: "/vape-nicotine",
    action: "Shop",
    className: "division-portal--vape",
  },
  {
    number: "03",
    label: "Glass / Accessories / Merch",
    mediaWord: "GLASS",
    detail: "Pieces, parts, care + merch",
    href: "/glass-accessories",
    action: "Shop",
    className: "division-portal--glass",
  },
] as const;

const utilityRoutes = [
  { href: "/learn", label: "Learn", detail: "Decision guides" },
  { href: "/support", label: "Support", detail: "Channel status" },
  { href: "/standards", label: "Standards", detail: "Selection standard" },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="home-opening" aria-labelledby="home-title">
        <div className="home-opening-grid">
          <figure className="home-hero-media">
            <Image
              src="/blowin-smoke-logo.png"
              alt="Blowin’ Smoke"
              width={8000}
              height={4500}
              priority
              sizes="(max-width: 680px) calc(100vw - 28px), (max-width: 1024px) 57vw, 63vw"
            />
          </figure>

          <div className="home-opening-copy">
            <span className="witness-rule" aria-hidden="true" />
            <h1 id="home-title">Who wants that smoke?</h1>
            <Link className="button button--light" href="#shop-by-division">
              Shop the house
            </Link>
          </div>

          <nav
            className="opening-route-strip"
            aria-label="Choose a Blowin’ Smoke division"
          >
            {divisionRoutes.map((division) => (
              <Link key={division.href} href={division.href}>
                <span>{division.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section
        className="home-division-section"
        id="shop-by-division"
        aria-labelledby="division-title"
      >
        <header className="home-division-heading shell">
          <p className="eyebrow">One house. Three divisions.</p>
          <h2 id="division-title">Shop by division</h2>
        </header>

        <div className="division-gallery shell">
          {divisionRoutes.map((division) => (
            <Link
              className={`division-portal ${division.className}`}
              href={division.href}
              key={division.href}
            >
              <span className="division-portal__media" aria-hidden="true">
                <span>{division.mediaWord}</span>
              </span>
              <span className="division-portal__caption">
                <small>{division.number}</small>
                <span className="division-portal__identity">
                  <strong>{division.label}</strong>
                  <span>{division.detail}</span>
                </span>
                <span className="division-portal__action">{division.action}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-utility-section" aria-labelledby="utility-title">
        <h2 className="visually-hidden" id="utility-title">
          Learn, support, and standards
        </h2>
        <nav className="home-utility-rail shell" aria-label="House information">
          {utilityRoutes.map((route) => (
            <Link key={route.href} href={route.href}>
              <span>
                <strong>{route.label}</strong>
                <small>{route.detail}</small>
              </span>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
      </section>
    </>
  );
}
