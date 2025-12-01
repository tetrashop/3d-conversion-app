import { useState, useEffect } from 'react';

export default function ProductCard({ product, onAddToCart }) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatNumber = (num) => {
    return isClient ? num.toLocaleString() : num.toString();
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      border: '1px solid #eaeaea'
    }}>
      {/* تصویر محصول */}
      <div style={{
        height: '200px',
        background: `linear-gradient(45deg, #${product.id}abc, #${product.id}def)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px'
      }}>
        {product.format}
      </div>

      {/* اطلاعات محصول */}
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{product.name}</h3>
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
              <span style={{ margin: '0 10px', color: '#666' }}>•</span>
              <span style={{ color: '#666' }}>{product.format}</span>
            </div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>
              {formatNumber(product.price)}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>تومان</div>
          </div>
        </div>

        <p style={{ color: '#666', lineHeight: '1.6', margin: '15px 0' }}>
          {product.description}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ color: '#ff9800' }}>
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span style={{ marginRight: '5px', color: '#666' }}>({product.rating})</span>
          </div>
          
          <div>
            <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>
              ⬇️ {formatNumber(product.downloads)} دانلود
            </span>
            <span style={{ fontSize: '12px', color: '#666' }}>
              📏 {formatNumber(product.polygons)} چندضلعی
            </span>
          </div>
        </div>

        <button
          onClick={onAddToCart}
          style={{
            width: '100%',
            marginTop: '15px',
            padding: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          🛒 افزودن به سبد خرید
        </button>
      </div>
    </div>
  );
}
