"use client";

import Image from "next/image";
import { useId, useState, type KeyboardEvent } from "react";

import styles from "./ProductGallery.module.css";

type ProductGalleryProps = Readonly<{
  productName: string;
  images: readonly Readonly<{ id: string }>[];
}>;

function mediaKey(id: string, index: number) {
  return `${index}:${id}`;
}

export function ProductGallery({ productName, images }: ProductGalleryProps) {
  const statusId = useId();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [failedKeys, setFailedKeys] = useState<ReadonlySet<string>>(() => new Set());
  const mediaKeys = images.map((image, index) => mediaKey(image.id, index));
  const selectedIndex = selectedKey === null ? -1 : mediaKeys.indexOf(selectedKey);
  const activeIndex = selectedIndex >= 0 ? selectedIndex : 0;
  const activeImage = images[activeIndex];
  const activeKey = mediaKeys[activeIndex];
  const imageCount = images.length;
  const hasMultipleImages = imageCount > 1;
  const activeImageAvailable = Boolean(activeImage?.id && activeKey && !failedKeys.has(activeKey));

  function showImage(index: number) {
    const nextKey = mediaKeys[index];
    if (nextKey) setSelectedKey(nextKey);
  }

  function handleGalleryKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!hasMultipleImages || event.currentTarget !== event.target) return;

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        showImage(Math.max(0, activeIndex - 1));
        break;
      case "ArrowRight":
        event.preventDefault();
        showImage(Math.min(imageCount - 1, activeIndex + 1));
        break;
      case "Home":
        event.preventDefault();
        showImage(0);
        break;
      case "End":
        event.preventDefault();
        showImage(imageCount - 1);
        break;
    }
  }

  return (
    <div
      className={styles.gallery}
      role="region"
      aria-label={`${productName} product gallery`}
      aria-describedby={hasMultipleImages ? statusId : undefined}
      tabIndex={hasMultipleImages ? 0 : undefined}
      onKeyDown={handleGalleryKeyDown}
    >
      <div className={styles.mediaFrame}>
        {activeImageAvailable && activeImage ? (
          <Image
            key={activeKey}
            className={styles.image}
            src={`/media/${encodeURIComponent(activeImage.id)}`}
            alt={`${productName}, image ${activeIndex + 1} of ${imageCount}`}
            fill
            priority={activeIndex === 0}
            sizes="(max-width: 680px) calc(100vw - 28px), (max-width: 900px) calc(100vw - 40px), (max-width: 1100px) 52vw, 58vw"
            onError={() => {
              if (!activeKey) return;
              setFailedKeys((current) => {
                const next = new Set(current);
                next.add(activeKey);
                return next;
              });
            }}
          />
        ) : (
          <div
            className={styles.missingMedia}
            role="img"
            aria-label={`${productName} — product media unavailable`}
          />
        )}
      </div>

      {hasMultipleImages ? (
        <p className={styles.status} id={statusId}>
          <span aria-live="polite" aria-atomic="true">
            Image {activeIndex + 1} of {imageCount}
          </span>
        </p>
      ) : null}

      {hasMultipleImages ? (
        <div
          className={styles.controls}
          role="group"
          aria-label={`${productName} gallery controls`}
        >
          <button
            className={styles.control}
            type="button"
            disabled={activeIndex === 0}
            onClick={() => showImage(activeIndex - 1)}
          >
            Previous
          </button>

          <div className={styles.numberControls} role="group" aria-label="Choose product image">
            {images.map((image, index) => (
              <button
                className={styles.numberControl}
                type="button"
                key={mediaKey(image.id, index)}
                aria-label={`Show image ${index + 1} of ${imageCount} for ${productName}`}
                aria-pressed={index === activeIndex}
                onClick={() => showImage(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            className={`${styles.control} ${styles.nextControl}`}
            type="button"
            disabled={activeIndex === imageCount - 1}
            onClick={() => showImage(activeIndex + 1)}
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
