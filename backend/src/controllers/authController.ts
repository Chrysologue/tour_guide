import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';

// Admin Login
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
      { id: admin._id.toString(), email: admin.email },
      secret,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// Change Admin Password
export const changePassword = async (req: Request, res: Response) => {
  try {
    // req.admin is attached by the verifyAdmin middleware
    const adminId = req.admin?.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Verify current password is correct
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    admin.passwordHash = hashedPassword;
    await admin.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};