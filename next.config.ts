import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
