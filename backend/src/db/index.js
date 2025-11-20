import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI;

mongoose.set('strictQuery', true);

export async function connectMongo() {
  if (mongoose.connection.readyState === 1) return;
  if (!mongoUrl) {
    throw new Error('Không tìm thấy biến môi trường MONGO_URL / MONGODB_URI để kết nối MongoDB');
  }
  await mongoose.connect(mongoUrl, { autoIndex: true });
  console.log('Connected to MongoDB');
}

export default mongoose;


