import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import ShopLayout from '../../components/layouts/ShopLayout';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);
  
  const fetchProduct = () => {
    setTimeout(() => {
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
        }
      ];
      
      const foundProduct = products.find(p => p.id === parseInt(id)) || products[0];
      setProduct(foundProduct);
      setLoading(false);
    }, 800);
  };
  
  if (loading) {
    return (
      <ShopLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p>در حال بارگذاری محصول...</p>
        </div>
      </ShopLayout>
    );
  }
  
  return (
    <ShopLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <h1>{product?.name}</h1>
        <p>{product?.description}</p>
        <p>قیمت: {product?.price.toLocaleString('fa-IR')} تومان</p>
      </div>
    </ShopLayout>
  );
}
