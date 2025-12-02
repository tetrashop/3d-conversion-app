/** @type {import('next').NextConfig} */
const nextConfig = {
    // غیرفعال کردن minification توسط SWC
    swcMinify: false,
    // اجبار به استفاده از Babel برای کامپایل
    compiler: {
        // می‌توانید تنظیمات اضافی Babel را اینجا قرار دهید
    },
}

module.exports = nextConfig
