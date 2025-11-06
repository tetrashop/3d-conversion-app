export default async function handler(request, response) {
  // تنظیم CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  const products = [
    {
      id: 1,
      name: 'لپ‌تاپ گیمینگ ASUS ROG',
      description: 'لپ‌تاپ گیمینگ با پردازنده Core i7 و کارت گرافیک RTX 4060',
      price: 38500000,
      category: 'الکترونیک',
      stock: 8
    },
    {
      id: 2,
      name: 'هدفون بی‌سیم Sony WH-1000XM4',
      description: 'هدفون با نویزکنسلی پیشرفته و کیفیت صدای استثنایی',
      price: 12500000,
      category: 'صوتی', 
      stock: 15
    }
  ];

  const { pathname } = new URL(request.url, `http://${request.headers.host}`);

  if (pathname === '/api/health') {
    return response.status(200).json({
      status: 'healthy',
      service: 'Tetrashop API',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  }

  if (pathname === '/api/products') {
    return response.status(200).json({
      success: true,
      data: {
        products: products,
        count: products.length
      }
    });
  }

  return response.status(200).json({
    success: true,
    message: 'Tetrashop API'
  });
}
