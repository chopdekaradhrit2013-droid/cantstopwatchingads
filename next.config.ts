import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "maath"],
};

export default nextConfig;
