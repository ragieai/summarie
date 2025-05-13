import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    RAGIE_API_KEY: process.env.RAGIE_API_KEY,
    RAGIE_BASE_URL: process.env.RAGIE_BASE_URL,
  },
};

export default nextConfig;
