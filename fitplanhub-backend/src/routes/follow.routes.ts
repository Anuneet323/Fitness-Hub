
// ========================================
// src/routes/follow.routes.ts
// ========================================
import { Router } from 'express';
import * as followController from '../controllers/follow.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/:userId/follow', authenticate, followController.followUser);
router.delete('/:userId/unfollow', authenticate, followController.unfollowUser);
router.get('/:userId/followers', followController.getFollowers);
router.get('/:userId/following', followController.getFollowing);

export default router;
