import { useState } from 'react';
import ShopLayout from '../../components/layouts/ShopLayout';

export default function ExchangePage() {
  const [fromCurrency, setFromCurrency] = useState('USDT');
  const [toCurrency, setToCurrency] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(0.000023);
  const [estimatedAmount, setEstimatedAmount] = useState(0);

  const currencies = [
    { symbol: 'BTC', name: 'Bitcoin', balance: 0.045, color: '#F7931A' },
    { symbol: 'ETH', name: 'Ethereum', balance: 0.32, color: '#627EEA' },
    { symbol: 'USDT', name: 'Tether', balance: 200, color: '#26A17B' },
    { symbol: 'TRX', name: 'Tron', balance: 1500, color: '#FF060A' },
    { symbol: 'TETRA', name: 'Tetra Token', balance: 5000, color: '#3498db' }
  ];

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    
    if (value && !isNaN(value)) {
      const rate = getExchangeRate(fromCurrency, toCurrency);
      setEstimatedAmount(parseFloat(value) * rate);
    } else {
      setEstimatedAmount(0);
    }
  };

  const getExchangeRate = (from, to) => {
    // نرخ‌های نمونه
    const rates = {
      'USDT_BTC': 0.000023,
      'USDT_ETH': 0.00045,
      'USDT_TRX': 15,
      'BTC_ETH': 19.5,
      'BTC_USDT': 42000,
      'ETH_BTC': 0.051
    };
    
    return rates[`${from}_${to}`] || 0.000023;
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    const rate = getExchangeRate(toCurrency, fromCurrency);
    setExchangeRate(rate);
    setEstimatedAmount(amount ? parseFloat(amount) * rate : 0);
  };

  const handleExchange = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert('لطفاً مقدار معتبر وارد کنید');
      return;
    }

    const selectedFrom = currencies.find(c => c.symbol === fromCurrency);
    if (parseFloat(amount) > selectedFrom.balance) {
      alert('موجودی کافی نیست');
      return;
    }

    if (confirm(`آیا از تبدیل ${amount} ${fromCurrency} به ${estimatedAmount.toFixed(8)} ${toCurrency} مطمئن هستید؟`)) {
      alert('درخواست تبدیل با موفقیت ثبت شد!');
      setAmount('');
      setEstimatedAmount(0);
    }
  };

  return (
    <ShopLayout pageTitle="تبدیل ارز - تتراشاپ">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {/* هدر */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{ color: '#2c3e50', fontSize: '32px', marginBottom: '10px' }}>
              🔄 تبدیل ارز
            </h1>
            <p style={{ color: '#666', fontSize: '16px' }}>
              تبدیل سریع و آسان بین ارزهای مختلف
            </p>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* بخش تبدیل */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginBottom: '30px', color: '#2c3e50' }}>تبدیل ارز</h2>
            
            {/* از */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <label style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                  از
                </label>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  موجودی: {currencies.find(c => c.symbol === fromCurrency)?.balance.toLocaleString()} {fromCurrency}
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="مقدار"
                  style={{
                    flex: 1,
                    padding: '15px',
                    border: 'none',
                    outline: 'none',
                    fontSize: '16px'
                  }}
                />
                
                <select
                  value={fromCurrency}
                  onChange={(e) => {
                    setFromCurrency(e.target.value);
                    const rate = getExchangeRate(e.target.value, toCurrency);
                    setExchangeRate(rate);
                    setEstimatedAmount(amount ? parseFloat(amount) * rate : 0);
                  }}
                  style={{
                    padding: '15px',
                    border: 'none',
                    borderRight: '2px solid #e0e0e0',
                    background: '#f8f9fa',
                    fontSize: '16px',
                    outline: 'none',
                    cursor: 'pointer',
                    minWidth: '120px'
                  }}
                >
                  {currencies.map(currency => (
                    <option key={currency.symbol} value={currency.symbol}>
                      {currency.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* دکمه تعویض */}
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <button
                onClick={handleSwapCurrencies}
                style={{
                  width: '60px',
                  height: '60px',
                  background: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}
              >
                ⇅
              </button>
            </div>

            {/* به */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <label style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                  به
                </label>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  موجودی: {currencies.find(c => c.symbol === toCurrency)?.balance.toLocaleString()} {toCurrency}
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <input
                  type="text"
                  value={estimatedAmount.toFixed(8)}
                  readOnly
                  style={{
                    flex: 1,
                    padding: '15px',
                    border: 'none',
                    background: '#f8f9fa',
                    fontSize: '16px',
                    color: '#666'
                  }}
                />
                
                <select
                  value={toCurrency}
                  onChange={(e) => {
                    setToCurrency(e.target.value);
                    const rate = getExchangeRate(fromCurrency, e.target.value);
                    setExchangeRate(rate);
                    setEstimatedAmount(amount ? parseFloat(amount) * rate : 0);
                  }}
                  style={{
                    padding: '15px',
                    border: 'none',
                    borderRight: '2px solid #e0e0e0',
                    background: '#f8f9fa',
                    fontSize: '16px',
                    outline: 'none',
                    cursor: 'pointer',
                    minWidth: '120px'
                  }}
                >
                  {currencies.map(currency => (
                    <option key={currency.symbol} value={currency.symbol}>
                      {currency.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* نرخ تبدیل */}
            <div style={{
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '8px',
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                نرخ تبدیل
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>
                1 {fromCurrency} = {exchangeRate.toFixed(8)} {toCurrency}
              </div>
            </div>

            {/* دکمه تبدیل */}
            <button
              onClick={handleExchange}
              style={{
                width: '100%',
                padding: '18px',
                background: '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#27ae60';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2ecc71';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🔄 تبدیل ارز
            </button>
          </div>

          {/* اطلاعات */}
          <div>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>💡 نکات تبدیل</h3>
              <ul style={{ paddingRight: '20px', color: '#666', lineHeight: '2' }}>
                <li>تبدیل فوری و بدون کارمزد برای اعضا</li>
                <li>نرخ‌ها به صورت لحظه‌ای محاسبه می‌شوند</li>
                <li>حداکثر زمان انجام تراکنش: ۵ دقیقه</li>
                <li>حداقل مقدار تبدیل: ۱۰ دلار</li>
                <li>پشتیبانی ۲۴/۷ از سرویس تبدیل</li>
              </ul>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>📊 نرخ‌های محبوب</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {[
                  { from: 'USDT', to: 'BTC', rate: '0.000023' },
                  { from: 'USDT', to: 'ETH', rate: '0.00045' },
                  { from: 'BTC', to: 'ETH', rate: '19.5' },
                  { from: 'USDT', to: 'TRX', rate: '15' }
                ].map((pair, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: '#3498db',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold'
                      }}>
                        {pair.from.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{pair.from}/{pair.to}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                      1 {pair.from} = {pair.rate} {pair.to}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* تاریخچه تبدیل‌ها */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>📝 آخرین تبدیل‌ها</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            {[
              { id: 1, from: 'USDT', to: 'BTC', amount: 100, result: 0.0023, date: 'امروز ۱۴:۳۰' },
              { id: 2, from: 'BTC', to: 'ETH', amount: 0.01, result: 0.195, date: 'دیروز ۰۹:۱۵' },
              { id: 3, from: 'USDT', to: 'TRX', amount: 50, result: 750, date: '۲ روز پیش' },
              { id: 4, from: 'ETH', to: 'BTC', amount: 0.5, result: 0.0255, date: '۳ روز پیش' }
            ].map(history => (
              <div key={history.id} style={{
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                    {history.from} → {history.to}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{history.date}</div>
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                  مقدار: {history.amount} {history.from}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2c3e50' }}>
                  نتیجه: {history.result} {history.to}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
