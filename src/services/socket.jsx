import io from "socket.io-client";
import Resources from "./resources";

class SocketService {
  constructor() {
    this.resources = new Resources();
    this.socket = null;
    this.listeners = {};
  }

  init(token, url = this.resources.BACKEND_SIDE_SOCKET_URL || "http://localhost:3000") {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    this.socket = io(url, {
      auth: {
        token: token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.setupDefaultListeners();

    return this.socket;
  }

  setupDefaultListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket.id);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.socket && this.socket.connected;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners = {};
    }
  }

  joinUserRoom() {
    if (this.socket) {
      this.socket.emit("join");
    }
  }

  sendMessage(recipientId, message) {
    if (this.socket) {
      this.socket.emit("send_message", {
        recipientId,
        message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  onMessageReceived(callback) {
    if (this.socket) {
      if (!this.listeners.onMessage) {
        this.listeners.onMessage = callback;
      }
      this.socket.on("new_message", callback);
    }
  }

  offMessageReceived() {
    if (this.socket && this.listeners.onMessage) {
      this.socket.off("new_message", this.listeners.onMessage);
      delete this.listeners.onMessage;
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

export default new SocketService();
