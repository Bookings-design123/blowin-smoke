"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { CartStatus } from "@/components/CartStatus";
import { SearchOverlay } from "@/components/SearchOverlay";
import { DIVISIONS } from "@/lib/divisions";

type RetailAnnouncement = Readonly<{
  id: string;
  message: string;
  action?: Readonly<{
    href: string;
    label: string;
  }>;
}>;

type RetailAnnouncementProgram = Readonly<{
  items: readonly RetailAnnouncement[];
  autoAdvanceMs: number | null;
}>;

// Deliberately dormant until approved customer-facing retail content exists.
const approvedAnnouncementProgram: RetailAnnouncementProgram = {
  items: [],
  autoAdvanceMs: null,
};

const divisionRoutes = [
  {
    href: "/thca",
    shopHref: "/thca/shop",
    label: "THCA",
    detail: "Choose by format",
    division: DIVISIONS.thca,
  },
  {
    href: "/vape-nicotine",
    shopHref: "/vape-nicotine/shop",
    label: "Vape / Nicotine",
    detail: "Start, replenish, replace",
    division: DIVISIONS["vape-nicotine"],
  },
  {
    href: "/glass-accessories",
    shopHref: "/glass-accessories/shop",
    label: "Glass / Accessories / Merch",
    detail: "Pieces, parts, care + merch",
    division: DIVISIONS["glass-accessories"],
  },
] as const;

const informationRoutes = [
  { href: "/learn", label: "Learn", detail: "Decision guides" },
  { href: "/support", label: "Support", detail: "Get help" },
] as const;

const compactRoutes = [...divisionRoutes, ...informationRoutes] as const;

const contextRoutes = [
  { match: "/products", label: "Product" },
  { match: "/glass-accessories", label: "Glass / Accessories / Merch" },
  { match: "/vape-nicotine", label: "Vape / Nicotine" },
  { match: "/thca", label: "THCA" },
  { match: "/search", label: "Search" },
  { match: "/cart", label: "Cart" },
  { match: "/learn", label: "Learn" },
  { match: "/support", label: "Support" },
  { match: "/about", label: "About" },
  { match: "/standards", label: "Standards" },
  { match: "/policies", label: "Policies" },
] as const;

function routeIsCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function currentContext(pathname: string) {
  if (pathname === "/") return "Home";

  return (
    contextRoutes.find(
      ({ match }) => pathname === match || pathname.startsWith(`${match}/`),
    )?.label ?? "Storefront"
  );
}

