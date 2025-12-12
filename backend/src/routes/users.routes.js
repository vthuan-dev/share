import { Router } from 'express';
import { me, incrementShareCount, getTodayNewUsers, updateProfile, sharePost, getSharePosts } from '../controllers/users.controller.js';
import { authGuard } from '../middlewares/auth.js';

const router = Router();

router.get('/me', authGuard, me);
router.put('/me', authGuard, updateProfile);
router.post('/share', authGuard, incrementShareCount); // Legacy
router.post('/share-post', authGuard, sharePost); // New: share with link
router.get('/share-posts', authGuard, getSharePosts); // Get list of shared posts
router.get('/today-new-users', authGuard, getTodayNewUsers);

export default router;


