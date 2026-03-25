import "dotenv/config";
import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    dangerouslyAllowSVG: true,
    unoptimized: true, // Disable image optimization for static export
    remotePatterns: [
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.are.na" },
      {
        protocol: "https",
        hostname: "readwise-assets.s3.amazonaws.com",
        port: "",
        pathname: "/media/reader/parsed_document_assets/**",
      },
      { protocol: "https", hostname: "ssl.gstatic.com" },
      { protocol: "https", hostname: "d3i6fh83elv35t.cloudfront.net" },
      { protocol: "https", hostname: "readwise-assets.s3.amazonaws.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "cdn.bsky.app" },
      { protocol: "https", hostname: "video.bsky.app" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  // Config for static generation to reduce serverless function size
  output: "standalone", // We need this since we have API routes
  poweredByHeader: false,
  compress: true,

  async redirects() {
    return [{ source: "/journls", destination: "/journals", permanent: true }];
  },

  // Significantly reduce bundle size by having certain pages static prerendered
  experimental: {
    // External packages are those that won't be bundled with your app
    serverComponentsExternalPackages: ["src/app/db"],
    // Directories to exclude from serverless function bundles
    outputFileTracingExcludes: {
      "*": [
        // Large node_modules that aren't essential for runtime
        "**/node_modules/@swc/**",
        "**/node_modules/esbuild/**",
        // Entire sqlite database files
        "**/*.sqlite",
        "**/*.sqlite3",
        // Media: do not copy into serverless bundles (see public/db-assets below)
        "**/*.mp4",
        "**/*.webm",
        "**/*.mov",
        // Entire content directories (source markdown / dev copies)
        "**/src/app/db/**",
        // CRITICAL: bundling all of public/db-assets into the db-assets Lambda blows past
        // Vercel's ~300MB function limit (~1GB+ media). Files still deploy as static assets;
        // the route falls back to /api/asset-proxy when readFile misses (e.g. on Vercel).
        "**/public/db-assets/**",
        "**/public/backgrounds/**",
        "**/public/me/**",
      ],
    },
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
