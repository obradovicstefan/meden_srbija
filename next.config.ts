import type { NextConfig } from "next";

// No `output: "export"` — needed for dynamic API routes (contact email) and root proxy (security headers).
const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
  },
  // Dev only: allow HMR / _next resources when opening the site from another device on LAN (e.g. iPhone).
  // Add more entries (full origin with port) if your machine IP or dev port differs.
  allowedDevOrigins: ["192.168.0.29", "http://192.168.0.29:3000"],
};

export default nextConfig;
