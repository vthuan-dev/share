import { User } from '../models/User.js';
import { SharePost } from '../models/SharePost.js';
import { SubscriptionRequest } from '../models/SubscriptionRequest.js';

const subscriptionPlans = {
  '6months': {
    name: 'Gói 6 tháng',
    duration: 6, // months
    price: 500000, // 500k
  },
  '12months': {
    name: 'Gói 1 năm',
    duration: 12, // months
    price: 1000000, // 1 triệu
  },
};

// Get all pending users
export async function getPendingUsers(req, res, next) {
  try {
    const users = await User.find({ isApproved: false })
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(users);
  } catch (err) {
    next(err);
  }
}

// Get all users (for admin dashboard)
export async function getAllUsers(req, res, next) {
  try {
    const users = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(users);
  } catch (err) {
    next(err);
  }
}

// Approve user with optional balance
export async function approveUser(req, res, next) {
  try {
    const { userId } = req.params;
    const { balance } = req.body;
    
    const updateData = { isApproved: true };
    
    // Nếu có balance được cung cấp, cập nhật số dư
    if (balance !== undefined && balance !== null) {
      const balanceNum = Number(balance);
      if (isNaN(balanceNum) || balanceNum < 0) {
        return res.status(400).json({ error: 'Số tiền không hợp lệ' });
      }
      updateData.balance = balanceNum;
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy user' });
    }
    
    res.json({ message: 'Đã phê duyệt user', user });
  } catch (err) {
    next(err);
  }
}

// Reject/Delete user
export async function rejectUser(req, res, next) {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy user' });
    }
    
    res.json({ message: 'Đã từ chối và xóa user' });
  } catch (err) {
    next(err);
  }
}

// Get all share posts (for admin)
export async function getAllSharePosts(req, res, next) {
  try {
    const sharePosts = await SharePost.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .populate('userId', 'name email')
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
        user: post.userId ? {
          id: post.userId._id.toString(),
          name: post.userId.name,
          email: post.userId.email,
        } : null,
      })),
    });
  } catch (err) {
    next(err);
  }
}

// Get all pending subscription requests
export async function getPendingSubscriptionRequests(req, res, next) {
  try {
    const requests = await SubscriptionRequest.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .lean();
    
    return res.json({
      success: true,
      requests: requests.map(req => ({
        id: req._id.toString(),
        planId: req.planId,
        planName: req.planName,
        price: req.price,
        paymentNote: req.paymentNote,
        createdAt: req.createdAt,
        user: req.userId ? {
          id: req.userId._id.toString(),
          name: req.userId.name,
          email: req.userId.email,
        } : null,
      })),
    });
  } catch (err) {
    next(err);
  }
}

// Approve subscription request
export async function approveSubscriptionRequest(req, res, next) {
  try {
    const { requestId } = req.params;
    
    const request = await SubscriptionRequest.findById(requestId)
      .populate('userId');
    
    if (!request) {
      return res.status(404).json({ error: 'Không tìm thấy yêu cầu đăng ký' });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Yêu cầu này đã được xử lý' });
    }
    
    const plan = subscriptionPlans[request.planId];
    if (!plan) {
      return res.status(400).json({ error: 'Gói đăng ký không hợp lệ' });
    }
    
    const user = request.userId;
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy user' });
    }
    
    // Tính ngày hết hạn
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMonth(expiresAt.getMonth() + plan.duration);
    
    // Nếu đã có subscription, cộng thêm vào ngày hết hạn hiện tại
    if (user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > now) {
      const currentExpires = new Date(user.subscriptionExpiresAt);
      currentExpires.setMonth(currentExpires.getMonth() + plan.duration);
      expiresAt.setTime(currentExpires.getTime());
    }
    
    // Cập nhật subscription cho user
    await User.findByIdAndUpdate(user._id, {
      subscriptionExpiresAt: expiresAt,
    });
    
    // Cập nhật request status
    await SubscriptionRequest.findByIdAndUpdate(requestId, {
      status: 'approved',
      approvedBy: req.user.id,
      approvedAt: new Date(),
    });
    
    return res.json({
      success: true,
      message: `Đã xác nhận đăng ký ${request.planName} cho ${user.name}`,
    });
  } catch (err) {
    next(err);
  }
}

// Reject subscription request
export async function rejectSubscriptionRequest(req, res, next) {
  try {
    const { requestId } = req.params;
    
    const request = await SubscriptionRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ error: 'Không tìm thấy yêu cầu đăng ký' });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Yêu cầu này đã được xử lý' });
    }
    
    // Cập nhật request status
    await SubscriptionRequest.findByIdAndUpdate(requestId, {
      status: 'rejected',
      approvedBy: req.user.id,
      approvedAt: new Date(),
    });
    
    return res.json({
      success: true,
      message: 'Đã từ chối yêu cầu đăng ký',
    });
  } catch (err) {
    next(err);
  }
}
