import "dotenv/config";
import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    dangerouslyAllowSVG: true,
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
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  // Add any other Next.js configurations here
};

const withMDX = createMDX();

export default withMDX(nextConfig);
