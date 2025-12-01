export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    service: '3d-conversion-api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
}
