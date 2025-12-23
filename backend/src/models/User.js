import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    isApproved: { type: Boolean, default: true }, // Mặc định true - tự do đăng ký
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    balance: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    lastShareDate: { type: String, default: null }, // Format: YYYY-MM-DD
    // Đã dùng lần share miễn phí đầu tiên chưa
    hasUsedFreeShare: { type: Boolean, default: false },
    // Số nhóm đã share trong lần share miễn phí đầu tiên (tối đa 100 nhóm)
    totalFreeGroupsShared: { type: Number, default: 0 },
    subscriptionExpiresAt: { type: Date, default: null }, // Ngày hết hạn gói đăng ký
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);


