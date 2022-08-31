module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["source.unsplash.com"],
  },
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/post",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/posts/",
        destination: "/blogs/",
        permanent: true,
      },
    ];
  },
};
