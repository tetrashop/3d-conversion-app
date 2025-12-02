import { useRouter } from 'next/router';
import ShopLayout from '../../components/layouts/ShopLayout';

export default function OrderSuccessPage() {
  const router = useRouter();
  const { order, txn } = router.query;
  
  return (
    <ShopLayout pageTitle="پرداخت موفق - تتراشاپ">
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '80px', color: '#2ecc71', marginBottom: '20px' }}>
            ✓
          </div>
          <h1 style={{ fontSize: '28px', marginBottom: '15px' }}>پرداخت موفق!</h1>
          <p style={{ color: '#666', marginBottom: '30px', fontSize: '18px' }}>
            سفارش شما با موفقیت ثبت شد.
            {order && <><br />کد سفارش: <strong>{order}</strong></>}
            {txn && <><br />کد پیگیری: <strong>{txn}</strong></>}
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => router.push('/dashboard/orders')}
              style={{
                padding: '12px 30px',
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              مشاهده سفارشات
            </button>
            
            <button
              onClick={() => router.push('/shop')}
              style={{
                padding: '12px 30px',
                background: '#f8f9fa',
                color: '#333',
                border: '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              بازگشت به فروشگاه
            </button>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
