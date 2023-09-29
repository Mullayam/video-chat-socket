import React, { createContext, useMemo } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketContextProvider = ({ children, ...props }) => {
  const socket = useMemo(() => io("http://localhost:5124"), []);
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
export const useSocket = () => {
  return React.useContext(SocketContext);
};
