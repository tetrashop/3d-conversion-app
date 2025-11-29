# راهنمای استقرار برنامه تبدیل 3D

## 📋 فایل‌های ضروری

1. **index.js** - سرور اصلی
2. **vercel.json** - پیکربندی Vercel  
3. **package.json** - اطلاعات پروژه
4. **.vercelignore** - فایل‌های نادیده گرفته شده

## 🚀 مراحل استقرار

```bash
# 1. رفتن به پوشه پروژه
cd ~/apps/3d-conversion-app/3d-conversion-app

# 2. اجرای اسکریپت استقرار
./deploy.sh

# یا به صورت دستی:
npm install
vercel --prod
