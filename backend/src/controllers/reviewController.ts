import { Request, Response } from 'express';
import { Review } from '../models/Review.js';

// --- PUBLIC CONTROLLERS ---

// Get all approved reviews (optionally filter by circuitId)
export const getPublicReviews = async (req: Request, res: Response) => {
  try {
    const { circuitId } = req.query;
    const filter: any = { status: 'approved' };
    if (circuitId) filter.circuitId = circuitId;

    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(reviews);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// Submit a new review (Public - defaults to 'pending' status)
export const createReview = async (req: Request, res: Response) => {
  try {
    const { circuitId, customerName, email, rating, comment } = req.body;

    if (!customerName || !email || !rating || !comment) {
      return res.status(400).json({ error: 'Missing required review fields' });
    }

    const newReview = new Review({
      circuitId: circuitId || null,
      customerName,
      email,
      rating,
      comment,
      status: 'pending' // Requires admin approval
    });

    const savedReview = await newReview.save();
    return res.status(201).json({ message: 'Review submitted successfully and is pending approval', review: savedReview });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// --- ADMIN CONTROLLERS ---

// Get all reviews (Admin can see pending, approved, and rejected)
export const adminGetAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    return res.status(200).json(reviews);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// Update review status (approve, reject)
export const updateReviewStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    return res.status(200).json({ message: 'Review status updated', review: updatedReview });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// Delete a review
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    return res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};