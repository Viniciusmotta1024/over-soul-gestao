import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This app lives in a subfolder of the repository (which has its own lockfile).
  turbopack: { root: import.meta.dirname },
  outputFileTracingRoot: import.meta.dirname,
  images: {
    // Product photos are 1080×1350 and are never shown wider than ~560 CSS px.
    qualities: [80],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
