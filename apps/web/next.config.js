/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // جلوگیری از کش API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
  
  // برای دیباگ API
  webpack: (config, { isServer }) => {
    if (isServer) {
      console.log('🔧 Building API routes...');
    }
    return config;
  },
};

module.exports = nextConfig;
