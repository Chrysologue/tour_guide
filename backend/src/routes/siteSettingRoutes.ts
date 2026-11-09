import { Router } from 'express';
import { getSettingByKey, upsertSetting } from '../controllers/siteSettingController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/:key', getSettingByKey);
router.post('/', verifyAdmin, upsertSetting);

export default router;