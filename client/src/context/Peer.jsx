import React, { createContext, useMemo } from "react";

const PeerContext = createContext(null);

export default function PeerProvider({ children }) {
  const [remoteStream, setRemoteStream] = React.useState(null);

  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      }),
    []
  );
  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };
  const createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };
  const setRemoteAns = async (answer) => {
    await peer.setLocalDescription(answer);
  };
  const sendStream = async (stream) => {
    const tracks = await stream.getTracks();
    for (const track of tracks) {
      peer.addTrack(track, stream);
    }
  };

  const handleTrackEven = React.useCallback((event) => {
    const streams = event.streams;
    setRemoteStream(streams[0]);
  }, []);

  React.useEffect(() => {
    peer.addEventListener("track", handleTrackEven);

    return () => {
      peer.removeEventListener("track", handleTrackEven);
    };
  }, [handleTrackEven, peer]);

  return (
    <PeerContext.Provider
      value={{
        peer,
        createOffer,
        createAnswer,
        setRemoteAns,
        sendStream,
        remoteStream,
      }}
    >
      {children}
    </PeerContext.Provider>
  );
}

export const usePeer = () => React.useContext(PeerContext);
