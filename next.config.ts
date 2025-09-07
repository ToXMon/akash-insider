import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',
  
  // Configure which pages use Edge or Node.js runtime
  experimental: {
    // Configure server actions
    serverActions: {
      bodySizeLimit: '2mb',
    }
  },
  
  // Configure individual routes to use Node.js runtime
  // This ensures our metrics endpoint runs in Node.js
  async headers() {
    return [
      {
        source: '/metrics',
        headers: [
          { key: 'x-middleware-request-runtime', value: 'nodejs' },
        ],
      },
    ];
  },
  
  // Webpack configuration
  webpack: (config, { isServer, webpack }) => {
    // Only apply to server builds
    if (isServer) {
      // Enable top-level await in server build
      config.experiments = {
        ...config.experiments,
        topLevelAwait: true,
      };

      // Add OpenTelemetry instrumentation to the server build
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        
        if (entries['main.js'] && !entries['main.js'].includes('./instrumentation')) {
          if (Array.isArray(entries['main.js'])) {
            entries['main.js'].unshift('./instrumentation');
          } else if (typeof entries['main.js'] === 'string') {
            entries['main.js'] = ['./instrumentation', entries['main.js']];
          }
        }
        
        return entries;
      };
    }

    // Ignore Node.js modules that are not available in the browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        dgram: false,
        '@opentelemetry/sdk-node': false,
        '@opentelemetry/exporter-metrics-otlp-http': false,
        '@opentelemetry/auto-instrumentations-node': false,
      };
    }

    return config;
  },
  
  // Environment variables
  env: {
    NEXT_TELEMETRY_DEBUG: process.env.NEXT_TELEMETRY_DEBUG || 'false',
  },
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // Configure page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Configure images
  images: {
    domains: [],
    remotePatterns: [],
    unoptimized: process.env.NODE_ENV !== 'production',
  },
  
  // Configure production browser source maps
  productionBrowserSourceMaps: false,
  
  // Configure logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

// Export the configuration
export default nextConfig;
