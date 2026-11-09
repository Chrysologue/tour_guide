import { Router } from 'express';
import { adminLogin, changePassword } from '../controllers/authController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// POST /api/auth/login
router.post('/login', adminLogin);

// PUT /api/auth/change-password (Protected)
router.put('/change-password', verifyAdmin, changePassword);

export default router;