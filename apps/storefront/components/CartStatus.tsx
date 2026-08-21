"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function CartStatus({
  onBeforeOpen,
}: Readonly<{ onBeforeOpen?: () => void }>) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    return () => document.documentElement.classList.remove("cart-open");
  }, []);

  function openCartStatus() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;

    onBeforeOpen?.();
    dialog.showModal();
    document.documentElement.classList.add("cart-open");
    setOpen(true);
    window.requestAnimationFrame(() => closeRef.current?.focus());
  }

  function closeCartStatus() {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
  }

  function handleClose() {
    document.documentElement.classList.remove("cart-open");
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
        aria-controls="quick-cart-dialog"
        aria-expanded={open}
        aria-label="Open cart"
        onClick={openCartStatus}
      >
        Cart
      </button>

      <dialog
        ref={dialogRef}
        className="quick-cart"
        id="quick-cart-dialog"
        aria-labelledby="quick-cart-title"
        onClose={handleClose}
        onCancel={(event) => {
          event.preventDefault();
          closeCartStatus();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            closeCartStatus();
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeCartStatus();
        }}
      >
        <div className="quick-cart__panel">
          <div className="quick-cart__head">
            <div>
              <p className="data-label">Cart</p>
              <h2 id="quick-cart-title">The cart is not connected yet.</h2>
            </div>
            <button
              ref={closeRef}
              className="quick-cart__close"
              type="button"
              onClick={closeCartStatus}
            >
              Close
            </button>
          </div>
          <p>
            No cart lines, quantities, totals, reservations, or checkout state
            are stored here. Published inventory does not create a purchase-ready
            cart.
          </p>
          <div className="button-row">
            <Link className="button" href="/cart" onClick={closeCartStatus}>
              Open cart status
            </Link>
            <button
              className="button button--secondary"
              type="button"
              onClick={closeCartStatus}
            >
              Keep browsing
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
