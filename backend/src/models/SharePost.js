import mongoose from 'mongoose';

const sharePostSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    postLink: { type: String, required: true }, // Link bài viết Facebook
    groupIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }], // Các nhóm đã share
    groupCount: { type: Number, default: 0 }, // Số lượng nhóm
    isFreeShare: { type: Boolean, default: false }, // Có phải lần share miễn phí không
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export const SharePost = mongoose.models.SharePost || mongoose.model('SharePost', sharePostSchema);

