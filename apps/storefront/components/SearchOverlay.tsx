"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const divisionRoutes = [
  { href: "/thca", label: "THCA" },
  { href: "/vape-nicotine", label: "Vape / Nicotine" },
  { href: "/glass-accessories", label: "Glass / Accessories / Merch" },
] as const;

export function SearchOverlay({
  onBeforeOpen,
}: Readonly<{ onBeforeOpen?: () => void }>) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
  }, [pathname]);

  useEffect(() => {
    return () => document.documentElement.classList.remove("search-open");
  }, []);

  function openSearch() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;

    onBeforeOpen?.();
    dialog.showModal();
    document.documentElement.classList.add("search-open");
    setOpen(true);
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  function closeSearch() {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
  }

  function handleClose() {
    document.documentElement.classList.remove("search-open");
    setOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }

  return (
    <>
      <button
        ref={triggerRef}
        className="site-header__utility-link"
        type="button"
        aria-haspopup="dialog"
        aria-controls="search-overlay-dialog"
        aria-expanded={open}
        onClick={openSearch}
      >
        Search
      </button>

      <dialog
        ref={dialogRef}
        className="search-overlay"
        id="search-overlay-dialog"
        aria-labelledby="search-overlay-title"
        onClose={handleClose}
        onCancel={(event) => {
          event.preventDefault();
          closeSearch();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            closeSearch();
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeSearch();
        }}
      >
        <div className="search-overlay__panel">
          <header className="search-overlay__head">
            <div>
              <p className="data-label">Whole-house search</p>
              <h2 id="search-overlay-title">What are you looking for?</h2>
            </div>
            <button
              ref={closeRef}
              className="search-overlay__close"
              type="button"
              onClick={closeSearch}
            >
              Close
            </button>
          </header>

          <form
            className="search-overlay__form"
            action="/search"
            method="get"
            role="search"
          >
            <label className="visually-hidden" htmlFor="header-search-query">
              Search products, divisions, and guides
            </label>
            <input
              ref={inputRef}
              id="header-search-query"
              name="q"
              type="search"
              maxLength={120}
              autoComplete="off"
              enterKeyHint="search"
              placeholder="Product, model, SKU, or guide"
            />
            <button className="button" type="submit">
              Search
            </button>
          </form>

          <nav
            className="search-overlay__routes"
            aria-label="Browse a division instead"
          >
            <p className="data-label">Browse by division</p>
            <div>
              {divisionRoutes.map((route) => (
                <Link key={route.href} href={route.href} onClick={closeSearch}>
                  {route.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </dialog>
    </>
  );
}
