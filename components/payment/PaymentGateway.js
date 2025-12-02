import { useState } from 'react';
import { useRouter } from 'next/router';

export default function PaymentGateway({ amount, orderId, onSuccess }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('crypto');
  
  const paymentMethods = [
    { id: 'crypto', name: 'رمزارز (تتر)', icon: '₿', fee: 0 },
    { id: 'card', name: 'کارت بانکی', icon: '💳', fee: 500 },
    { id: 'wallet', name: 'کیف پول سایت', icon: '👛', fee: 0 }
  ];
  
  const handlePayment = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          orderId,
          method: selectedMethod
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // پرداخت موفق
        if (onSuccess) onSuccess(data.data);
        
        // انتقال به صفحه موفقیت
        setTimeout(() => {
          router.push('/shop/order-success?txn=' + data.data.transactionId);
        }, 1000);
      } else {
        setError(data.error || 'خطا در پرداخت');
      }
    } catch (err) {
      setError('خطای شبکه. لطفا دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };
  
  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);
  const totalAmount = amount + (selectedMethodData?.fee || 0);
  
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '25px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>درگاه پرداخت امن</h3>
      
      {/* اطلاعات پرداخت */}
      <div style={{
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>مبلغ سفارش:</span>
          <span>{amount.toLocaleString('fa-IR')} تومان</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>کارمزد ({selectedMethodData?.name}):</span>
          <span>{(selectedMethodData?.fee || 0).toLocaleString('fa-IR')} تومان</span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontWeight: 'bold',
          fontSize: '18px',
          paddingTop: '10px',
          borderTop: '2px solid #ddd'
        }}>
          <span>مبلغ قابل پرداخت:</span>
          <span style={{ color: '#2ecc71' }}>{totalAmount.toLocaleString('fa-IR')} تومان</span>
        </div>
      </div>
      
      {/* انتخاب روش پرداخت */}
      <div style={{ marginBottom: '25px' }}>
        <h4 style={{ marginBottom: '15px' }}>انتخاب روش پرداخت</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {paymentMethods.map(method => (
            <label key={method.id} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              border: '2px solid ' + (selectedMethod === method.id ? '#3498db' : '#e0e0e0'),
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={(e) => setSelectedMethod(e.target.value)}
                style={{ marginLeft: '10px' }}
              />
              <span style={{ fontSize: '24px', marginLeft: '15px' }}>{method.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{method.name}</div>
                {method.fee > 0 ? (
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    کارمزد: {method.fee.toLocaleString('fa-IR')} تومان
                  </div>
                ) : (
                  <div style={{ fontSize: '12px', color: '#27ae60' }}>بدون کارمزد</div>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>
      
      {/* خطا */}
      {error && (
        <div style={{
          background: '#ffebee',
          color: '#c62828',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          ⚠️ {error}
        </div>
      )}
      
      {/* دکمه پرداخت */}
      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          width: '100%',
          padding: '18px',
          background: loading ? '#95a5a6' : 
                     selectedMethod === 'crypto' ? '#f39c12' :
                     selectedMethod === 'card' ? '#3498db' : '#2ecc71',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}
      >
        {loading ? (
          <>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            در حال اتصال به درگاه...
          </>
        ) : (
          <>
            <span style={{ fontSize: '24px' }}>
              {selectedMethod === 'crypto' ? '₿' :
               selectedMethod === 'card' ? '💳' : '👛'}
            </span>
            پرداخت {totalAmount.toLocaleString('fa-IR')} تومان
          </>
        )}
      </button>
      
      {/* امنیت */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#e8f4fd',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#2980b9',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <span>🔒</span>
          <span>پرداخت ۱۰۰٪ امن با SSL رمزگذاری شده</span>
          <span>🔒</span>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
