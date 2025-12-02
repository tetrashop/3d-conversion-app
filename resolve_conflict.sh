#!/bin/bash

# رنگ‌ها
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🛠️  حل Conflict در package.json${NC}"
echo ""

# بررسی وضعیت
echo "📊 وضعیت فعلی:"
git status --porcelain | grep package.json
echo ""

# نمایش conflict
echo "🔍 مشاهده conflict در package.json:"
echo "=================================="
grep -n "<<<<<<<" package.json || echo "بدون conflict markers"
echo "=================================="
echo ""

# نمایش گزینه‌ها
echo -e "${YELLOW}🔧 انتخاب روش حل:${NC}"
echo "1. استفاده از نسخه local (پروژه ما)"
echo "2. استفاده از نسخه remote (گیت‌هاب)"
echo "3. مشاهده تفاوت‌ها و تصمیم دستی"
echo "4. حذف فایل و ایجاد مجدد"
echo ""

read -p "انتخاب شما (1-4): " choice
echo ""

case $choice in
    1)
        echo -e "${BLUE}📁 استفاده از نسخه local...${NC}"
        git checkout --ours package.json
        echo -e "${GREEN}✅ نسخه local انتخاب شد${NC}"
        
        # حذف conflict markers اگر باقی مانده
        sed -i '/^<<<<<<< /d' package.json 2>/dev/null || true
        sed -i '/^=======/d' package.json 2>/dev/null || true
        sed -i '/^>>>>>>> /d' package.json 2>/dev/null || true
        
        git add package.json
        echo -e "${GREEN}✅ package.json اضافه شد${NC}"
        
        # ادامه rebase
        read -p "ادامه rebase؟ (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git rebase --continue
        fi
        ;;
        
    2)
        echo -e "${BLUE}☁️  استفاده از نسخه remote...${NC}"
        git checkout --theirs package.json
        echo -e "${GREEN}✅ نسخه remote انتخاب شد${NC}"
        
        git add package.json
        echo -e "${GREEN}✅ package.json اضافه شد${NC}"
        
        # ادامه rebase
        read -p "ادامه rebase؟ (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git rebase --continue
        fi
        ;;
        
    3)
        echo -e "${BLUE}📋 مشاهده تفاوت‌ها...${NC}"
        echo ""
        echo "نسخه local (--ours):"
        echo "=================="
        git show HEAD:package.json | head -50
        echo ""
        echo "نسخه remote (--theirs):"
        echo "=================="
        git show origin/main:package.json 2>/dev/null | head -50 || echo "در دسترس نیست"
        
        echo ""
        echo "📝 برای حل دستی، فایل package.json را ویرایش کنید."
        echo "سپس دستورات زیر را اجرا کنید:"
        echo "  git add package.json"
        echo "  git rebase --continue"
        ;;
        
    4)
        echo -e "${BLUE}🔄 ایجاد مجدد package.json...${NC}"
        
        # backup از فایل فعلی
        cp package.json package.json.backup
        
        # استفاده از نسخه پروژه ما (کامل‌تر است)
        cat > package.json << 'PACKAGE_EOF'
{
  "name": "3d-conversion-app",
  "version": "2.0.0",
  "private": true,
  "description": "پلتفرم کامل فروشگاه، تبدیل‌کننده ۳D و کیف پول رمزارزی",
  "author": "3D Conversion App <support@3dconversion.app>",
  "license": "MIT",
  "keywords": [
    "3d-models",
    "3d-conversion",
    "crypto-wallet",
    "ecommerce",
    "nextjs",
    "react",
    "iran"
  ],
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "prepare": "husky install",
    "postbuild": "next-sitemap"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "three": "^0.158.0",
    "@react-three/fiber": "^8.14.0",
    "@react-three/drei": "^9.94.3",
    "react-dropzone": "^14.2.3",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "recharts": "^2.10.0",
    "qrcode.react": "^3.1.0",
    "next-sitemap": "^4.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/three": "^0.158.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.54.0",
    "eslint-config-next": "^14.0.0",
    "husky": "^8.0.3",
    "lint-staged": "^15.0.2",
    "postcss": "^8.4.31",
    "prettier": "^3.1.0",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.3.0"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,json,css,md}": [
      "prettier --write"
    ]
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/tetrashop/3d-conversion-app.git"
  },
  "bugs": {
    "url": "https://github.com/tetrashop/3d-conversion-app/issues"
  },
  "homepage": "https://3d-conversion-app.vercel.app",
  "engines": {
    "node": ">=16.0.0"
  }
}
PACKAGE_EOF
        
        echo -e "${GREEN}✅ package.json جدید ایجاد شد${NC}"
        
        git add package.json
        echo -e "${GREEN}✅ package.json اضافه شد${NC}"
        
        # ادامه rebase
        read -p "ادامه rebase؟ (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git rebase --continue
        fi
        ;;
        
    *)
        echo -e "${RED}❌ انتخاب نامعتبر${NC}"
        ;;
esac

echo ""
echo -e "${GREEN}✅ عملیات کامل شد${NC}"
