// ========================================
// src/routes/progress.routes.ts
// ========================================
import { Router } from 'express';
import * as progressController from '../controllers/progress.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate, progressSchema } from '../middleware/validation.middleware';

const router = Router();

router.post('/', authenticate, validate(progressSchema), progressController.logProgress);
router.get('/my-progress', authenticate, progressController.getMyProgress);
router.get('/stats/:planId', authenticate, progressController.getProgressStats);

export default router;
