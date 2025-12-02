#!/data/data/com.termux/files/usr/bin/bash

echo "🔄 تنظیمات بهینه برای Termux..."

cd ~/apps/web

# 1. حذف node_modules اگر وجود دارد
if [ -d "node_modules" ]; then
    echo "🗑️ حذف node_modules قبلی..."
    rm -rf node_modules
fi

# 2. ایجاد package.json بهینه
cat > package.json << 'PKGEOF'
{
  "name": "3d-conversion-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "NODE_OPTIONS='--max-old-space-size=512' next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "12.3.4",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "jsonwebtoken": "^8.5.1",
    "axios": "^0.27.2"
  },
  "devDependencies": {
    "@babel/core": "^7.20.5",
    "@babel/preset-react": "^7.18.6",
    "eslint": "^8.30.0",
    "eslint-config-next": "12.3.4"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
PKGEOF

# 3. ایجاد next.config.js سازگار
cat > next.config.js << 'CONFIGEOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
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
  experimental: {
    forceSwcTransforms: false,
  },
}

module.exports = nextConfig
CONFIGEOF

# 4. ایجاد فایل .babelrc
cat > .babelrc << 'BABELRC'
{
  "presets": ["next/babel"],
  "plugins": []
}
BABELRC

# 5. نصب وابستگی‌ها
echo "📦 نصب packages..."
npm install --legacy-peer-deps

echo "✅ تنظیمات کامل شد!"
echo "🚀 اکنون اجرا کنید: npm run dev"
