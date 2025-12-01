import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// بارگذاری پویای کامپوننت‌ها برای جلوگیری از خطای هیدراسیون
const ShopHeader = dynamic(() => import('../../components/shop/ShopHeader'), {
  ssr: false,
  loading: () => <div style={{ height: '150px', background: '#f5f5f5' }}></div>
});

const ProductCard = dynamic(() => import('../../components/shop/ProductCard'), {
  ssr: false
});

const CartSidebar = dynamic(() => import('../../components/shop/CartSidebar'), {
  ssr: false
});

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories] = useState(['همه', 'ماشین', 'ساختمان', 'کاراکتر', 'مبلمان']);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/shop/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('خطا در دریافت محصولات:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // رندر اولیه سرور (بدون اعداد فرمت‌شده)
  if (!isClient) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <div style={{ width: '350px', background: '#f8f9fa' }}></div>
        <div style={{ flex: 1, padding: '20px' }}>
          <div style={{ height: '150px', background: '#f5f5f5', borderRadius: '10px' }}></div>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '25px',
            marginTop: '20px'
          }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ height: '400px', background: '#f5f5f5', borderRadius: '12px' }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <CartSidebar 
        cart={cart}
        total={cartTotal}
        onRemove={removeFromCart}
      />

      <div style={{ flex: 1, padding: '20px' }}>
        <ShopHeader 
          cartCount={cart.length}
          cartTotal={cartTotal}
          categories={categories}
        />

        <h1 style={{ color: '#2c3e50', margin: '20px 0' }}>🛍️ فروشگاه مدل‌های 3D</h1>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>در حال بارگذاری محصولات...</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '25px',
            marginTop: '20px'
          }}>
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </div>
        )}

        {/* آمار */}
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: '#f8f9fa',
          borderRadius: '10px'
        }}>
          <h3>📊 آمار فروشگاه</h3>
          <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
            <div>
              <strong>تعداد محصولات:</strong> {products.length}
            </div>
            <div>
              <strong>محصولات در سبد:</strong> {cart.length}
            </div>
            <div>
              <strong>مجموع سفارش:</strong> {cartTotal.toLocaleString()} تومان
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
