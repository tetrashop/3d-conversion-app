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
      description: 'مدل دقیق لامبورگینی Huracan با تمام جزییات'
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
      description: 'ساختمان اداری ۵۰ طبقه با طراحی مدرن'
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
      description: 'کاراکتر رایگد با انیمیشن کامل'
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
      description: 'ست کامل مبلمان اتاق نشیمن'
    }
  ];
  
  res.status(200).json(products);
}
