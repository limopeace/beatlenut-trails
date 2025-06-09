/** @type {import('next').NextConfig} */
/**
 * Fast Build Configuration for Claude Code
 * 
 * This configuration optimizes build speed by disabling certain features
 * that can slow down the build process within Claude Code's time constraints.
 */

const nextConfig = {
  // Disable React strict mode for faster builds
  reactStrictMode: false,
  
  // Disable telemetry to speed up builds
  telemetry: {
    enabled: false
  },
  
  // Optimize for faster builds
  swcMinify: true,
  
  // Configure images for faster processing
  images: {
    domains: [
      'localhost', 
      'beatlenut-trails.com', 
      'picsum.photos', 
      'randomuser.me',
      'sample-videos.com',
      'example.com',
      'placehold.it',
      'placekitten.com',
      'place-hold.it',
      'placeimg.com',
      'ui-avatars.com',
      'source.unsplash.com'
    ],
    // Disable image optimization during build for speed
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // For Docker deployment
  output: 'standalone',
  
  // Experimental features for faster builds
  experimental: {
    // Disable certain optimizations that slow builds
    optimizePackageImports: false,
    // Use faster webpack configurations
    webpackBuildWorker: true,
  },
  
  // Webpack optimizations for faster builds
  webpack: (config, { dev, isServer }) => {
    // Disable source maps in development for faster builds
    if (dev) {
      config.devtool = false;
    }
    
    // Optimize for build speed over runtime performance
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        // Faster minification
        minimize: true,
        // Disable certain optimizations for speed
        usedExports: false,
        sideEffects: false,
      };
    }
    
    return config;
  },
  
  // Disable certain features that slow down builds
  eslint: {
    // Disable ESLint during builds for speed
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    // Don't fail builds on TypeScript errors (for speed)
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig