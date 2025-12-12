import { z } from 'zod';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { SharePost } from '../models/SharePost.js';

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

    // Check subscription status
    const now = new Date();
    const hasActiveSubscription = user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > now;

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
      hasUsedFreeShare: !!user.hasUsedFreeShare,
      hasActiveSubscription: !!hasActiveSubscription,
      subscriptionExpiresAt: user.subscriptionExpiresAt,
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

// Share bài viết với link
export async function sharePost(req, res, next) {
  try {
    const { postLink, groupIds, groupCount } = req.body;

    if (!postLink || !postLink.trim()) {
      return res.status(400).json({ error: 'Vui lòng nhập link bài viết' });
    }

    if (!groupIds || !Array.isArray(groupIds) || groupIds.length === 0) {
      return res.status(400).json({ error: 'Vui lòng chọn ít nhất một nhóm' });
    }

    const count = groupCount || groupIds.length;
    if (count < 1) {
      return res.status(400).json({ error: 'Số lượng nhóm không hợp lệ' });
    }

    // Get current user
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) return res.status(404).json({ error: 'User not found' });

    // Check if user can share (free first time or has active subscription)
    const now = new Date();
    const hasActiveSubscription = currentUser.subscriptionExpiresAt && new Date(currentUser.subscriptionExpiresAt) > now;
    const canShareFree = !currentUser.hasUsedFreeShare;
    
    if (!canShareFree && !hasActiveSubscription) {
      return res.status(403).json({ 
        error: 'Bạn cần đăng ký gói để tiếp tục chia sẻ. Lần đầu chia sẻ miễn phí, từ lần 2 cần đăng ký gói.',
        requiresSubscription: true
      });
    }

    // Get current date in YYYY-MM-DD format (Vietnam timezone UTC+7)
    const today = new Date();
    today.setHours(today.getHours() + 7);
    const todayStr = today.toISOString().split('T')[0];

    // Mark as used free share if this is first time
    const isFreeShare = canShareFree;

    // Convert groupIds from string to ObjectId
    const groupObjectIds = groupIds.map(id => {
      try {
        return new mongoose.Types.ObjectId(id);
      } catch (err) {
        // If invalid ObjectId, return null (will be filtered out)
        return null;
      }
    }).filter(id => id !== null);

    // Create share post record
    const sharePost = await SharePost.create({
      userId: currentUser._id,
      postLink: postLink.trim(),
      groupIds: groupObjectIds,
      groupCount: count,
      isFreeShare: isFreeShare,
    });

    // Update user - mark free share as used
    await User.findByIdAndUpdate(req.user.id, {
      hasUsedFreeShare: true,
    });

    // Update share count separately (vì không thể mix $inc với field thường)
    if (currentUser.lastShareDate === todayStr) {
      // Same day - increment
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { shareCount: count },
        lastShareDate: todayStr,
      });
    } else {
      // New day - reset and set
      await User.findByIdAndUpdate(req.user.id, {
        shareCount: count,
        lastShareDate: todayStr,
      });
    }

    return res.json({
      success: true,
      sharePost: {
        id: sharePost._id.toString(),
        postLink: sharePost.postLink,
        groupCount: sharePost.groupCount,
        isFreeShare: sharePost.isFreeShare,
        createdAt: sharePost.createdAt,
      },
      message: isFreeShare 
        ? 'Chia sẻ miễn phí thành công! Lần tiếp theo bạn cần đăng ký gói để tiếp tục.'
        : 'Chia sẻ thành công!',
    });
  } catch (err) {
    next(err);
  }
}

// Lấy danh sách bài viết đã share
export async function getSharePosts(req, res, next) {
  try {
    const sharePosts = await SharePost.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('groupIds', 'name region province')
      .lean();

    return res.json({
      success: true,
      posts: sharePosts.map(post => ({
        id: post._id.toString(),
        postLink: post.postLink,
        groupCount: post.groupCount,
        groups: post.groupIds || [],
        isFreeShare: post.isFreeShare,
        createdAt: post.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
}

// Legacy function - giữ lại để tương thích
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


