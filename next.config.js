const { withContentlayer } = require("next-contentlayer");

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/cv",
        destination: "/about",
        permanent: false,
      },
    ];
  },
};

module.exports = withContentlayer(nextConfig);
