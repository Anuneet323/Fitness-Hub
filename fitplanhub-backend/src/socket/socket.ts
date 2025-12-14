// ========================================
// src/socket/socket.ts
// ========================================
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { verifyToken } from '../utils/jwt.util';
import { Message } from '../models/Message.model';
import { createNotification } from '../services/notification.service';

interface SocketUser {
  userId: string;
  socketId: string;
}

const onlineUsers = new Map<string, string>(); // userId -> socketId

export const initializeSocket = (httpServer: HTTPServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new Error('Invalid token'));
    }

    socket.data.user = decoded;
    next();
  });

  io.on('connection', (socket) => {
    const userId = socket.data.user.userId;
    console.log(`✅ User connected: ${userId}`);

    // Add user to online users
    onlineUsers.set(userId, socket.id);

    // Emit online status
    socket.broadcast.emit('user-online', { userId });

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Handle sending messages
    socket.on('send-message', async (data) => {
      try {
        const { receiverId, content, mediaUrl, mediaType } = data;
        const senderId = userId;

        // Create conversation ID (sorted to ensure consistency)
        const conversationId = [senderId, receiverId].sort().join('-');

        // Save message to database
        const message = await Message.create({
          conversationId,
          senderId,
          receiverId,
          content,
          mediaUrl,
          mediaType
        });

        // Populate sender details
        const populatedMessage = await Message.findById(message._id)
          .populate('senderId', 'name avatarUrl')
          .populate('receiverId', 'name avatarUrl');

        // Emit to receiver if online
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive-message', populatedMessage);
        }

        // Emit back to sender for confirmation
        socket.emit('message-sent', populatedMessage);

        // Create notification for receiver
        await createNotification({
          userId: receiverId,
          type: 'message',
          title: 'New Message',
          message: `You have a new message from ${socket.data.user.name}`,
          fromUserId: senderId,
          link: `/messages/${senderId}`
        });

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message-error', { error: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      const { receiverId } = data;
      const receiverSocketId = onlineUsers.get(receiverId);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user-typing', { 
          userId,
          isTyping: true 
        });
      }
    });

    socket.on('stop-typing', (data) => {
      const { receiverId } = data;
      const receiverSocketId = onlineUsers.get(receiverId);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user-typing', { 
          userId,
          isTyping: false 
        });
      }
    });

    // Handle message read status
    socket.on('mark-as-read', async (data) => {
      try {
        const { messageId } = data;
        
        await Message.findByIdAndUpdate(messageId, {
          isRead: true,
          readAt: new Date()
        });

        // Emit read confirmation
        socket.emit('message-read', { messageId });
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Handle video call signals
    socket.on('call-user', (data) => {
      const { to, offer } = data;
      const toSocketId = onlineUsers.get(to);
      
      if (toSocketId) {
        io.to(toSocketId).emit('incoming-call', {
          from: userId,
          offer
        });
      }
    });

    socket.on('answer-call', (data) => {
      const { to, answer } = data;
      const toSocketId = onlineUsers.get(to);
      
      if (toSocketId) {
        io.to(toSocketId).emit('call-answered', {
          from: userId,
          answer
        });
      }
    });

    socket.on('ice-candidate', (data) => {
      const { to, candidate } = data;
      const toSocketId = onlineUsers.get(to);
      
      if (toSocketId) {
        io.to(toSocketId).emit('ice-candidate', {
          from: userId,
          candidate
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${userId}`);
      onlineUsers.delete(userId);
      socket.broadcast.emit('user-offline', { userId });
    });
  });

  console.log('✅ Socket.IO initialized');
  return io;
};

export const getOnlineUsers = (): string[] => {
  return Array.from(onlineUsers.keys());
};