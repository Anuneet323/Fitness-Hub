
// ========================================
// src/routes/plan.routes.ts
// ========================================
import { Router } from 'express';
import * as planController from '../controllers/plan.controller';
import { authenticate, authorizeTrainer } from '../middleware/auth.middleware';
import { validate, createPlanSchema } from '../middleware/validation.middleware';

const router = Router();

router.get('/', planController.getAllPlans);
router.get('/my-plans', authenticate, authorizeTrainer, planController.getMyPlans);
router.get('/:id', planController.getPlanById);
router.post('/', authenticate, authorizeTrainer, validate(createPlanSchema), planController.createPlan);
router.put('/:id', authenticate, authorizeTrainer, planController.updatePlan);
router.delete('/:id', authenticate, authorizeTrainer, planController.deletePlan);

export default router;
