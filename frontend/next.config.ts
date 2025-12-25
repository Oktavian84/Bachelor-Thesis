import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",  
        port: "1337",
        pathname: "/uploads/**", 
      },
      {
        protocol: "https",
        hostname: "bachelor-thesis-production.up.railway.app",
        pathname: "/uploads/**",
      },
    ],
    loader: "custom",
    loaderFile: "./utils/image-loader.ts",
  },
};

export default nextConfig;