// src/components/ImageWithFallback.tsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

// List of allowed domains from next.config.mjs
const ALLOWED_DOMAINS = [
  "source.unsplash.com",
  "images.unsplash.com",
  "images.are.na",
  "readwise-assets.s3.amazonaws.com",
  "ssl.gstatic.com",
  "d3i6fh83elv35t.cloudfront.net",
  "m.media-amazon.com",
];

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
  const [error, setError] = useState(false);
  const [isAllowedDomain, setIsAllowedDomain] = useState(false);

  useEffect(() => {
    if (src) {
      try {
        const url = new URL(src);
        const isDomainAllowed = ALLOWED_DOMAINS.some(
          (domain) =>
            url.hostname === domain || url.hostname.endsWith(`.${domain}`)
        );
        setIsAllowedDomain(isDomainAllowed);
      } catch (e) {
        // If URL parsing fails, assume it's a relative URL (which is allowed)
        setIsAllowedDomain(true);
      }
    } else {
      setIsAllowedDomain(false);
    }
  }, [src]);

  // Show fallback for null src, errors, or non-allowed domains
  if (!src || error || !isAllowedDomain) {
    return (
      <div
        className="flex items-center justify-center bg-gray-200 text-gray-500 text-sm"
        style={{
          width: "100%",
          height: "auto",
          aspectRatio: `${width}/${height}`,
          maxWidth: `${width}px`,
        }}
      >
        <div className="p-4 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto mb-2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p>{alt || "Image not available"}</p>
        </div>
      </div>
    );
  }

  // For allowed domains, use Next.js Image component with optimization
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={{
        width: "100%",
        height: "auto",
        maxWidth: `${width}px`,
        objectFit: "cover",
      }}
      onError={() => setError(true)}
    />
  );
}
