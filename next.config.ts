import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "u.cubeupload.com",
      },
    ],
  },
};

export default nextConfig;
