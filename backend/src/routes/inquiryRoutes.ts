import { Router } from 'express';
import {
  createInquiry,
  adminGetAllInquiries,
  updateInquiryStatus,
  deleteInquiry
} from '../controllers/inquiryController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public route
router.post('/', createInquiry);

// Admin routes
router.get('/admin/all', verifyAdmin, adminGetAllInquiries);
router.put('/:id', verifyAdmin, updateInquiryStatus);
router.delete('/:id', verifyAdmin, deleteInquiry);

export default router;