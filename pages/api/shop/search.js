export default function handler(req, res) {
  const { q, category, minPrice, maxPrice, sort } = req.query;
  
  const allProducts = [
    {
      id: 1,
      name: 'مدل ماشین اسپرت لامبورگینی',
      price: 85000,
      format: 'GLB',
      category: 'ماشین',
      rating: 4.8,
      downloads: 1243,
      polygons: 250000
    },
    {
      id: 2,
      name: 'آسمان‌خراش مدرن',
      price: 45000,
      format: 'OBJ',
      category: 'ساختمان',
      rating: 4.5,
      downloads: 876,
      polygons: 180000
    },
    {
      id: 3,
      name: 'کاراکتر جنگجو فانتزی',
      price: 120000,
      format: 'FBX',
      category: 'کاراکتر',
      rating: 4.9,
      downloads: 2105,
      polygons: 350000
    },
    {
      id: 4,
      name: 'ست مبلمان مدرن',
      price: 32000,
      format: 'GLTF',
      category: 'مبلمان',
      rating: 4.3,
      downloads: 654,
      polygons: 85000
    },
    {
      id: 5,
      name: 'هلیکوپتر نظامی',
      price: 68000,
      format: 'STL',
      category: 'وسایل نقلیه',
      rating: 4.7,
      downloads: 987,
      polygons: 190000
    },
    {
      id: 6,
      name: 'دایناسور T-Rex',
      price: 55000,
      format: 'OBJ',
      category: 'جانوران',
      rating: 4.6,
      downloads: 1432,
      polygons: 275000
    }
  ];
  
  let filteredProducts = [...allProducts];
  
  // جستجوی متنی
  if (q) {
    const query = q.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.format.toLowerCase().includes(query)
    );
  }
  
  // فیلتر دسته‌بندی
  if (category && category !== 'همه') {
    filteredProducts = filteredProducts.filter(product =>
      product.category === category
    );
  }
  
  // فیلتر قیمت
  if (minPrice) {
    filteredProducts = filteredProducts.filter(product =>
      product.price >= parseInt(minPrice)
    );
  }
  
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(product =>
      product.price <= parseInt(maxPrice)
    );
  }
  
  // مرتب‌سازی
  if (sort) {
    switch(sort) {
      case 'price_asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filteredProducts.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
    }
  }
  
  // شبیه‌سازی تاخیر شبکه
  setTimeout(() => {
    res.status(200).json({
      query: { q, category, minPrice, maxPrice, sort },
      total: filteredProducts.length,
      products: filteredProducts
    });
  }, 300);
}
