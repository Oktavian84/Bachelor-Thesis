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
    ],
    loader: "custom",
    loaderFile: "./utils/image-loader.ts",
  },
};

export default nextConfig;
