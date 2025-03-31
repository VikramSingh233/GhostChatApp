const nextConfig = {
  reactStrictMode: false, // ✅ Disable Strict Mode to prevent double mounting

  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },

  async headers() {
    return [
      {
        source: "/api/socket",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://ghostchat-eight.vercel.app", // ✅ Allow only your domain
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Requested-With, Content-Type",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
      {
        protocol: "https",
        hostname: "www.flaticon.com",
      },
      {
        protocol: "https",
        hostname: "tse3.mm.bing.net",
      },
      {
        protocol: "https",
        hostname: "www.svgrepo.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.freecreatives.com",
      },
    ],
  },
};

module.exports = nextConfig;
