import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';
import { connectToDatabase } from '../config/db.js';

async function seedAdmin() {
  try {
    await connectToDatabase();

    // Pull initial admin credentials from environment variables
    const email = process.env.INITIAL_ADMIN_EMAIL;
    const plainPassword = process.env.INITIAL_ADMIN_PASSWORD;

    if (!email || !plainPassword) {
      console.error('Error: INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD must be defined in your .env file');
      process.exit(1);
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(plainPassword, salt);

    await Admin.create({
      username: 'SuperAdmin',
      email,
      passwordHash
    });

    console.log(`Admin created successfully! Email: ${email}`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
}

seedAdmin();