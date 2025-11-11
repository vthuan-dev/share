import { Router } from 'express';
import { me, incrementShareCount, getTodayNewUsers } from '../controllers/users.controller.js';
import { authGuard } from '../middlewares/auth.js';

const router = Router();

router.get('/me', authGuard, me);
router.post('/share', authGuard, incrementShareCount);
router.get('/today-new-users', authGuard, getTodayNewUsers);

export default router;


