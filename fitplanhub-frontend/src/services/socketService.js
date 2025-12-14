// ============================================
// src/services/socketService.js - Real-time Socket
// ============================================

import io from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5001";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        auth: { token },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      this.socket.on("connect", () => {
        console.log("Socket connected");
      });

      this.socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Send message
  sendMessage(data) {
    if (this.socket) {
      this.socket.emit("send-message", data);
    }
  }

  // Listen for messages
  onMessage(callback) {
    if (this.socket) {
      this.socket.on("receive-message", callback);
    }
  }

  // Typing indicators
  startTyping(receiverId) {
    if (this.socket) {
      this.socket.emit("typing", { receiverId });
    }
  }

  stopTyping(receiverId) {
    if (this.socket) {
      this.socket.emit("stop-typing", { receiverId });
    }
  }

  onTyping(callback) {
    if (this.socket) {
      this.socket.on("user-typing", callback);
    }
  }

  // Mark as read
  markAsRead(messageId) {
    if (this.socket) {
      this.socket.emit("mark-as-read", { messageId });
    }
  }

  onMessageRead(callback) {
    if (this.socket) {
      this.socket.on("message-read", callback);
    }
  }

  // Online/offline status
  onUserOnline(callback) {
    if (this.socket) {
      this.socket.on("user-online", callback);
    }
  }

  onUserOffline(callback) {
    if (this.socket) {
      this.socket.on("user-offline", callback);
    }
  }

  // Remove listeners
  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export const socketService = new SocketService();
