import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    balance: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    lastShareDate: { type: String, default: null }, // Format: YYYY-MM-DD
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);


