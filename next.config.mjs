import "dotenv/config";
import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
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
    ],
  },
  // Add any other Next.js configurations here
};

const withMDX = createMDX();

export default withMDX(nextConfig);
