export default function handler(req, res) {
  const products = [
    {
      id: 1,
      name: 'مدل ماشین اسپرت لامبورگینی',
      price: 85000,
      format: 'GLB',
      category: 'ماشین',
      rating: 4.8,
      downloads: 1243,
      polygons: 250000,
      description: 'مدل دقیق لامبورگینی Huracan با بافت‌های با کیفیت و انیمیشن درب‌ها'
    },
    {
      id: 2,
      name: 'آسمان‌خراش مدرن',
      price: 45000,
      format: 'OBJ',
      category: 'ساختمان',
      rating: 4.5,
      downloads: 876,
      polygons: 180000,
      description: 'ساختمان اداری ۵۰ طبقه با طراحی معاصر و جزئیات داخلی'
    },
    {
      id: 3,
      name: 'کاراکتر جنگجو فانتزی',
      price: 120000,
      format: 'FBX',
      category: 'کاراکتر',
      rating: 4.9,
      downloads: 2105,
      polygons: 350000,
      description: 'کاراکتر رایگد با انیمیشن‌های کامل حرکت، حمله و آسیب'
    },
    {
      id: 4,
      name: 'ست مبلمان مدرن',
      price: 32000,
      format: 'GLTF',
      category: 'مبلمان',
      rating: 4.3,
      downloads: 654,
      polygons: 85000,
      description: 'ست کامل مبلمان اتاق نشیمن شامل کاناپه، میز و صندلی'
    },
    {
      id: 5,
      name: 'هلیکوپتر نظامی',
      price: 68000,
      format: 'STL',
      category: 'وسایل نقلیه',
      rating: 4.7,
      downloads: 987,
      polygons: 190000,
      description: 'مدل هلیکوپتر Black Hawk با پروانه‌های متحرک'
    },
    {
      id: 6,
      name: 'دایناسور T-Rex',
      price: 55000,
      format: 'OBJ',
      category: 'جانوران',
      rating: 4.6,
      downloads: 1432,
      polygons: 275000,
      description: 'مدل واقع‌گرایانه T-Rex با انیمیشن راه رفتن و فریاد زدن'
    },
    {
      id: 7,
      name: 'کشتی تفریحی',
      price: 78000,
      format: 'GLB',
      category: 'وسایل نقلیه',
      rating: 4.4,
      downloads: 567,
      polygons: 165000,
      description: 'کشتی بادبانی لوکس با جزئیات عرشه و کابین'
    },
    {
      id: 8,
      name: 'ربات صنعتی',
      price: 92000,
      format: 'FBX',
      category: 'ماشین‌آلات',
      rating: 4.8,
      downloads: 789,
      polygons: 310000,
      description: 'ربات ۶ محوره با انیمیشن کامل حرکات صنعتی'
    }
  ];

  // شبیه‌سازی تاخیر شبکه
  setTimeout(() => {
    res.status(200).json(products);
  }, 300);
}
