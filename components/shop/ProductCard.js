import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const formatNumber = (num) => {
    if (!mounted) return num.toString();
    return num.toLocaleString('fa-IR');
  };
  
  const handleAddToCart = () => {
    if (!mounted) return;
    
    // شبیه‌سازی افزودن به سبد خرید
    const cart = JSON.parse(localStorage.getItem('tetrashop_cart') || '[]');
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
    } else {
      cart.push({
        ...product,
        quantity: 1
      });
    }
    
    localStorage.setItem('tetrashop_cart', JSON.stringify(cart));
    alert(product.name + ' به سبد خرید اضافه شد!');
    
    // رفرش برای به‌روزرسانی شماره سبد خرید
    if (window.location.pathname === '/shop') {
      window.location.reload();
    }
  };
  
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      border: '1px solid #eaeaea',
      ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
      }
    }}>
      <Link href={'/shop/' + product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{
          height: '200px',
          background: 'linear-gradient(45deg, #3498db, #2ecc71)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer'
        }}>
          {product.format}
        </div>
      </Link>

      <div style={{ padding: '20px' }}>
        <Link href={'/shop/' + product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 style={{ 
            margin: '0 0 10px 0', 
            color: '#333',
            fontSize: '18px',
            cursor: 'pointer',
            ':hover': { color: '#3498db' }
          }}>
            {product.name}
          </h3>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ 
            background: '#e8f5e9', 
            color: '#2e7d32',
            padding: '3px 10px',
            borderRadius: '12px',
            fontSize: '12px'
          }}>
            {product.category}
          </span>
        </div>

        <p style={{ 
          color: '#666', 
          lineHeight: '1.6', 
          margin: '15px 0',
          fontSize: '14px',
          height: '42px',
          overflow: 'hidden'
        }}>
          {product.description}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2c3e50' }}>
            {formatNumber(product.price)}
            <span style={{ fontSize: '12px', color: '#666', marginRight: '2px' }}>تومان</span>
          </div>
          
          <button
            onClick={handleAddToCart}
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            🛒 افزودن
          </button>
        </div>
      </div>
    </div>
  );
}
