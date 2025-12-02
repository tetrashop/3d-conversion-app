import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();
  
  useEffect(() => {
    // ریدایرکت به پنل مدیریت
    router.push('/admin');
  }, [router]);
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>در حال انتقال به پنل مدیریت...</h1>
        <p>لطفاً چند لحظه صبر کنید</p>
      </div>
    </div>
  );
}
