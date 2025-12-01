import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'توکن ارائه نشده است' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'your-secret-key';

    const decoded = jwt.verify(token, secret);
    console.log('توکن تأیید شد برای:', decoded.email);

    res.status(200).json({
      user: decoded
    });
  } catch (error) {
    console.error('خطا در تأیید توکن:', error);
    res.status(401).json({ message: 'توکن نامعتبر است' });
  }
}
