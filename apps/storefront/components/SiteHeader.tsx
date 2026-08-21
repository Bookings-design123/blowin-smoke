"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { CartStatus } from "@/components/CartStatus";

type RetailAnnouncement = Readonly<{
  message: string;
  action?: Readonly<{
    href: string;
    label: string;
  }>;
}>;

// Deliberately dormant until approved customer-facing retail content exists.
const approvedHomeAnnouncement: RetailAnnouncement | null = null;

const primaryRoutes = [
  {
    href: "/thca",
    label: "THCA",
    detail: "Choose by format",
  },
  {
    href: "/vape-nicotine",
    label: "Vape / Nicotine",
    detail: "Start, replenish, replace",
  },
  {
    href: "/glass-accessories",
    label: "Glass / Accessories / Merch",
    detail: "Pieces, parts, care + merch",
  },
  { href: "/learn", label: "Learn", detail: "Decision guides" },
  {
    href: "/support",
    label: "Support",
    detail: "Channel status",
  },
] as const;

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
  announcement,
}: Readonly<{ announcement: RetailAnnouncement }>) {
  return (
    <div className="site-announcement" aria-label="Store announcement">
      <p>
        {announcement.message}
        {announcement.action ? (
          <Link href={announcement.action.href}>
            {announcement.action.label}
          </Link>
        ) : null}
      </p>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const homeAnnouncement = onHome ? approvedHomeAnnouncement : null;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <header
      className={`site-header${
        homeAnnouncement ? " site-header--with-announcement" : ""
      }`}
    >
      {homeAnnouncement ? (
        <AnnouncementBar announcement={homeAnnouncement} />
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

        <nav className="site-header__desktop" aria-label="Primary navigation">
          {primaryRoutes.map((route) => (
            <Link
              key={route.href}
              className="site-header__nav-link"
              href={route.href}
              aria-current={
                routeIsCurrent(pathname, route.href) ? "page" : undefined
              }
            >
              {route.label}
            </Link>
          ))}
        </nav>

        <nav className="site-header__utilities" aria-label="Shopping utilities">
          <Link
            className="site-header__utility-link"
            href="/search"
            aria-current={pathname === "/search" ? "page" : undefined}
          >
            Search
          </Link>
          <CartStatus />
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
            {primaryRoutes.map((route) => (
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

          <nav className="site-menu__utilities" aria-label="Compact shopping utilities">
            <Link href="/search" onClick={closeMenu}>
              Search the whole house
            </Link>
            <Link href="/cart" onClick={closeMenu}>
              Cart status · unavailable
            </Link>
          </nav>
        </div>
      </dialog>
    </header>
  );
}
