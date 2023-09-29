import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import { SocketContextProvider } from "./context/Socket";
import Space from "./pages/Space";
import PeerProvider from "./context/Peer";
export default function App() {
  return (
    <SocketContextProvider>
      <PeerProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/space/:spaceId" element={<Space />} />
        </Routes>
      </PeerProvider>
    </SocketContextProvider>
  );
}
