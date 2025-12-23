import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

dotenv.config();

async function main() {
  const mongoUrl = process.env.MONGODB_URI || process.env.MONGO_URL;
  if (!mongoUrl) {
    console.error('Missing MONGODB_URI or MONGO_URL in environment.');
    process.exit(1);
  }

  await mongoose.connect(mongoUrl);

  try {
    const user = await User.findOne().lean();
    if (!user) {
      console.log('No user found in database. Please create a user first.');
      return;
    }

    console.log('User free-share state:');
    console.log({
      id: user._id.toString(),
      hasUsedFreeShare: user.hasUsedFreeShare,
      totalFreeGroupsShared: user.totalFreeGroupsShared,
      subscriptionExpiresAt: user.subscriptionExpiresAt,
    });
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


