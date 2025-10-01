import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // config image hosts 
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  }
};

export default nextConfig;
