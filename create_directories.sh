#!/data/data/com.termux/files/usr/bin/bash

echo "📁 ساختاردهی پروژه تتراشاپ"
echo "=============================="

# مسیر پروژه
PROJECT_DIR="~/apps/web"
cd ~

# ایجاد پوشه اصلی اگر وجود ندارد
if [ ! -d "apps/web" ]; then
    echo "📦 ایجاد ساختار اولیه پروژه..."
    mkdir -p apps/web
fi

cd apps/web

# لیست دایرکتوری‌های ضروری
DIRECTORIES=(
    "pages/shop"
    "pages/dashboard" 
    "pages/api/shop"
    "pages/api/payment"
    "pages/api/auth"
    "components/shop"
    "components/payment"
    "components/layouts"
    "components/ui"
    "lib/contexts"
    "public/images"
    "public/icons"
    "styles"
)

# ایجاد دایرکتوری‌ها
echo "🔨 ایجاد دایرکتوری‌ها..."
for dir in "${DIRECTORIES[@]}"; do
    if [ ! -d "$dir" ]; then
        echo "  + $dir"
        mkdir -p "$dir"
    else
        echo "  ✓ $dir (موجود)"
    fi
done

# ایجاد فایل‌های پایه
echo "📄 ایجاد فایل‌های پایه..."

# فایل‌های اصلی
if [ ! -f "package.json" ]; then
    echo "  + package.json"
    cat > package.json << 'PKGEOF'
{
  "name": "3d-conversion-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "13.x",
    "react": "18.x",
    "react-dom": "18.x"
  }
}
PKGEOF
fi

if [ ! -f ".gitignore" ]; then
    echo "  + .gitignore"
    cat > .gitignore << 'GITIGNOREEOF'
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# IDE
.vscode
.idea
GITIGNOREEOF
fi

if [ ! -f "next.config.js" ]; then
    echo "  + next.config.js"
    cat > next.config.js << 'CONFIGEOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
CONFIGEOF
fi

# فایل favicon
if [ ! -f "public/favicon.ico" ]; then
    echo "  + public/favicon.ico"
    echo "Favicon" > public/favicon.ico
fi

echo ""
echo "✅ ساختار پروژه آماده است!"
echo "📌 مسیر پروژه: $(pwd)"
echo "🚀 برای ادامه: npm install && npm run dev"
