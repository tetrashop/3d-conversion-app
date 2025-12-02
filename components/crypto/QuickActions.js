export default function QuickActions() {
  const actions = [
    { icon: '💰', title: 'واریز', description: 'افزایش موجودی', color: '#2ecc71', link: '/crypto/deposit' },
    { icon: '💸', title: 'برداشت', description: 'درخواست برداشت', color: '#e74c3c', link: '/crypto/withdraw' },
    { icon: '🔄', title: 'تبدیل', description: 'تبدیل ارزها', color: '#3498db', link: '/crypto/exchange' },
    { icon: '📤', title: 'ارسال', description: 'ارسال به دیگران', color: '#9b59b6', link: '/crypto/send' },
    { icon: '📥', title: 'دریافت', description: 'دریافت از دیگران', color: '#f39c12', link: '/crypto/receive' },
    { icon: '📊', title: 'گزارش', description: 'گزارش مالی', color: '#1abc9c', link: '/crypto/reports' }
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '25px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>⚡ اقدامات سریع</h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '15px' 
      }}>
        {actions.map((action, index) => (
          <a 
            key={index}
            href={action.link}
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              padding: '15px',
              background: `${action.color}10`,
              borderRadius: '10px',
              border: `1px solid ${action.color}30`,
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '28px', 
                marginBottom: '10px',
                color: action.color
              }}>
                {action.icon}
              </div>
              <div style={{ 
                fontWeight: 'bold', 
                color: '#2c3e50',
                marginBottom: '5px'
              }}>
                {action.title}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#666'
              }}>
                {action.description}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
