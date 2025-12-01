export default function handler(req, res) {
  console.log('✅ TEST API called');
  return res.status(200).json({
    success: true,
    message: 'API is working! 🎉',
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  });
}
