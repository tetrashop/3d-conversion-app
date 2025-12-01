import { useState, useEffect } from 'react';

export default function CartSidebar({ cart, total, onRemove }) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatNumber = (num) => {
    return isClient ? num.toLocaleString() : num.toString();
  };

  return (
    <div style={{
      width: '350px',
      background: '#f8f9fa',
      borderLeft: '1px solid #dee2e6',
      padding: '20px',
      height: '100vh',
      position: 'sticky',
      top: 0,
      overflowY: 'auto'
    }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>🛒 سبد خرید شما</h2>
      
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666', padding: '40px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🛍️</div>
          <p>سبد خرید شما خالی است</p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            {cart.map(item => (
              <div key={item.id} style={{
                background: 'white',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '10px',
                border: '1px solid #eaeaea'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {item.format} • {item.quantity} عدد
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold' }}>
                      {formatNumber(item.price * item.quantity)} تومان
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff4444',
                        cursor: 'pointer',
                        fontSize: '12px',
                        marginTop: '5px'
                      }}
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            padding: '20px',
            background: 'white',
            borderRadius: '8px',
            border: '2px solid #eaeaea'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>جمع جزء:</span>
              <span>{formatNumber(total)} تومان</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>مالیات (۹٪):</span>
              <span>{formatNumber(total * 0.09)} تومان</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 'bold',
              fontSize: '18px',
              paddingTop: '10px',
              borderTop: '1px solid #eee'
            }}>
              <span>مبلغ قابل پرداخت:</span>
              <span style={{ color: '#2e7d32' }}>
                {formatNumber(total * 1.09)} تومان
              </span>
            </div>

            <button style={{
              width: '100%',
              padding: '15px',
              marginTop: '20px',
              background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              💳 ادامه فرآیند خرید
            </button>

            <div style={{ marginTop: '15px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
              <p>پرداخت امن با رمزارز • بازگشت وجه ۷ روزه</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
