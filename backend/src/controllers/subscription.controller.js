import { z } from 'zod';
import { User } from '../models/User.js';

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

const purchaseSchema = z.object({
  planId: z.enum(['6months', '12months']),
});

// Lấy danh sách gói đăng ký
export async function getPlans(req, res, next) {
  try {
    const plans = Object.entries(subscriptionPlans).map(([id, plan]) => ({
      id,
      name: plan.name,
      duration: plan.duration,
      price: plan.price,
      priceFormatted: `${(plan.price / 1000).toFixed(0)}k`,
    }));

    return res.json({
      success: true,
      plans,
    });
  } catch (err) {
    next(err);
  }
}

// Mua gói đăng ký (giả lập - trong thực tế cần tích hợp payment gateway)
export async function purchasePlan(req, res, next) {
  try {
    const { planId } = purchaseSchema.parse(req.body);
    const plan = subscriptionPlans[planId];
    
    if (!plan) {
      return res.status(400).json({ error: 'Gói đăng ký không hợp lệ' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

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

    // Cập nhật subscription
    await User.findByIdAndUpdate(req.user.id, {
      subscriptionExpiresAt: expiresAt,
    });

    return res.json({
      success: true,
      message: `Đăng ký ${plan.name} thành công!`,
      subscription: {
        planId,
        planName: plan.name,
        expiresAt: expiresAt.toISOString(),
        price: plan.price,
      },
    });
  } catch (err) {
    next(err);
  }
}

// Kiểm tra trạng thái subscription
export async function getSubscriptionStatus(req, res, next) {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });

    const now = new Date();
    const hasActiveSubscription = user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > now;
    const canShareFree = !user.hasUsedFreeShare;

    return res.json({
      success: true,
      hasActiveSubscription: !!hasActiveSubscription,
      canShareFree,
      subscriptionExpiresAt: user.subscriptionExpiresAt,
      hasUsedFreeShare: !!user.hasUsedFreeShare,
    });
  } catch (err) {
    next(err);
  }
}

