import { Router } from 'express';
import { getPlans, purchasePlan, getSubscriptionStatus } from '../controllers/subscription.controller.js';
import { authGuard } from '../middlewares/auth.js';

const router = Router();

router.get('/plans', getPlans); // Public - xem danh sách gói
router.get('/status', authGuard, getSubscriptionStatus); // Check subscription status
router.post('/purchase', authGuard, purchasePlan); // Mua gói

export default router;

