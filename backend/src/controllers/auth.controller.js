import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User.js';

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function register(req, res, next) {
  try {
    const { name, email, password } = registerSchema.parse(req.body);
    const existing = await User.findOne({ email }).lean();
    if (existing) return res.status(409).json({ error: 'Email đã tồn tại' });
    const hash = bcrypt.hashSync(password, 10);
    const created = await User.create({ 
      name, 
      email, 
      passwordHash: hash, 
      isApproved: true, // Tự động phê duyệt
      hasUsedFreeShare: false // Chưa dùng lần share miễn phí
    });
    
    // Tự động đăng nhập sau khi đăng ký
    const user = { 
      id: created._id.toString(), 
      name: created.name, 
      email: created.email,
      phone: created.phone || '',
      address: created.address || '',
      role: created.role,
      balance: created.balance || 0,
      isApproved: true,
      hasUsedFreeShare: false,
      subscriptionExpiresAt: created.subscriptionExpiresAt,
      createdAt: created.createdAt,
    };
    const token = signToken(user);
    
    res.status(201).json({ 
      message: 'Đăng ký thành công!',
      user,
      token
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const doc = await User.findOne({ email });
    if (!doc) return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });
    const ok = bcrypt.compareSync(password, doc.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });
    
    // Bỏ check isApproved - cho phép đăng nhập tự do
    
    const user = { 
      id: doc._id.toString(), 
      name: doc.name, 
      email: doc.email,
      phone: doc.phone || '',
      address: doc.address || '',
      role: doc.role,
      balance: doc.balance || 0,
      isApproved: !!doc.isApproved,
      hasUsedFreeShare: !!doc.hasUsedFreeShare,
      subscriptionExpiresAt: doc.subscriptionExpiresAt,
      createdAt: doc.createdAt,
    };
    const token = signToken(user);
    res.json({ user, token });
  } catch (err) {
    next(err);
  }
}

function signToken(user) {
  const payload = { 
    sub: user.id, 
    email: user.email, 
    name: user.name,
    role: user.role || 'user'
  };
  const secret = process.env.JWT_SECRET || 'dev-secret';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}


