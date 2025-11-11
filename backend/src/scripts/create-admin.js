import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectMongo } from '../db/index.js';
import { User } from '../models/User.js';

async function createAdmin() {
  await connectMongo();

  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123456';
  const adminName = 'Admin';

  // Delete existing admin if exists
  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    await User.deleteOne({ email: adminEmail });
    console.log('🗑️  Deleted existing admin user');
  }

  // Create admin user
  const hash = bcrypt.hashSync(adminPassword, 10);
  await User.create({
    name: adminName,
    email: adminEmail,
    passwordHash: hash,
    role: 'admin',
    isApproved: true
  });

  console.log('✅ Admin user created successfully!');
  console.log('📧 Email:', adminEmail);
  console.log('🔑 Password:', adminPassword);
  console.log('⚠️  Please change the password after first login');
  
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error('Error creating admin:', err);
  process.exit(1);
});
