import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow network access for local testing (HMR cross-origin)
  allowedDevOrigins: ["192.168.31.19"],
};

export default nextConfig;
