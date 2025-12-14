



// ========================================
// src/routes/index.ts
// ========================================
import { Router } from 'express';
import authRoutes from './auth.routes';
import planRoutes from './plan.routes';
import subscriptionRoutes from './subscription.routes';
import followRoutes from './follow.routes';
import postRoutes from './post.routes';
import reviewRoutes from './review.routes';
import progressRoutes from './progress.routes';
import notificationRoutes from './notification.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/plans', planRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/follow', followRoutes);
router.use('/posts', postRoutes);
router.use('/reviews', reviewRoutes);
router.use('/progress', progressRoutes);
router.use('/notifications', notificationRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'FitPlanHub API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;