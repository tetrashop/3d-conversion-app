export default function RecentTransactions() {
  const transactions = [
    { id: 1, type: 'خرید', amount: 0.01, currency: 'BTC', status: 'موفق', date: '۱۴۰۳/۰۱/۱۵', time: '۱۴:۳۰', value: 420 },
    { id: 2, type: 'تبدیل', amount: 100, currency: 'USDT', status: 'در انتظار', date: '۱۴۰۳/۰۱/۱۴', time: '۱۰:۱۵', value: 100 },
    { id: 3, type: 'برداشت', amount: 0.5, currency: 'ETH', status: 'موفق', date: '۱۴۰۳/۰۱/۱۳', time: '۰۹:۴۵', value: 1100 },
    { id: 4, type: 'واریز', amount: 2000, currency: 'USDT', status: 'موفق', date: '۱۴۰۳/۰۱/۱۲', time: '۱۶:۲۰', value: 2000 },
    { id: 5, type: 'خرید', amount: 5000, currency: 'TRX', status: 'لغو شده', date: '۱۴۰۳/۰۱/۱۱', time: '۱۱:۱۰', value: 365 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'موفق': return '#2ecc71';
      case 'در انتظار': return '#f39c12';
      case 'لغو شده': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'خرید': return '🛒';
      case 'فروش': return '💰';
      case 'تبدیل': return '🔄';
      case 'واریز': return '📥';
      case 'برداشت': return '📤';
      default: return '📊';
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '25px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#2c3e50' }}>📝 آخرین تراکنش‌ها</h3>
        <a href="/crypto/transactions" style={{
          fontSize: '14px',
          color: '#3498db',
          textDecoration: 'none'
        }}>
          مشاهده همه →
        </a>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {transactions.map(transaction => (
          <div key={transaction.id} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 15px',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#e3f2fd',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                {getTypeIcon(transaction.type)}
              </div>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>
                  {transaction.type} {transaction.currency}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {transaction.date} - {transaction.time}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>
                {transaction.amount} {transaction.currency}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                ${transaction.value}
              </div>
            </div>

            <div style={{
              padding: '4px 12px',
              background: `${getStatusColor(transaction.status)}20`,
              color: getStatusColor(transaction.status),
              borderRadius: '15px',
              fontSize: '12px',
              fontWeight: 'bold',
              border: `1px solid ${getStatusColor(transaction.status)}`
            }}>
              {transaction.status}
            </div>
          </div>
        ))}
      </div>

      <button style={{
        width: '100%',
        padding: '12px',
        marginTop: '20px',
        background: 'white',
        color: '#3498db',
        border: '2px solid #3498db',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#3498db';
        e.currentTarget.style.color = 'white';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'white';
        e.currentTarget.style.color = '#3498db';
      }}
      >
        + تراکنش جدید
      </button>
    </div>
  );
}
