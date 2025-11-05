import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/shareapp';

mongoose.set('strictQuery', true);

export async function connectMongo() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(mongoUrl, { autoIndex: true });
  console.log('Connected to MongoDB');
}

export default mongoose;


