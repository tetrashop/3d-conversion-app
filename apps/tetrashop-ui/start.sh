#!/bin/bash

echo "🎨 راه‌اندازی رابط کاربری Tetrashop100"

# رنگ‌ها
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📦 بررسی پیش‌نیازها...${NC}"

# بررسی Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js یافت نشد. لطفا نصب کنید: https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}✅ Node.js موجود است (Version: $(node --version))${NC}"

# بررسی npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm یافت نشد"
    exit 1
fi

echo -e "${GREEN}✅ npm موجود است (Version: $(npm --version))${NC}"

# نصب وابستگی‌ها
echo -e "${BLUE}📥 نصب وابستگی‌ها...${NC}"
npm install

echo -e "${GREEN}🎉 رابط کاربری آماده است!${NC}"
echo ""
echo "🔧 دستورات اجرا:"
echo "  npm run dev    - اجرای development"
echo "  npm run build  - ساخت production"
echo "  npm run deploy - استقرار روی Vercel"
echo ""
echo "🌐 برنامه روی پورت 3000 اجرا می‌شود"
echo "🚀 در حال اجرای سرور توسعه..."

# اجرای development
npm run dev
