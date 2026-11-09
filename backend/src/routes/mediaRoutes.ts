import { Router } from 'express';
import { getPublicMedia, createMedia, deleteMedia } from '../controllers/mediaController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public route
router.get('/', getPublicMedia);

// Admin routes
router.post('/', verifyAdmin, createMedia);
router.delete('/:id', verifyAdmin, deleteMedia);

export default router;