import { User } from '../models/User.js';

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


