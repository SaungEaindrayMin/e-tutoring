import { useEffect, useState, useCallback } from "react";
import SocketService from "../services/socket";

export const useSocket = (token, userId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    SocketService.init(token, import.meta.env.VITE_SOCKET_URL || "http://localhost:3000");

    const handleConnect = () => {
      setIsConnected(true);
      if (userId) {
        SocketService.joinUserRoom(userId);
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleReceiveMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    SocketService.on("connect", handleConnect);
    SocketService.on("disconnect", handleDisconnect);
    SocketService.onMessageReceived(handleReceiveMessage);

    return () => {
      SocketService.off("connect", handleConnect);
      SocketService.off("disconnect", handleDisconnect);
      SocketService.offMessageReceived();
    };
  }, [token, userId]);

  const sendMessage = useCallback((recipientId, messageText) => {
    if (SocketService.isConnected()) {
      SocketService.sendMessage(recipientId, messageText);
    }
  }, []);

  return {
    isConnected,
    messages,
    sendMessage,
  };
};
