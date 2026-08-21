"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import styles from "./thca.module.css";

type ThcaProductMediaProps = Readonly<{
  productName: string;
  primaryMediaId: string | null;
  alternateMediaId: string | null;
  detailHref: string | null;
}>;

export function ThcaProductMedia({
  productName,
  primaryMediaId,
  alternateMediaId,
  detailHref,
}: ThcaProductMediaProps) {
  const [primaryFailed, setPrimaryFailed] = useState(false);
  const [alternateFailed, setAlternateFailed] = useState(false);
  const media = primaryMediaId && !primaryFailed ? (
    <>
      <Image
        className={styles.productImage}
        src={`/media/${encodeURIComponent(primaryMediaId)}`}
        alt={productName}
        fill
        sizes="(max-width: 680px) 82vw, (max-width: 1024px) 44vw, 24vw"
        onError={() => setPrimaryFailed(true)}
      />
      {alternateMediaId && !alternateFailed ? (
        <Image
          className={`${styles.productImage} ${styles.productImageAlternate}`}
          src={`/media/${encodeURIComponent(alternateMediaId)}`}
          alt=""
          fill
          sizes="(max-width: 680px) 82vw, (max-width: 1024px) 44vw, 24vw"
          onError={() => setAlternateFailed(true)}
        />
      ) : null}
    </>
  ) : (
    <div
      className={styles.mediaMissing}
      role="img"
      aria-label={`Product image unavailable for ${productName}`}
    >
      <span>THCA</span>
      <strong>Image unavailable</strong>
      <small>Product identity remains in the record below.</small>
    </div>
  );

  return detailHref ? (
    <Link className={styles.productMedia} href={detailHref} aria-label={`View ${productName}`}>
      {media}
    </Link>
  ) : (
    <div className={styles.productMedia}>{media}</div>
  );
}
