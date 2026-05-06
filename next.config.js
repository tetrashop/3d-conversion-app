/** @type {import('next').NextConfig} */
const nextConfig = {
  // اجازه دسترسی از IPهای دیگر در حالت توسعه (برای جلوگیری از خطای cross-origin)
  allowedDevOrigins: ['192.168.1.101'],
  // swcMinify در Next.js 16 حذف شده، بنابراین نیازی به ذکر آن نیست
};

module.exports = nextConfig;
