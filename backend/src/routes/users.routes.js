import { Router } from 'express';
import { me } from '../controllers/users.controller.js';
import { authGuard } from '../middlewares/auth.js';

const router = Router();

router.get('/me', authGuard, me);

export default router;


