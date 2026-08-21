"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./thca.module.css";

type RailPosition = Readonly<{
  canMoveBackward: boolean;
  canMoveForward: boolean;
}>;

export function ThcaProductRail({
  children,
  heading,
  itemCount,
  scopeKey,
}: Readonly<{
  children: ReactNode;
  heading: string;
  itemCount: number;
  scopeKey: string;
}>) {
  const railRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<RailPosition>({
    canMoveBackward: false,
    canMoveForward: itemCount > 1,
  });

  const updatePosition = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const remaining = rail.scrollWidth - rail.clientWidth - rail.scrollLeft;
    const railBounds = rail.getBoundingClientRect();
    const lastItemBounds = rail.lastElementChild?.getBoundingClientRect();
    const visibleItemCapacity = window.matchMedia("(max-width: 680px)").matches
      ? 1
      : window.matchMedia("(max-width: 1100px)").matches
        ? 2
        : window.matchMedia("(max-width: 1179px)").matches
          ? 3
          : 4;
    const designedToOverflow = itemCount > visibleItemCapacity;
    const nextPosition = {
      canMoveBackward: rail.scrollLeft > 2,
      canMoveForward:
        remaining > 2 ||
        Boolean(lastItemBounds && lastItemBounds.right > railBounds.right + 2) ||
        (rail.scrollLeft <= 2 && designedToOverflow),
    };
    setPosition((currentPosition) =>
      currentPosition.canMoveBackward === nextPosition.canMoveBackward &&
      currentPosition.canMoveForward === nextPosition.canMoveForward
        ? currentPosition
        : nextPosition,
    );
  }, [itemCount]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    rail.scrollTo({ left: 0, behavior: "auto" });
    updatePosition();
    const animationFrame = requestAnimationFrame(updatePosition);
    const observer = new ResizeObserver(updatePosition);
    observer.observe(rail);
    Array.from(rail.children).forEach((child) => observer.observe(child));
    rail.addEventListener("scroll", updatePosition, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      rail.removeEventListener("scroll", updatePosition);
    };
  }, [itemCount, scopeKey, updatePosition]);

  function move(direction: -1 | 1) {
    const rail = railRef.current;
    if (!rail) return;
    if (direction === -1 && !position.canMoveBackward) return;
    if (direction === 1 && !position.canMoveForward) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollBy({
      left: direction * Math.max(240, rail.clientWidth * 0.78),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  return (
    <div className={styles.railFrame}>
      <header className={styles.shelfHeading}>
        <h2 id="thca-shelf-title">{heading}</h2>
        <div className={styles.shelfUtilities}>
          <p aria-live="polite">
            {itemCount} {itemCount === 1 ? "product" : "products"}
          </p>
          <div
            className={styles.railControls}
            data-visible={position.canMoveBackward || position.canMoveForward}
            role="group"
            aria-label="THCA product shelf controls"
          >
            <button
              type="button"
              aria-label="Previous products"
              aria-disabled={!position.canMoveBackward}
              onClick={() => move(-1)}
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              aria-label="Next products"
              aria-disabled={!position.canMoveForward}
              onClick={() => move(1)}
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </header>
      <div
        ref={railRef}
        className={styles.productRail}
        role="region"
        aria-labelledby="thca-shelf-title"
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  );
}
