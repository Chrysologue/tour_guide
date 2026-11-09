import { Router } from 'express';
import {
  getPublicCircuits,
  getPublicCircuitBySlug,
  adminGetAllCircuits,
  createCircuit,
  updateCircuit,
  deleteCircuit
} from '../controllers/circuitController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes (Visitors)
router.get('/', getPublicCircuits);
router.get('/:slug', getPublicCircuitBySlug);

// Admin routes (Protected by verifyAdmin middleware)
router.get('/admin/all', verifyAdmin, adminGetAllCircuits);
router.post('/', verifyAdmin, createCircuit);
router.put('/:id', verifyAdmin, updateCircuit);
router.delete('/:id', verifyAdmin, deleteCircuit);

export default router;