import { useState } from 'react';
import { useRouter } from 'next/router';
import ShopLayout from '../../components/layouts/ShopLayout';
import PaymentGateway from '../../components/payment/PaymentGateway';

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [orderId, setOrderId] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newOrderId = 'ORD-' + Date.now().toString().slice(-8);
    setOrderId(newOrderId);
    setStep(2);
  };
  
  const handlePaymentSuccess = (paymentData) => {
    setTimeout(() => {
      router.push('/shop/order-success?order=' + orderId);
    }, 1500);
  };
  
  return (
    <ShopLayout pageTitle="تکمیل خرید - تتراشاپ">
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h1>تکمیل خرید</h1>
        
        {step === 1 ? (
          <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '10px' }}>
            <h3 style={{ marginBottom: '20px' }}>اطلاعات ارسال</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>نام کامل</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>ایمیل</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>شماره تماس</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px'
                  }}
                />
              </div>
              
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '16px',
                  background: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ادامه به پرداخت
              </button>
            </form>
          </div>
        ) : (
          <PaymentGateway 
            amount={85000}
            orderId={orderId}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </ShopLayout>
  );
}
