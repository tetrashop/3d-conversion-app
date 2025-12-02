export default function TestPage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>✅ پروژه تتراشاپ آماده است!</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
          فروشگاه مدل‌های 3D با سیستم پرداخت و جستجوی پیشرفته
        </p>
        <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/shop" style={{
            padding: '12px 30px',
            background: 'white',
            color: '#667eea',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            🛍️ رفتن به فروشگاه
          </a>
          <a href="/shop/checkout" style={{
            padding: '12px 30px',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            💳 تست پرداخت
          </a>
        </div>
      </div>
    </div>
  );
}
