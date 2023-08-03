const { withContentlayer } = require("next-contentlayer");

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.are.na",
      },
      {
        protocol: "https",
        hostname: "d2w9rnfcy7mm78.cloudfront.net",
      },
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/about",
        permanent: false,
      },
      {
        source: "/things",
        destination: "/about",
        permanent: false,
      },
      {
        source: "/thoughts",
        destination: "/about",
        permanent: false,
      },
      {
        source: "/cv",
        destination: "/about",
        permanent: false,
      },
    ];
  },
};

module.exports = withContentlayer(nextConfig);
