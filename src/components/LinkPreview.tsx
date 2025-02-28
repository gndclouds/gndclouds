"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiExternalLink, FiLink } from "react-icons/fi";

interface LinkPreviewProps {
  url: string;
}

interface LinkMetadata {
  title: string;
  description: string;
  image: string | null;
  favicon: string | null;
  siteName: string | null;
  isLoading: boolean;
  error: boolean;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ url }) => {
  const [metadata, setMetadata] = useState<LinkMetadata>({
    title: "",
    description: "",
    image: null,
    favicon: null,
    siteName: null,
    isLoading: true,
    error: false,
  });

  // Extract domain name from URL for display
  const getDomainFromUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace("www.", "");
      return domain;
    } catch (error) {
      return url;
    }
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // Call our API endpoint to fetch metadata
        const response = await fetch(
          `/api/link-preview?url=${encodeURIComponent(url)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch metadata");
        }

        const data = await response.json();

        setMetadata({
          title: data.title || url,
          description: data.description || "",
          image: data.image,
          favicon: data.favicon,
          siteName: data.siteName || getDomainFromUrl(url),
          isLoading: false,
          error: false,
        });
      } catch (error) {
        console.error("Error fetching link metadata:", error);
        // Fallback to just showing the domain
        setMetadata({
          title: url,
          description: "",
          image: null,
          favicon: null,
          siteName: getDomainFromUrl(url),
          isLoading: false,
          error: false,
        });
      }
    };

    fetchMetadata();
  }, [url]);

  if (metadata.isLoading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md animate-pulse h-16">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  if (metadata.error) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm"
        >
          <FiLink className="mr-2 flex-shrink-0" />
          <span className="truncate">{url}</span>
          <FiExternalLink className="ml-2 flex-shrink-0" />
        </Link>
      </div>
    );
  }

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-100 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      <div className="flex items-start">
        {metadata.favicon && (
          <div className="mr-3 flex-shrink-0">
            <div className="w-4 h-4 relative">
              <Image
                src={metadata.favicon}
                alt={metadata.siteName || "Website favicon"}
                width={16}
                height={16}
                className="rounded-sm"
                unoptimized
              />
            </div>
          </div>
        )}
        <div className="flex-grow min-w-0">
          <div className="text-sm font-medium truncate">{metadata.title}</div>
          {metadata.siteName && (
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
              <span className="truncate">{metadata.siteName}</span>
              <FiExternalLink className="ml-1 flex-shrink-0" size={12} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default LinkPreview;
