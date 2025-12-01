export default function handler(req, res) {
  console.log('✅ Simple Test API called');
  return res.status(200).json({ 
    success: true, 
    message: 'API is working perfectly!',
    timestamp: new Date().toISOString()
  });
}
