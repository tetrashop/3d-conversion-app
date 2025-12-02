#!/bin/bash

# رنگ‌ها
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 دیپلوی پروژه در Vercel${NC}"
echo ""

# بررسی وضعیت گیت
echo "🔍 بررسی وضعیت گیت..."
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}✅ ریپازیتوری تمیز است${NC}"
else
    echo -e "${YELLOW}⚠️  تغییرات commit نشده وجود دارد${NC}"
    git status
    echo ""
    read -p "آیا می‌خواهید commit کنید؟ (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "آپدیت پروژه $(date '+%Y-%m-%d %H:%M:%S')"
    fi
fi

# Push به گیت‌هاب
echo ""
echo "📤 push به گیت‌هاب..."
git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ push موفق${NC}"
else
    echo -e "${RED}❌ خطا در push${NC}"
    read -p "آیا force push کنیم؟ (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push -f origin main
    fi
fi

echo ""
echo -e "${BLUE}🔗 لینک‌های مهم:${NC}"
echo "🐙 ریپازیتوری: https://github.com/tetrashop/3d-conversion-app"
echo "⚡ Vercel: https://3d-conversion-app.vercel.app"
echo "🔧 Actions: https://github.com/tetrashop/3d-conversion-app/actions"
echo ""
echo -e "${YELLOW}📝 مراحل دیپلوی در Vercel:${NC}"
echo "1. به https://vercel.com/new بروید"
echo "2. روی 'Import Git Repository' کلیک کنید"
echo "3. ریپازیتوری '3d-conversion-app' را انتخاب کنید"
echo "4. تنظیمات پیش‌فرض را تأیید کنید"
echo "5. روی 'Deploy' کلیک کنید"
echo ""
echo "🌐 بعد از دیپلوی: https://3d-conversion-app.vercel.app"
echo ""
echo -e "${GREEN}✅ پروژه آماده سرویس‌دهی است!${NC}"
