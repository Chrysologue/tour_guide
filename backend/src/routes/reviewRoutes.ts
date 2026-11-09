import { Router } from 'express';
import {
  getPublicReviews,
  createReview,
  adminGetAllReviews,
  updateReviewStatus,
  deleteReview
} from '../controllers/reviewController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.get('/', getPublicReviews);
router.post('/', createReview);

// Admin routes
router.get('/admin/all', verifyAdmin, adminGetAllReviews);
router.put('/:id', verifyAdmin, updateReviewStatus);
router.delete('/:id', verifyAdmin, deleteReview);

export default router;