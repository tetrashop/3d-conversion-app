import { useState, useEffect, useCallback } from 'react';
import ShopLayout from '../../components/layouts/ShopLayout';
import ProductCard from '../../components/shop/ProductCard';
import ProductFilters from '../../components/shop/ProductFilters';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  
  // دریافت محصولات اولیه
  useEffect(() => {
    fetchProducts();
  }, []);
  
  // اعمال فیلترها
  useEffect(() => {
    if (products.length > 0) {
      applyFilters();
    }
  }, [filters, products]);
  
  const fetchProducts = async () => {
    try {
      // ابتدا از localStorage چک کنید
      const savedProducts = localStorage.getItem('tetrashop_products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
        setFilteredProducts(JSON.parse(savedProducts));
        setLoading(false);
        return;
      }
      
      // اگر در localStorage نبود، از API بگیرید
      setTimeout(() => {
        const mockProducts = [
          {
            id: 1,
            name: 'مدل ماشین اسپرت لامبورگینی',
            price: 85000,
            format: 'GLB',
            category: 'ماشین',
            rating: 4.8,
            downloads: 1243,
            polygons: 250000,
            description: 'مدل دقیق لامبورگینی Huracan با تمام جزییات برای استفاده در پروژه‌های واقعی'
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
            description: 'ساختمان اداری ۵۰ طبقه با طراحی مدرن و بهینه برای رندر'
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
            description: 'کاراکتر رایگد با انیمیشن کامل و بافت‌های با کیفیت'
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
            format: 'BLEND',
            category: 'وسایل نقلیه',
            rating: 4.6,
            downloads: 987,
            polygons: 320000,
            description: 'مدل هلیکوپتر Black Hawk با جزییات کامل'
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
            description: 'مدل واقع‌گرایانه دایناسور T-Rex با انیمیشن'
          }
        ];
        
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
        localStorage.setItem('tetrashop_products', JSON.stringify(mockProducts));
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('خطا در دریافت محصولات:', error);
      setLoading(false);
    }
  };
  
  const applyFilters = async () => {
    // اگر فیلتری وجود ندارد، همه محصولات را نشان بده
    if (!Object.keys(filters).length || (!filters.q && !filters.category && !filters.minPrice && !filters.maxPrice)) {
      setFilteredProducts(products);
      return;
    }
    
    setLoading(true);
    
    try {
      const params = new URLSearchParams();
      if (filters.q) params.append('q', filters.q);
      if (filters.category && filters.category !== 'همه') params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sort) params.append('sort', filters.sort);
      
      const res = await fetch('/api/shop/search?' + params.toString());
      const data = await res.json();
      setFilteredProducts(data.products);
    } catch (error) {
      console.error('خطا در اعمال فیلتر:', error);
      // اگر API جواب نداد، فیلتر را به صورت محلی اعمال کن
      let localFiltered = [...products];
      
      if (filters.q) {
        const query = filters.q.toLowerCase();
        localFiltered = localFiltered.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        );
      }
      
      if (filters.category && filters.category !== 'همه') {
        localFiltered = localFiltered.filter(product => product.category === filters.category);
      }
      
      if (filters.minPrice) {
        localFiltered = localFiltered.filter(product => product.price >= parseInt(filters.minPrice));
      }
      
      if (filters.maxPrice) {
        localFiltered = localFiltered.filter(product => product.price <= parseInt(filters.maxPrice));
      }
      
      // مرتب‌سازی
      if (filters.sort) {
        switch(filters.sort) {
          case 'price_asc':
            localFiltered.sort((a, b) => a.price - b.price);
            break;
          case 'price_desc':
            localFiltered.sort((a, b) => b.price - a.price);
            break;
          case 'popular':
            localFiltered.sort((a, b) => b.downloads - a.downloads);
            break;
          case 'rating':
            localFiltered.sort((a, b) => b.rating - a.rating);
            break;
        }
      }
      
      setFilteredProducts(localFiltered);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <ShopLayout>
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>🛍️ فروشگاه مدل‌های 3D</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          {filteredProducts.length} محصول پیدا شد
        </p>
        
        {/* فیلترها */}
        <ProductFilters onFilterChange={handleFilterChange} />
        
        {/* نتایج */}
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            background: '#f8f9fa',
            borderRadius: '10px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p>در حال بارگذاری محصولات...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            background: '#f8f9fa',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ color: '#666', marginBottom: '10px' }}>محصولی یافت نشد</h3>
            <p style={{ color: '#999' }}>فیلترهای جستجو را تغییر دهید یا محصولات جدید را بررسی کنید</p>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '25px',
              marginTop: '20px'
            }}>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {/* اطلاعات نتایج */}
            <div style={{
              marginTop: '40px',
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '10px',
              fontSize: '14px',
              color: '#666'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <strong>نتایج:</strong> نمایش {filteredProducts.length} از {products.length} محصول
                </div>
                <div>
                  <strong>میانگین قیمت:</strong> 
                  {Math.round(filteredProducts.reduce((sum, p) => sum + p.price, 0) / filteredProducts.length).toLocaleString('fa-IR')} تومان
                </div>
                <div>
                  <strong>میانگین امتیاز:</strong> 
                  {(filteredProducts.reduce((sum, p) => sum + p.rating, 0) / filteredProducts.length).toFixed(1)}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </ShopLayout>
  );
}
