import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    region: { type: String }, // Miền: 'Bắc', 'Trung', 'Nam'
    province: { type: String }, // Tỉnh thành (64 tỉnh thành)
    provinceCode: { type: String }, // Mã tỉnh thành (để dễ query)
    image: { type: String }, // Ảnh đại diện nhóm
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export const Group = mongoose.models.Group || mongoose.model('Group', groupSchema);


