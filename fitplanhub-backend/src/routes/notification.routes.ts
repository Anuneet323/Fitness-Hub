// ========================================
// src/routes/notification.routes.ts
// ========================================
import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, notificationController.getMyNotifications);
router.get('/unread-count', authenticate, notificationController.getUnreadCount);
router.get('/type/:type', authenticate, notificationController.getNotificationsByType);
router.put('/:id/read', authenticate, notificationController.markAsRead);
router.put('/mark-all-read', authenticate, notificationController.markAllAsRead);
router.delete('/:id', authenticate, notificationController.deleteNotification);
router.delete('/read/all', authenticate, notificationController.deleteAllRead);
router.post('/bulk-delete', authenticate, notificationController.bulkDeleteNotifications);

export default router;
