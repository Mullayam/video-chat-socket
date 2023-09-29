import React, { useEffect } from "react";
import { useSocket } from "../context/Socket";
import { usePeer } from "../context/Peer";
import ReactPlayer from "react-player";
export default function Space() {
  const { socket } = useSocket();
  const [myStream, setMyStream] = React.useState(null);
  const [remoteUsername, setRemoteUsername] = React.useState(null);

  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteAns,
    sendStream,
    remoteStream,
  } = usePeer();
  const handleNewUserJoined = React.useCallback(
    async (username) => {
      console.log("new user ", username, " joined");
      const newOffer = await createOffer();
      socket.emit("call-user", { username, newOffer });
      setRemoteUsername(username);
    },
    [createOffer, socket]
  );
  const handleIncomingCall = React.useCallback(
    async (data) => {
      const { from, offer } = data;
      console.log("incoming call ", from);
      const ans = await createAnswer(offer);
      socket.emit("call-accepted", { username: from, ans });
      setRemoteUsername(from);
    },
    [createAnswer, socket]
  );
  const handleAceeptedCall = React.useCallback(
    async (data) => {
      const { ans } = data;
      await setRemoteAns(ans);
    },
    [createAnswer, socket]
  );
  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleAceeptedCall);
    return () => {
      socket.off("user-joined", handleNewUserJoined);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleAceeptedCall);
    };
  }, [handleAceeptedCall, handleIncomingCall, handleNewUserJoined, socket]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getUserMediaStream = async () => {
    const VideoStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    setMyStream(VideoStream);
  };
  const handleNegosiation = React.useCallback(async () => {
    const localOffer = peer.localDescription;
    socket.emit("call-user", { username: remoteUsername, localOffer });
  }, [peer.localDescription, remoteUsername, socket]);
  React.useEffect(() => {
    peer.addEventListener("negotiaţionneeded", handleNegosiation);

    return () => {
      peer.removeEventListener("negotiationneeded", handleNegosiation);
    };
  }, [peer]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  return (
    <div>
      <h1>Space</h1>
      {/* remoteUsername ur are conntected to */}
      <button onClick={() => sendStream(myStream)}>Enbale Camera</button>
      <ReactPlayer url={myStream} playing muted />
      {remoteStream && <ReactPlayer url={remoteStream} playing muted />}
    </div>
  );
}
