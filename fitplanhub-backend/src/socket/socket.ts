// Socket.IO setup for real-time messaging
import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { verifyToken } from "../utils/jwt.util";
import { Message } from "../models/Message.model";
import { createNotification } from "../services/notification.service";

interface SocketUser {
  userId: string;
  socketId: string;
}

const onlineUsers = new Map<string, string>(); // userId -> socketId

export const initializeSocket = (httpServer: HTTPServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Auth middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Auth required"));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new Error("Invalid token"));
    }

    socket.data.user = decoded;
    next();
  });

  io.on("connection", (socket) => {
    const userId = socket.data.user.userId;
    console.log("User connected:", userId);

    onlineUsers.set(userId, socket.id);
    socket.broadcast.emit("user-online", { userId });
    socket.join(`user:${userId}`);

    // Send message
    socket.on("send-message", async (data) => {
      try {
        const { receiverId, content, mediaUrl, mediaType } = data;
        const senderId = userId;
        const conversationId = [senderId, receiverId].sort().join("-");

        const message = await Message.create({
          conversationId,
          senderId,
          receiverId,
          content,
          mediaUrl,
          mediaType,
        });

        const populatedMessage = await Message.findById(message._id)
          .populate("senderId", "name avatarUrl")
          .populate("receiverId", "name avatarUrl");

        // Send to receiver
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive-message", populatedMessage);
        }

        socket.emit("message-sent", populatedMessage);

        // Notify receiver
        await createNotification({
          userId: receiverId,
          type: "message",
          title: "New Message",
          message: `New message from ${socket.data.user.name}`,
          fromUserId: senderId,
          link: `/messages/${senderId}`,
        });
      } catch (error) {
        console.error("Message send failed:", error);
        socket.emit("message-error", { error: "Send failed" });
      }
    });

    // Typing indicators
    socket.on("typing", (data) => {
      const { receiverId } = data;
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user-typing", { userId, isTyping: true });
      }
    });

    socket.on("stop-typing", (data) => {
      const { receiverId } = data;
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user-typing", {
          userId,
          isTyping: false,
        });
      }
    });

    // Message read
    socket.on("mark-as-read", async (data) => {
      try {
        const { messageId } = data;
        await Message.findByIdAndUpdate(messageId, {
          isRead: true,
          readAt: new Date(),
        });
        socket.emit("message-read", { messageId });
      } catch (error) {
        console.error("Read status failed:", error);
      }
    });

    // Video call
    socket.on("call-user", (data) => {
      const { to, offer } = data;
      const toSocketId = onlineUsers.get(to);
      if (toSocketId) {
        io.to(toSocketId).emit("incoming-call", { from: userId, offer });
      }
    });

    socket.on("answer-call", (data) => {
      const { to, answer } = data;
      const toSocketId = onlineUsers.get(to);
      if (toSocketId) {
        io.to(toSocketId).emit("call-answered", { from: userId, answer });
      }
    });

    socket.on("ice-candidate", (data) => {
      const { to, candidate } = data;
      const toSocketId = onlineUsers.get(to);
      if (toSocketId) {
        io.to(toSocketId).emit("ice-candidate", { from: userId, candidate });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", userId);
      onlineUsers.delete(userId);
      socket.broadcast.emit("user-offline", { userId });
    });
  });

  console.log("Socket.IO ready");
  return io;
};

export const getOnlineUsers = (): string[] => {
  return Array.from(onlineUsers.keys());
};
