import { Router } from 'express';
import { listGroups, getRegions, getProvinces } from '../controllers/groups.controller.js';

const router = Router();

router.get('/', listGroups);
router.get('/regions', getRegions);
router.get('/provinces', getProvinces);

export default router;


