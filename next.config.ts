import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'i.ytimg.com' },
      { hostname: 'img.youtube.com' },
      { hostname: 'api.microlink.io' },
    ],
  },
};

export default nextConfig;
