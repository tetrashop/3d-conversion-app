export default function CryptoDashboard({ portfolio, loading }) {
  if (loading) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <p>در حال بارگذاری اطلاعات کیف پول...</p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* موجودی کل */}
        <div style={{
          padding: '25px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '10px' }}>موجودی کل</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>
            ${portfolio.totalBalance.toLocaleString()}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>USD</div>
        </div>

        {/* سود/ضرر */}
        <div style={{
          padding: '25px',
          background: portfolio.totalProfit >= 0 
            ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
            : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '10px' }}>
            {portfolio.totalProfit >= 0 ? 'سود کل' : 'ضرر کل'}
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>
            ${Math.abs(portfolio.totalProfit).toLocaleString()}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>
            {portfolio.totalProfit >= 0 ? '+' : '-'}{Math.abs(portfolio.profitPercentage)}%
          </div>
        </div>

        {/* ارزهای فعال */}
        <div style={{
          padding: '25px',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '10px' }}>ارزهای فعال</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>
            {portfolio.currencies.length}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>رمز ارز</div>
        </div>
      </div>

      {/* لیست ارزها */}
      <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>دارایی‌های شما</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {portfolio.currencies.map((currency) => (
          <div key={currency.id} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '15px',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            transition: 'all 0.2s'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: currency.color,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '20px'
              }}>
                {currency.symbol.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  {currency.name} ({currency.symbol})
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  مقدار: {currency.amount} {currency.symbol}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '5px' }}>
                ${currency.value.toLocaleString()}
              </div>
              <div style={{
                fontSize: '14px',
                color: currency.change >= 0 ? '#2ecc71' : '#e74c3c'
              }}>
                {currency.change >= 0 ? '↑' : '↓'} {Math.abs(currency.change)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
