/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    minimumCacheTTL: 60,
  },
  
  // Optimizations
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
    viewTransition: true,
  },
  
  // Improved build ID generation
  generateBuildId: async () => {
    if (process.env.NODE_ENV === 'production') {
      return process.env.VERCEL_GIT_COMMIT_SHA || `build-${Date.now()}`;
    }
    return 'development';
  },
  // Add headers for performance and security
  async headers() {
    return [
      {
        // Apply these headers to all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-session-id' },
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache Next.js static files
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache constitution content for 1 hour
        source: '/constitution/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600' },
        ],
      },
      {
        // Security headers
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 