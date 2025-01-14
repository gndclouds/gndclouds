// src/components/ImageWithFallback.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageWithFallbackProps {
  src: string | null;
  alt: string;
  width: number;
  height: number;
}

export default function ImageWithFallback({
  src,
  alt,
  width,
  height,
}: ImageWithFallbackProps) {
  const defaultImageUrl = "/path/to/default-image.jpg"; // Replace with your default image path
  const [imgSrc, setImgSrc] = useState(src || defaultImageUrl);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      style={{ width: "100%", height: "auto", maxWidth: `${width}px` }}
      onError={() => {
        setImgSrc(defaultImageUrl); // Use default image if the original fails to load
      }}
    />
  );
}
