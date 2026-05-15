import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const appDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Do not set turbopack.root to appDir — that triggers a Next 16 bug where bare
  // CSS @import resolves from the parent folder (e.g. cursor/apps/) instead of here.
  turbopack: {
    resolveAlias: {
      tailwindcss: path.join(appDir, "node_modules/tailwindcss/index.css"),
    },
  },
};

export default nextConfig;
