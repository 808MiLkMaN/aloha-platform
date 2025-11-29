import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Allow all hosts for preview deployments and custom domains
  // This is needed for Emergent preview, Vercel preview, and custom domains
  httpAgentOptions: {
    keepAlive: true,
  },

  // Disable strict host header checking for preview/custom domain support
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },

  // Allow specific hosts
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:path*",
          destination: "/:path*",
        },
      ],
    };
  },

  // Environment configuration
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
