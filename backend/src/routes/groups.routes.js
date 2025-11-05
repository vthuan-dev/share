import { Router } from 'express';
import { listGroups } from '../controllers/groups.controller.js';

const router = Router();

router.get('/', listGroups);

export default router;


