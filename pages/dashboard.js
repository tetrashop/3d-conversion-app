import Link from 'next/link';

export default function Dashboard() {
  return (
    <div style={{ padding: '20px', direction: 'rtl' }}>
      <h1>داشبورد تست - نسخه ساده</h1>
      <p>برای تست عملکرد پایه</p>
      
      <div style={{ margin: '20px 0' }}>
        <Link href="/shop" style={{ 
          display: 'inline-block', 
          background: 'blue', 
          color: 'white', 
          padding: '10px 20px', 
          margin: '5px',
          textDecoration: 'none',
          borderRadius: '5px'
        }}>
          🛒 تست فروشگاه
        </Link>
        
        <Link href="/converter" style={{ 
          display: 'inline-block', 
          background: 'green', 
          color: 'white', 
          padding: '10px 20px', 
          margin: '5px',
          textDecoration: 'none',
          borderRadius: '5px'
        }}>
          🔄 تست مبدل
        </Link>
      </div>
      
      <p>اگر این نسخه کار کند، مشکل از پیچیدگی کد اصلی است.</p>
    </div>
  );
}
