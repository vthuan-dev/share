import { z } from 'zod';
import { User } from '../models/User.js';
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

const purchaseSchema = z.object({
  planId: z.enum(['6months', '12months']),
  paymentNote: z.string().optional(),
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

// Mua gói đăng ký - tạo pending request chờ admin xác nhận
export async function purchasePlan(req, res, next) {
  try {
    const { planId, paymentNote } = purchaseSchema.parse(req.body);
    const plan = subscriptionPlans[planId];
    
    if (!plan) {
      return res.status(400).json({ error: 'Gói đăng ký không hợp lệ' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Tạo pending subscription request
    const request = await SubscriptionRequest.create({
      userId: req.user.id,
      planId,
      planName: plan.name,
      price: plan.price,
      status: 'pending',
      paymentNote: paymentNote || `GOI ${plan.name.toUpperCase()} WEB SHARE`,
    });

    return res.json({
      success: true,
      message: `Đã gửi yêu cầu đăng ký ${plan.name}. Vui lòng chờ admin xác nhận.`,
      request: {
        id: request._id.toString(),
        planId,
        planName: plan.name,
        price: plan.price,
        status: 'pending',
        createdAt: request.createdAt,
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

    // Kiểm tra có pending request không
    const pendingRequest = await SubscriptionRequest.findOne({
      userId: req.user.id,
      status: 'pending',
    }).sort({ createdAt: -1 }).lean();

    return res.json({
      success: true,
      hasActiveSubscription: !!hasActiveSubscription,
      canShareFree,
      subscriptionExpiresAt: user.subscriptionExpiresAt,
      hasUsedFreeShare: !!user.hasUsedFreeShare,
      pendingRequest: pendingRequest ? {
        id: pendingRequest._id.toString(),
        planName: pendingRequest.planName,
        price: pendingRequest.price,
        createdAt: pendingRequest.createdAt,
      } : null,
    });
  } catch (err) {
    next(err);
  }
}

