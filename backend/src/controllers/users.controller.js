import { z } from 'zod';
import { User } from '../models/User.js';

const updateProfileSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  email: z.string().email().optional(),
  phone: z.string().trim().min(6).max(20).optional(),
  address: z.string().trim().max(255).optional(),
});

export async function me(req, res, next) {
  try {
    res.set('Cache-Control', 'no-store');
    // Always read from DB to get latest balance/approval status
    let user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Get current date in YYYY-MM-DD format (Vietnam timezone UTC+7)
    const today = new Date();
    today.setHours(today.getHours() + 7); // Convert to Vietnam time
    const todayStr = today.toISOString().split('T')[0];

    // Check if we need to reset shareCount (new day)
    let shareCount = user.shareCount || 0;
    if (user.lastShareDate && user.lastShareDate !== todayStr) {
      // It's a new day, reset the count
      shareCount = 0;
      // Update in database
      await User.findByIdAndUpdate(req.user.id, {
        shareCount: 0,
        lastShareDate: null
      });
    }

    return res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      role: user.role || 'user',
      balance: user.balance || 0,
      isApproved: !!user.isApproved,
      shareCount: shareCount,
      createdAt: user.createdAt,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const parsed = updateProfileSchema.parse(req.body || {});
    const updateData = Object.fromEntries(
      Object.entries(parsed).filter(([, value]) => value !== undefined)
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Vui lòng cung cấp thông tin cần cập nhật' });
    }

    if (updateData.email) {
      const existing = await User.findOne({
        email: updateData.email,
        _id: { $ne: req.user.id },
      }).lean();
      if (existing) {
        return res.status(409).json({ error: 'Email đã được sử dụng bởi tài khoản khác' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).lean();

    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        role: user.role || 'user',
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getTodayNewUsers(req, res, next) {
  try {
    // Get current date in YYYY-MM-DD format (Vietnam timezone UTC+7)
    const today = new Date();
    today.setHours(today.getHours() + 7); // Convert to Vietnam time
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Count users created today
    const count = await User.countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    return res.json({
      count: count,
      date: today.toISOString().split('T')[0]
    });
  } catch (err) {
    next(err);
  }
}

export async function incrementShareCount(req, res, next) {
  try {
    const { groupCount } = req.body;

    if (!groupCount || groupCount < 1) {
      return res.status(400).json({ error: 'Invalid group count' });
    }

    // Get current date in YYYY-MM-DD format (Vietnam timezone UTC+7)
    const today = new Date();
    today.setHours(today.getHours() + 7); // Convert to Vietnam time
    const todayStr = today.toISOString().split('T')[0];

    // Get current user to check lastShareDate
    const currentUser = await User.findById(req.user.id).lean();
    if (!currentUser) return res.status(404).json({ error: 'User not found' });

    // If last share date is different from today, reset count
    const updateData = currentUser.lastShareDate === todayStr
      ? { $inc: { shareCount: groupCount }, lastShareDate: todayStr }
      : { shareCount: groupCount, lastShareDate: todayStr };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).lean();

    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.json({
      success: true,
      shareCount: user.shareCount || 0,
    });
  } catch (err) {
    next(err);
  }
}


