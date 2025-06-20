import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable source maps for debugging
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.devtool = 'eval-source-map';
    }
    return config;
  },
  // Enable experimental features that help with debugging
  experimental: {
    // This helps with better source maps
    optimizePackageImports: ['lucide-react'],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;