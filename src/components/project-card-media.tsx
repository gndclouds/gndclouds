"use client";

import Image from "next/image";
import { useState } from "react";

interface ProjectCardMediaProps {
  displaySrc: string;
  /** When set, this GIF loads only while the card is hovered (poster is `displaySrc`). */
  hoverGifSrc?: string | null;
  alt: string;
  sizes: string;
  /** Extra classes on the positioned wrapper (fills parent; parent should be `relative` or sized). */
  className?: string;
  imgClassName?: string;
}

/**
 * Project preview: static poster/web image by default; optional animated GIF on hover only.
 */
export default function ProjectCardMedia({
  displaySrc,
  hoverGifSrc,
  alt,
  sizes,
  className = "",
  imgClassName = "object-cover",
}: ProjectCardMediaProps) {
  const [gifActive, setGifActive] = useState(false);

  const wrap = `absolute inset-0 min-h-0 ${className}`;

  if (!hoverGifSrc) {
    return (
      <div className={wrap}>
        <Image
          src={displaySrc}
          alt={alt}
          fill
          sizes={sizes}
          className={imgClassName}
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
      <Image
        src={displaySrc}
        alt={alt}
        fill
        sizes={sizes}
        className={`${imgClassName} transition-opacity duration-200 ${
          gifActive ? "opacity-0" : "opacity-100"
        }`}
      />
      {gifActive ? (
        // eslint-disable-next-line @next/next/no-img-element -- animated GIF; avoid optimizer
        <img
          src={hoverGifSrc}
          alt=""
          className={`absolute inset-0 size-full ${imgClassName}`}
        />
      ) : null}
    </div>
  );
}
