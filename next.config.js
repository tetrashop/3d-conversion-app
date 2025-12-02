/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // محدود کردن watch به دایرکتوری پروژه
      config.watchOptions = {
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
          '/data/data/**',
          '/data/**',
          '/**'
        ].filter(Boolean),
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay before rebuilding
      };
    }
    
    return config;
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  images: {
    unoptimized: true,
  },
  
  async redirects() {
    return [
      {
        source: '/',
        destination: '/shop',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
