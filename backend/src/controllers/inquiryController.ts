import { Request, Response } from 'express';
import { Inquiry } from '../models/Inquiry.js';

// --- PUBLIC CONTROLLERS ---

// Submit a contact/tour inquiry
export const createInquiry = async (req: Request, res: Response) => {
  try {
    const { circuitId, name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required inquiry fields' });
    }

    const newInquiry = new Inquiry({
      circuitId: circuitId || null,
      name,
      email,
      phone: phone || '',
      subject,
      message,
      status: 'new'
    });

    const savedInquiry = await newInquiry.save();
    return res.status(201).json({ message: 'Inquiry submitted successfully', inquiry: savedInquiry });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// --- ADMIN CONTROLLERS ---

// Get all inquiries
export const adminGetAllInquiries = async (req: Request, res: Response) => {
  try {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    return res.status(200).json(inquiries);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// Update inquiry status (new, read, replied, archived)
export const updateInquiryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedInquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    return res.status(200).json({ message: 'Inquiry status updated', inquiry: updatedInquiry });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// Delete an inquiry
export const deleteInquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedInquiry = await Inquiry.findByIdAndDelete(id);

    if (!deletedInquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    return res.status(200).json({ message: 'Inquiry deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};