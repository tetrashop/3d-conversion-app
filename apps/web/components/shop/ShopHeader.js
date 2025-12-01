import { useState, useEffect } from 'react';

export default function ShopHeader({ cartCount, cartTotal, categories }) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      marginBottom: '30px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>فروشگاه تتراشاپ</h1>
          <p style={{ opacity: 0.9, marginTop: '5px' }}>مرجع تخصصی مدل‌های سه‌بعدی</p>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {isClient ? cartCount : '0'}
          </div>
          <div>آیتم در سبد</div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {isClient ? cartTotal.toLocaleString() : '0'} تومان
          </div>
          <div>جمع کل</div>
        </div>
      </div>

      {/* دسته‌بندی‌ها */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {categories.map(category => (
          <button
            key={category}
            style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            {category}
          </button>
        ))}
        
        <input
          type="text"
          placeholder="جستجوی مدل 3D..."
          style={{
            flex: 1,
            padding: '8px 15px',
            borderRadius: '20px',
            border: 'none',
            minWidth: '200px'
          }}
        />
      </div>
    </div>
  );
}
