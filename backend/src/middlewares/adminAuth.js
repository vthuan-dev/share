import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Không có token xác thực' });
    }
    
    const token = authHeader.slice(7);
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const decoded = jwt.verify(token, secret);
    
    const user = await User.findById(decoded.sub).lean();
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Bạn không có quyền truy cập' });
    }
    
    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token không hợp lệ' });
  }
}
