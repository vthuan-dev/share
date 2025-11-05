import { Router } from 'express';
import { getPendingUsers, getAllUsers, approveUser, rejectUser } from '../controllers/admin.controller.js';
import { requireAdmin } from '../middlewares/adminAuth.js';

const router = Router();

router.get('/users/pending', requireAdmin, getPendingUsers);
router.get('/users', requireAdmin, getAllUsers);
router.post('/users/:userId/approve', requireAdmin, approveUser);
router.delete('/users/:userId/reject', requireAdmin, rejectUser);

export default router;
