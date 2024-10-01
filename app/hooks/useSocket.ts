import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket>();

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io('http://localhost:8080');
    socketRef.current = socketInstance;

    // Set socket to state
    setSocket(socketInstance);

    // Listen for connection
    socketInstance.on("connect", () => {
      setConnected(true);
    });

    // Listen for disconnection
    socketInstance.on("disconnect", () => {
      setConnected(false);
    });

    // Clean up on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Custom emit method for socket
  const emit = (event: string, data: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  // Custom method to listen to events
  const on = (event: string, callback: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  return {
    socket,
    connected,
    emit,
    on,
  };
};

export default useSocket;
