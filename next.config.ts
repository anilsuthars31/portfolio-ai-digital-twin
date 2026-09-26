import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // lib/profile.ts reads data/profile.md at runtime; make sure it ships with every route.
  outputFileTracingIncludes: {
    "/*": ["./data/**/*"],
  },
};

export default nextConfig;
