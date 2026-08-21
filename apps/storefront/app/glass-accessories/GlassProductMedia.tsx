"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import styles from "./glass.module.css";

type GlassProductMediaProps = Readonly<{
  productName: string;
  primaryMediaId: string | null;
  alternateMediaId: string | null;
  detailHref: string | null;
  optionDisclosureId: string | null;
}>;

export function GlassProductMedia({
  productName,
  primaryMediaId,
  alternateMediaId,
  detailHref,
  optionDisclosureId,
}: GlassProductMediaProps) {
  const [primaryFailed, setPrimaryFailed] = useState(false);
  const [alternateFailed, setAlternateFailed] = useState(false);
  const resolvedPrimaryMediaId = primaryMediaId && !primaryFailed ? primaryMediaId : null;
  const resolvedAlternateMediaId = alternateMediaId && !alternateFailed ? alternateMediaId : null;
  const hasAlternate = Boolean(resolvedPrimaryMediaId && resolvedAlternateMediaId);
  const imageSizes =
    "(max-width: 680px) 78vw, (max-width: 900px) 43vw, (max-width: 1100px) 32vw, 24vw";
  const media = resolvedPrimaryMediaId ? (
    <>
      <Image
        className={`${styles.productImage} ${hasAlternate ? styles.productImageSwapSource : ""}`}
        src={`/media/${encodeURIComponent(resolvedPrimaryMediaId)}`}
        alt={productName}
        fill
        sizes={imageSizes}
        onError={() => setPrimaryFailed(true)}
      />
      {resolvedAlternateMediaId ? (
        <Image
          className={`${styles.productImage} ${styles.productImageAlternate}`}
          src={`/media/${encodeURIComponent(resolvedAlternateMediaId)}`}
          alt=""
          fill
          sizes={imageSizes}
          onError={() => setAlternateFailed(true)}
        />
      ) : null}
    </>
  ) : resolvedAlternateMediaId ? (
    <Image
      className={styles.productImage}
      src={`/media/${encodeURIComponent(resolvedAlternateMediaId)}`}
      alt={productName}
      fill
      sizes={imageSizes}
      onError={() => setAlternateFailed(true)}
    />
  ) : (
    <div
      className={styles.mediaMissing}
      role="img"
      aria-label={`Product image unavailable for ${productName}`}
    />
  );

  if (detailHref) {
    return (
      <Link
        className={styles.productMedia}
        href={detailHref}
        aria-label={`View ${productName}`}
        tabIndex={-1}
      >
        {media}
      </Link>
    );
  }

  if (optionDisclosureId) {
    return (
      <button
        className={styles.productMedia}
        type="button"
        aria-label={`View options for ${productName}`}
        aria-controls={optionDisclosureId}
        onClick={() => {
          const disclosure = document.getElementById(
            optionDisclosureId,
          ) as HTMLDetailsElement | null;
          if (disclosure?.tagName !== "DETAILS") return;
          disclosure.open = true;
          disclosure.querySelector<HTMLElement>("summary")?.focus();
        }}
      >
        {media}
      </button>
    );
  }

  return <div className={styles.productMedia}>{media}</div>;
}
