import { Router } from 'express';
import { getPendingUsers, getAllUsers, approveUser, rejectUser, getAllSharePosts, getPendingSubscriptionRequests, approveSubscriptionRequest, rejectSubscriptionRequest } from '../controllers/admin.controller.js';
import { requireAdmin } from '../middlewares/adminAuth.js';

const router = Router();

router.get('/users/pending', requireAdmin, getPendingUsers);
router.get('/users', requireAdmin, getAllUsers);
router.post('/users/:userId/approve', requireAdmin, approveUser);
router.delete('/users/:userId/reject', requireAdmin, rejectUser);
router.get('/share-posts', requireAdmin, getAllSharePosts);
router.get('/subscription-requests', requireAdmin, getPendingSubscriptionRequests);
router.post('/subscription-requests/:requestId/approve', requireAdmin, approveSubscriptionRequest);
router.post('/subscription-requests/:requestId/reject', requireAdmin, rejectSubscriptionRequest);

export default router;
