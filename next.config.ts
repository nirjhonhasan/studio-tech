import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  // Studio images come from external hosts (imgbb, postimage, unsplash…),
  // so allow optimized loading from any https source.
  images: {
    remotePatterns: [{ 
      protocol: "https",
       hostname: "**" 
      }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
