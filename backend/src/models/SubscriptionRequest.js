import mongoose from 'mongoose';

const subscriptionRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    planId: { type: String, enum: ['6months', '12months'], required: true },
    planName: { type: String, required: true },
    price: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'], 
      default: 'pending',
      index: true
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    approvedAt: { type: Date, default: null },
    paymentNote: { type: String, default: '' }, // Nội dung chuyển khoản
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export const SubscriptionRequest = mongoose.models.SubscriptionRequest || mongoose.model('SubscriptionRequest', subscriptionRequestSchema);

