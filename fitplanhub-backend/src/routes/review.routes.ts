// ========================================
// src/routes/review.routes.ts
// ========================================
import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate, createReviewSchema } from '../middleware/validation.middleware';

const router = Router();

router.post('/', authenticate, validate(createReviewSchema), reviewController.createReview);
router.get('/plan/:planId', reviewController.getPlanReviews);
router.post('/:id/helpful', authenticate, reviewController.markReviewHelpful);

export default router;
