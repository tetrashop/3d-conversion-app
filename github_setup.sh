#!/bin/bash

# رنگ‌ها برای خروجی
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 راه‌اندازی اتصال به گیت‌هاب${NC}"
echo ""

# بررسی وجود git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git نصب نیست. لطفاً Git را نصب کنید.${NC}"
    exit 1
fi

# بررسی وضعیت فعلی
echo "📊 بررسی وضعیت ریپازیتوری..."
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ ریپازیتوری گیت یافت نشد.${NC}"
    exit 1
fi

# دریافت نام کاربری گیت‌هاب
echo ""
echo -e "${YELLOW}📝 لطفاً اطلاعات زیر را وارد کنید:${NC}"
echo ""

# درخواست نام کاربری گیت‌هاب
read -p "نام کاربری گیت‌هاب شما: " GITHUB_USERNAME

# بررسی ورودی
if [ -z "$GITHUB_USERNAME" ]; then
    echo -e "${RED}❌ نام کاربری نمی‌تواند خالی باشد.${NC}"
    exit 1
fi

# آدرس ریپازیتوری
REPO_URL="https://github.com/$GITHUB_USERNAME/3d-conversion-app.git"

echo ""
echo -e "${BLUE}📋 خلاصه تنظیمات:${NC}"
echo "نام کاربری: $GITHUB_USERNAME"
echo "آدرس ریپازیتوری: $REPO_URL"
echo ""

# تأیید کاربر
read -p "آیا اطلاعات صحیح است؟ (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⚠️  عملیات لغو شد.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ شروع عملیات...${NC}"
echo ""

# 1. حذف remote های قبلی (اگر وجود دارند)
echo "🧹 تمیز کردن remote های قدیمی..."
git remote remove origin 2>/dev/null || true

# 2. اضافه کردن remote جدید
echo "🔗 اتصال به ریپازیتوری گیت‌هاب..."
git remote add origin "$REPO_URL"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ خطا در اتصال به ریپازیتوری${NC}"
    exit 1
fi

echo -e "${GREEN}✅ اتصال برقرار شد${NC}"
echo ""

# 3. تغییر نام branch به main
echo "🌿 تغییر نام branch به main..."
git branch -M main

# 4. push به گیت‌هاب
echo "📤 در حال ارسال پروژه به گیت‌هاب..."
echo "این ممکن است چند لحظه طول بکشد..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 پروژه با موفقیت به گیت‌هاب ارسال شد!${NC}"
    echo ""
    
    # نمایش لینک‌های مفید
    echo -e "${BLUE}🔗 لینک‌های مهم:${NC}"
    echo "🌐 ریپازیتوری: https://github.com/$GITHUB_USERNAME/3d-conversion-app"
    echo "📁 فایل‌ها: https://github.com/$GITHUB_USERNAME/3d-conversion-app"
    echo "📊 Actions: https://github.com/$GITHUB_USERNAME/3d-conversion-app/actions"
    echo "🎨 Vercel: https://3d-conversion-app.vercel.app"
    echo ""
    
    # ایجاد دستورات بعدی
    echo -e "${YELLOW}📝 دستورات بعدی:${NC}"
    echo "1. برای اضافه کردن تغییرات جدید:"
    echo "   git add ."
    echo "   git commit -m 'پیام کامیت'"
    echo "   git push"
    echo ""
    echo "2. برای دریافت آخرین تغییرات:"
    echo "   git pull"
    echo ""
    echo "3. برای بررسی وضعیت:"
    echo "   git status"
    echo ""
    
    # اطلاعات دیپلوی
    echo -e "${BLUE}🚀 برای دیپلوی در Vercel:${NC}"
    echo "1. به https://vercel.com/new بروید"
    echo "2. روی 'Import Git Repository' کلیک کنید"
    echo "3. ریپازیتوری '3d-conversion-app' را انتخاب کنید"
    echo "4. تنظیمات پیش‌فرض را تأیید کنید"
    echo "5. روی 'Deploy' کلیک کنید"
    echo ""
    
else
    echo -e "${RED}❌ خطا در ارسال به گیت‌هاب${NC}"
    echo ""
    echo -e "${YELLOW}🔧 عیب‌یابی:${NC}"
    echo "1. مطمئن شوید ریپازیتوری در گیت‌هاب ایجاد شده است:"
    echo "   https://github.com/new"
    echo "2. نام کاربری را بررسی کنید"
    echo "3. اتصال اینترنت را بررسی کنید"
    echo "4. دسترسی‌های گیت را بررسی کنید"
    echo ""
    
    # پیشنهاد ایجاد ریپازیتوری
    echo -e "${BLUE}📌 اگر ریپازیتوری ایجاد نشده:${NC}"
    echo "1. به https://github.com/new بروید"
    echo "2. نام ریپازیتوری: 3d-conversion-app"
    echo "3. توضیحات: پلتفرم کامل فروشگاه، تبدیل‌کننده ۳D و کیف پول رمزارزی"
    echo "4. Public را انتخاب کنید"
    echo "5. 'Create repository' را بزنید"
    echo "6. سپس اسکریپت را دوباره اجرا کنید"
    echo ""
fi

echo -e "${GREEN}✅ عملیات کامل شد${NC}"
