"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface ProjectCardMediaProps {
  displaySrc: string;
  /** When set, this GIF loads only while the card is hovered (poster is `displaySrc`). */
  hoverGifSrc?: string | null;
  alt: string;
  sizes: string;
  /** Extra classes on the positioned wrapper (fills parent; parent should be `relative` or sized). */
  className?: string;
  imgClassName?: string;
  /**
   * Full width, height from the image’s intrinsic aspect ratio (no fixed crop box).
   * Use `object-cover` in imgClassName only if you add an explicit height on a parent.
   */
  naturalAspect?: boolean;
}

/**
 * Project preview: static poster/web image by default; optional animated GIF on hover only.
 */
/** Hint ratio for Next/Image layout; display size follows intrinsic image + `w-full h-auto`. */
const NATURAL_PLACEHOLDER_W = 1600;
const NATURAL_PLACEHOLDER_H = 1067;

const POSTER_SKELETON_CLASS =
  "pointer-events-none absolute inset-0 z-[1] animate-pulse bg-gray-200 dark:bg-zinc-800";

function isGifSrc(src: string): boolean {
  return /\.gif(\?|#|$)/i.test(src.trim());
}

export default function ProjectCardMedia({
  displaySrc,
  hoverGifSrc,
  alt,
  sizes,
  className = "",
  imgClassName = "object-cover",
  naturalAspect = false,
}: ProjectCardMediaProps) {
  const [gifActive, setGifActive] = useState(false);
  const [posterLoaded, setPosterLoaded] = useState(false);

  useEffect(() => {
    setPosterLoaded(false);
  }, [displaySrc]);

  const markPosterLoaded = () => setPosterLoaded(true);

  const wrap = `absolute inset-0 min-h-0 ${className}`;

  if (naturalAspect && !hoverGifSrc) {
    if (isGifSrc(displaySrc)) {
      return (
        <div
          className={`relative w-full overflow-hidden ${!posterLoaded ? "min-h-48" : ""} ${className}`}
        >
          {!posterLoaded ? (
            <div className={POSTER_SKELETON_CLASS} aria-hidden />
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element -- animated GIF; optimizer drops frames */}
          <img
            src={displaySrc}
            alt={alt}
            className={`relative z-[2] h-auto w-full ${imgClassName}`}
            onLoad={markPosterLoaded}
            onError={markPosterLoaded}
          />
        </div>
      );
    }
    return (
      <div
        className={`relative w-full overflow-hidden ${!posterLoaded ? "min-h-48" : ""} ${className}`}
      >
        {!posterLoaded ? (
          <div className={POSTER_SKELETON_CLASS} aria-hidden />
        ) : null}
        <Image
          src={displaySrc}
          alt={alt}
          width={NATURAL_PLACEHOLDER_W}
          height={NATURAL_PLACEHOLDER_H}
          sizes={sizes}
          className={`relative z-[2] h-auto w-full ${imgClassName}`}
          onLoad={markPosterLoaded}
          onError={markPosterLoaded}
        />
      </div>
    );
  }

  if (naturalAspect && hoverGifSrc) {
    return (
      <div
        className={`relative w-full overflow-hidden ${!posterLoaded ? "min-h-48" : ""} ${className}`}
        onMouseEnter={() => setGifActive(true)}
        onMouseLeave={() => setGifActive(false)}
      >
        {!posterLoaded ? (
          <div className={POSTER_SKELETON_CLASS} aria-hidden />
        ) : null}
        <Image
          src={displaySrc}
          alt={alt}
          width={NATURAL_PLACEHOLDER_W}
          height={NATURAL_PLACEHOLDER_H}
          sizes={sizes}
          unoptimized={isGifSrc(displaySrc)}
          className={`relative z-[2] h-auto w-full transition-opacity duration-200 ${
            gifActive ? "opacity-0" : "opacity-100"
          } ${imgClassName}`}
          onLoad={markPosterLoaded}
          onError={markPosterLoaded}
        />
        {gifActive ? (
          // eslint-disable-next-line @next/next/no-img-element -- animated GIF; avoid optimizer
          <img
            src={hoverGifSrc}
            alt=""
            className={`absolute inset-0 z-[3] size-full object-contain ${imgClassName}`}
          />
        ) : null}
      </div>
    );
  }

  if (!hoverGifSrc) {
    return (
      <div className={wrap}>
        {!posterLoaded ? (
          <div className={POSTER_SKELETON_CLASS} aria-hidden />
        ) : null}
        <Image
          src={displaySrc}
          alt={alt}
          fill
          sizes={sizes}
          unoptimized={isGifSrc(displaySrc)}
          className={`z-[2] ${imgClassName}`}
          onLoad={markPosterLoaded}
          onError={markPosterLoaded}
        />
      </div>
    );
  }

  return (
    <div
      className={wrap}
      onMouseEnter={() => setGifActive(true)}
      onMouseLeave={() => setGifActive(false)}
    >
      {!posterLoaded ? (
        <div className={POSTER_SKELETON_CLASS} aria-hidden />
      ) : null}
      <Image
        src={displaySrc}
        alt={alt}
        fill
        sizes={sizes}
        unoptimized={isGifSrc(displaySrc)}
        className={`z-[2] ${imgClassName} transition-opacity duration-200 ${
          gifActive ? "opacity-0" : "opacity-100"
        }`}
        onLoad={markPosterLoaded}
        onError={markPosterLoaded}
      />
      {gifActive ? (
        // eslint-disable-next-line @next/next/no-img-element -- animated GIF; avoid optimizer
        <img
          src={hoverGifSrc}
          alt=""
          className={`absolute inset-0 z-[3] size-full ${imgClassName}`}
        />
      ) : null}
    </div>
  );
}
