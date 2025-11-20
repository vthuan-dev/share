import { Router } from 'express';
import { me, incrementShareCount, getTodayNewUsers, updateProfile } from '../controllers/users.controller.js';
import { authGuard } from '../middlewares/auth.js';

const router = Router();

router.get('/me', authGuard, me);
router.put('/me', authGuard, updateProfile);
router.post('/share', authGuard, incrementShareCount);
router.get('/today-new-users', authGuard, getTodayNewUsers);

export default router;


