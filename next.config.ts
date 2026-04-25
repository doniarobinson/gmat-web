import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep Turbopack happy in Next 16 when a custom webpack config exists.
  turbopack: {},
  webpack: (config) => {
    // Prevent watchpack from attempting to watch huge folders in dev.
    // This reduces EMFILE (too many open files) issues on macOS.
    config.watchOptions = {
      ...(config.watchOptions ?? {}),
      ignored: [
        "**/.git/**",
        "**/.next/**",
        "**/node_modules/**",
        "**/.venv/**",
      ],
    };
    return config;
  },
};

export default nextConfig;

