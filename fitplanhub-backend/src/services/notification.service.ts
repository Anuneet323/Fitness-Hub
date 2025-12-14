
// ========================================
// src/services/notification.service.ts
// ========================================
import { Notification } from '../models/Notification.model';
import mongoose from 'mongoose';

export const createNotification = async (data: {
  userId: string;
  type: 'follow' | 'like' | 'comment' | 'subscription' | 'review' | 'message' | 'reminder' | 'system';
  title: string;
  message: string;
  link?: string;
  fromUserId?: string;
  relatedId?: string;
}) => {
  try {
    const notification = await Notification.create(data);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const notifyFollow = async (followerId: string, followingId: string) => {
  return await createNotification({
    userId: followingId,
    type: 'follow',
    title: 'New Follower',
    message: 'Someone started following you',
    fromUserId: followerId,
    link: `/profile/${followerId}`
  });
};

export const notifyLike = async (postId: string, postAuthorId: string, likerId: string) => {
  return await createNotification({
    userId: postAuthorId,
    type: 'like',
    title: 'New Like',
    message: 'Someone liked your post',
    fromUserId: likerId,
    relatedId: postId,
    link: `/post/${postId}`
  });
};

export const notifyComment = async (postId: string, postAuthorId: string, commenterId: string) => {
  return await createNotification({
    userId: postAuthorId,
    type: 'comment',
    title: 'New Comment',
    message: 'Someone commented on your post',
    fromUserId: commenterId,
    relatedId: postId,
    link: `/post/${postId}`
  });
};

export const notifySubscription = async (planId: string, trainerId: string, userId: string) => {
  return await createNotification({
    userId: trainerId,
    type: 'subscription',
    title: 'New Subscription',
    message: 'Someone subscribed to your plan',
    fromUserId: userId,
    relatedId: planId,
    link: `/plan/${planId}`
  });
};
