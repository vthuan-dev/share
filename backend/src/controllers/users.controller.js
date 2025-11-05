import { User } from '../models/User.js';

export async function me(req, res, next) {
  try {
    res.set('Cache-Control', 'no-store');
    // Always read from DB to get latest balance/approval status
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      balance: user.balance || 0,
      isApproved: !!user.isApproved,
      createdAt: user.createdAt,
    });
  } catch (err) {
    next(err);
  }
}


