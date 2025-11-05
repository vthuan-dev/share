import { User } from '../models/User.js';

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
