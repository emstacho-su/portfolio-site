import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // /toolkit was the original Phase-5 placeholder; retargeted as /harness
      // (see REDESIGN_ROADMAP.md). Kept as a permanent redirect so any external
      // links or bookmarks land cleanly.
      { source: '/toolkit', destination: '/harness', permanent: true },
    ];
  },
};

export default nextConfig;
