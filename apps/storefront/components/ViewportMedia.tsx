import { getImageProps } from "next/image";
import type { CSSProperties } from "react";

export type AuthoredMediaSource = Readonly<{
  src: string;
  width: number;
  height: number;
}>;

export type AuthoredMediaSet = Readonly<{
  wide: AuthoredMediaSource;
  narrow: AuthoredMediaSource;
  alt: string;
  widePosition?: string;
  narrowPosition?: string;
}>;

type MediaStyle = CSSProperties & {
  "--media-position-wide"?: string;
  "--media-position-narrow"?: string;
};

export function ViewportMedia({
  media,
  sizes,
  priority = false,
  className,
}: Readonly<{
  media: AuthoredMediaSet;
  sizes: string;
  priority?: boolean;
  className?: string;
}>) {
  const wide = getImageProps({
    ...media.wide,
    alt: media.alt,
    sizes,
    priority,
  }).props;
  const narrow = getImageProps({
    ...media.narrow,
    alt: media.alt,
    sizes,
    priority,
  }).props;
  const style: MediaStyle = {
    "--media-position-wide": media.widePosition,
    "--media-position-narrow": media.narrowPosition,
  };

  return (
    <picture className={className} style={style}>
      <source
        media="(max-width: 680px)"
        sizes={narrow.sizes}
        srcSet={narrow.srcSet}
      />
      <img {...wide} alt={media.alt} />
    </picture>
  );
}