function AnnouncementBar({
  program,
}: Readonly<{ program: RetailAnnouncementProgram }>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [manualStatus, setManualStatus] = useState<
    Readonly<{ serial: number; message: string }> | undefined
  >();
  const itemCount = program.items.length;
  const isSequence = itemCount > 1;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(preference.matches);

    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (
      !isSequence ||
      paused ||
      prefersReducedMotion ||
      program.autoAdvanceMs === null ||
      program.autoAdvanceMs <= 0
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % itemCount);
    }, program.autoAdvanceMs);

    return () => window.clearInterval(timer);
  }, [
    isSequence,
    itemCount,
    paused,
    prefersReducedMotion,
    program.autoAdvanceMs,
  ]);

  if (itemCount === 0) return null;

  const announcement = program.items[activeIndex] ?? program.items[0];

  function move(direction: -1 | 1) {
    const nextIndex = (activeIndex + direction + itemCount) % itemCount;
    const nextAnnouncement = program.items[nextIndex] ?? program.items[0];

    setActiveIndex(nextIndex);
    setManualStatus((status) => ({
      serial: (status?.serial ?? 0) + 1,
      message: nextAnnouncement.message,
    }));
  }

  return (
    <section
      className="site-announcement"
      aria-label="Store announcements"
      aria-roledescription={isSequence ? "carousel" : undefined}
    >
      {isSequence ? (
        <button
          className="site-announcement__control"
          type="button"
          aria-label="Previous announcement"
          onClick={() => move(-1)}
        >
          <span aria-hidden="true">←</span>
        </button>
      ) : null}

      <p
        className="site-announcement__message"
        key={announcement.id}
      >
        {announcement.message}
        {announcement.action ? (
          <Link href={announcement.action.href}>
            {announcement.action.label}
          </Link>
        ) : null}
      </p>

      <span
        className="visually-hidden"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        key={manualStatus?.serial}
      >
        {manualStatus?.message ?? ""}
      </span>

      {isSequence ? (
        <div className="site-announcement__controls">
          <button
            className="site-announcement__control"
            type="button"
            aria-label="Next announcement"
            onClick={() => move(1)}
          >
            <span aria-hidden="true">→</span>
          </button>
          {program.autoAdvanceMs !== null && !prefersReducedMotion ? (
            <button
              className="site-announcement__control"
              type="button"
              aria-label={paused ? "Play announcements" : "Pause announcements"}
              aria-pressed={paused}
              onClick={() => setPaused((value) => !value)}
            >
              <span aria-hidden="true">{paused ? "Play" : "Pause"}</span>
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const hasAnnouncement = approvedAnnouncementProgram.items.length > 0;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const megaTriggerRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const suppressMegaFocusOpenRef = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
  }, [pathname]);

  useEffect(() => {
    return () => document.documentElement.classList.remove("menu-open");
  }, []);

  function openMenu() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;

    setActiveMegaMenu(null);
    dialog.showModal();
    document.documentElement.classList.add("menu-open");
    setMenuOpen(true);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());
  }

  function closeMenu() {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
  }

  function handleDialogClose() {
    document.documentElement.classList.remove("menu-open");
    setMenuOpen(false);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  }

  function closeMegaMenu(href?: string) {
    const previousMenu = activeMegaMenu;
    setActiveMegaMenu(null);
    if (href ?? previousMenu) {
      suppressMegaFocusOpenRef.current = true;
      window.requestAnimationFrame(() => {
        megaTriggerRefs.current[href ?? previousMenu ?? ""]?.focus();
        window.requestAnimationFrame(() => {
          suppressMegaFocusOpenRef.current = false;
        });
      });
    }
  }

  return (
    <header
      className={`site-header${
        hasAnnouncement ? " site-header--with-announcement" : ""
      }`}
      onKeyDown={(event) => {
        if (event.key === "Escape" && activeMegaMenu) {
          event.preventDefault();
          closeMegaMenu();
        }
      }}
    >
      {hasAnnouncement ? (
        <AnnouncementBar program={approvedAnnouncementProgram} />
      ) : null}

      <div className="site-header__inner">
        <Link
          className="site-header__identity"
          href="/"
          aria-label="Blowin’ Smoke home"
          aria-current={pathname === "/" ? "page" : undefined}
        >
          <Image
            src="/blowin-smoke-logo.png"
            alt=""
            width={8000}
            height={4500}
            priority
            sizes="(max-width: 350px) 80px, (max-width: 680px) 96px, 126px"
          />
        </Link>

        {!onHome ? (
          <span className="site-header__context" title={currentContext(pathname)}>
            {currentContext(pathname)}
          </span>
        ) : null}

        <nav className="site-header__desktop" aria-label="Shop by division">
          {divisionRoutes.map((route) => {
            const expanded = activeMegaMenu === route.href;
            const menuId = `mega-${route.division.slug}`;

            return (
              <div
                className="site-header__nav-item"
                key={route.href}
                onMouseEnter={() => setActiveMegaMenu(route.href)}
                onMouseLeave={(event) => {
                  if (!event.currentTarget.contains(document.activeElement)) {
                    setActiveMegaMenu(null);
                  }
                }}
                onFocusCapture={() => {
                  if (!suppressMegaFocusOpenRef.current) {
                    setActiveMegaMenu(route.href);
                  }
                }}
                onBlurCapture={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setActiveMegaMenu(null);
                  }
                }}
              >
                <Link
                  ref={(node) => {
                    megaTriggerRefs.current[route.href] = node;
                  }}
                  className="site-header__nav-link"
                  href={route.href}
                  aria-current={
                    routeIsCurrent(pathname, route.href) ? "page" : undefined
                  }
                  aria-haspopup="true"
                  aria-controls={menuId}
                  aria-expanded={expanded}
                  onClick={() => setActiveMegaMenu(null)}
                >
                  {route.label}
                </Link>

                {expanded ? (
                  <section
                    className="site-header__mega"
                    id={menuId}
                    aria-label={`${route.label} menu`}
                  >
                    <div className="site-header__mega-inner shell">
                      <div className="site-header__mega-column">
                        <p className="data-label">Shop</p>
                        <Link href={route.href} onClick={() => setActiveMegaMenu(null)}>
                          {route.label} home
                        </Link>
                        <Link
                          href={route.shopHref}
                          onClick={() => setActiveMegaMenu(null)}
                        >
                          Shop all
                        </Link>
                      </div>

                      <div className="site-header__mega-column site-header__mega-column--routes">
                        <p className="data-label">Start with</p>
                        {route.division.jobs.map((job) => (
                          <Link
                            href={job.href}
                            key={`${route.href}-${job.code}`}
                            onClick={() => setActiveMegaMenu(null)}
                          >
                            {job.title}
                          </Link>
                        ))}
                      </div>

                      <Link
                        className="site-header__mega-feature"
                        href={route.href}
                        onClick={() => setActiveMegaMenu(null)}
                      >
                        <span className="data-label">{route.detail}</span>
                        <strong>{route.division.title}</strong>
                        <span>Explore the division</span>
                      </Link>
                    </div>
                  </section>
                ) : null}
              </div>
            );
          })}
        </nav>

        <nav className="site-header__utilities" aria-label="Store utilities">
          <SearchOverlay onBeforeOpen={() => setActiveMegaMenu(null)} />
          <CartStatus onBeforeOpen={() => setActiveMegaMenu(null)} />
          {informationRoutes.map((route) => (
            <Link
              className="site-header__utility-link site-header__info-link"
              href={route.href}
              key={route.href}
              aria-current={
                routeIsCurrent(pathname, route.href) ? "page" : undefined
              }
            >
              {route.label}
            </Link>
          ))}
          <button
            ref={menuButtonRef}
            className="site-header__menu-button"
            type="button"
            aria-haspopup="dialog"
            aria-controls="site-menu-dialog"
            aria-expanded={menuOpen}
            onClick={openMenu}
          >
            Menu
          </button>
        </nav>
      </div>

      <dialog
        ref={dialogRef}
        className="site-menu"
        id="site-menu-dialog"
        aria-labelledby="site-menu-title"
        onClose={handleDialogClose}
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            closeMenu();
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
      >
        <div className="site-menu__panel">
          <div className="site-menu__head">
            <div>
              <p className="data-label">
                Current page · {currentContext(pathname)}
              </p>
              <h2 id="site-menu-title">Menu</h2>
            </div>
            <button
              ref={closeButtonRef}
              className="site-menu__close"
              type="button"
              onClick={closeMenu}
            >
              Close
            </button>
          </div>

          <nav className="site-menu__nav" aria-label="Compact primary navigation">
            {compactRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                aria-current={
                  routeIsCurrent(pathname, route.href) ? "page" : undefined
                }
                onClick={closeMenu}
              >
                <span className="site-menu__route-copy">
                  <strong>{route.label}</strong>
                  <small>{route.detail}</small>
                </span>
                {routeIsCurrent(pathname, route.href) ? (
                  <span className="site-menu__current">Current</span>
                ) : null}
              </Link>
            ))}
          </nav>

          <nav className="site-menu__utilities" aria-label="Compact store utilities">
            <Link href="/search" onClick={closeMenu}>
              Search
            </Link>
            <Link href="/cart" onClick={closeMenu}>
              Cart
            </Link>
          </nav>
        </div>
      </dialog>
    </header>
  );
}
