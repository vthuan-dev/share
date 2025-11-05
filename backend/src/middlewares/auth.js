import jwt from 'jsonwebtoken';

export function authGuard(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = { 
      id: payload.sub, 
      email: payload.email, 
      name: payload.name,
      role: payload.role || 'user'
    };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}


