import express from 'express';
import { loginAdmin, getAdminProfile, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', loginAdmin);

// Protected routes (require token)
router.get('/profile', protect, getAdminProfile);
router.put('/change-password', protect, changePassword);

export default router;