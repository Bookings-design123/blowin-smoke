import Image from "next/image";
import Link from "next/link";

import {
  HomeMerchandising,
  HomeRetailSequence,
  type HomeMerchandisingContract,
  type HomeRetailModule,
} from "@/components/HomeMerchandising";
import {
  ViewportMedia,
  type AuthoredMediaSet,
} from "@/components/ViewportMedia";

type DivisionRoute = Readonly<{
  number: string;
  label: string;
  mediaWord: string;
  media: AuthoredMediaSet | null;
  detail: string;
  href: string;
  action: string;
  className: string;
}>;

const approvedHeroMedia: AuthoredMediaSet | null = null;
const approvedHomeMerchandising: HomeMerchandisingContract | null = null;
const approvedHomeRetailSequence: readonly HomeRetailModule[] = [];

const divisionRoutes: readonly DivisionRoute[] = [
  {
    number: "01",
    label: "THCA",
    mediaWord: "THCA",
    media: null,
    detail: "Choose by format",
    href: "/thca",
    action: "Shop",
    className: "division-portal--thca",
  },
  {
    number: "02",
    label: "Vape / Nicotine",
    mediaWord: "VAPE",
    media: null,
    detail: "Start, replenish, replace",
    href: "/vape-nicotine",
    action: "Shop",
    className: "division-portal--vape",
  },
  {
    number: "03",
    label: "Glass / Accessories / Merch",
    mediaWord: "GLASS",
    media: null,
    detail: "Pieces, parts, care + merch",
    href: "/glass-accessories",
    action: "Shop",
    className: "division-portal--glass",
  },
];

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
          <figure
            className={`home-hero-media ${
              approvedHeroMedia
                ? "home-hero-media--editorial"
                : "home-hero-media--brand"
            }`}
            data-media-role={
              approvedHeroMedia ? "approved-editorial" : "brand-fallback"
            }
          >
            <span
              className={`home-hero-media__asset${
                approvedHeroMedia ? "" : " home-hero-media__asset--brand"
              }`}
            >
              {approvedHeroMedia ? (
                <ViewportMedia
                  className="authored-media"
                  media={approvedHeroMedia}
                  priority
                  sizes="(max-width: 680px) 100vw, (max-width: 1024px) 62vw, 68vw"
                />
              ) : (
                <Image
                  src="/blowin-smoke-logo.png"
                  alt="Blowin’ Smoke"
                  width={8000}
                  height={4500}
                  priority
                  sizes="(max-width: 680px) 84vw, (max-width: 820px) 62vw, (max-width: 1024px) 42vw, 41vw"
                />
              )}
            </span>
          </figure>

          <div className="home-opening-copy">
            <h1 id="home-title">Who wants that smoke?</h1>
            <Link className="button button--contrast" href="#shop-by-division">
              Shop by division
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

      <HomeMerchandising section={approvedHomeMerchandising} />

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
              <span
                className={`division-portal__media${
                  division.media ? "" : " division-portal__media--fallback"
                }`}
                aria-hidden="true"
              >
                {division.media ? (
                  <ViewportMedia
                    className="authored-media division-portal__picture"
                    media={division.media}
                    sizes="(max-width: 680px) 100vw, 33vw"
                  />
                ) : (
                  <span className="division-portal__fallback-label">
                    {division.mediaWord}
                  </span>
                )}
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

      <HomeRetailSequence modules={approvedHomeRetailSequence} />

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
