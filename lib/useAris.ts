"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ArisNetwork, getLastJoinedRoom } from "@/lib/peer";

export type ArisStatus = "connecting" | "ready" | "error";

export function useAris(onData?: (peerId: string, data: unknown) => void) {
  const networkRef = useRef<ArisNetwork | null>(null);
  const [myId, setMyId] = useState("");
  const [peers, setPeers] = useState<string[]>([]);
  const [status, setStatus] = useState<ArisStatus>("connecting");
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [waitingApproval, setWaitingApproval] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState<string[]>([]);
  const [lastRoom, setLastRoom] = useState<string | null>(null);
  const onDataRef = useRef(onData);
  onDataRef.current = onData;

  useEffect(() => {
    setLastRoom(getLastJoinedRoom());

    const network = new ArisNetwork({
      onOpen: (id) => {
        setMyId(id);
        setStatus("ready");
      },
      onIncomingRequest: (peerId) => {
        setIncomingRequests((prev) => (prev.includes(peerId) ? prev : [...prev, peerId]));
      },
      onWaitingApproval: () => {
        setWaitingApproval(true);
        setJoinError("");
        setJoinSuccess(false);
      },
      onPeerConnect: (peerId) => {
        setWaitingApproval(false);
        setJoinError("");
        setJoinSuccess(true);
        setIncomingRequests((prev) => prev.filter((p) => p !== peerId));
        setPeers((prev) => (prev.includes(peerId) ? prev : [...prev, peerId]));
        setTimeout(() => setJoinSuccess(false), 2500);
      },
      onPeerDisconnect: (peerId) => {
        setPeers((prev) => prev.filter((p) => p !== peerId));
      },
      onError: (message) => {
        setWaitingApproval(false);
        setJoinError(message);
      },
      onData: (peerId, data) => onDataRef.current?.(peerId, data),
    });

    networkRef.current = network;
    return () => network.destroy();
  }, []);

  const join = useCallback((roomCode: string) => {
    setJoinError("");
    networkRef.current?.join(roomCode);
  }, []);

  const sendTo = useCallback((peerId: string, data: unknown) => {
    networkRef.current?.sendTo(peerId, data);
  }, []);

  const acceptRequest = useCallback((peerId: string) => {
    networkRef.current?.acceptIncoming(peerId);
  }, []);

  const declineRequest = useCallback((peerId: string) => {
    networkRef.current?.declineIncoming(peerId);
    setIncomingRequests((prev) => prev.filter((p) => p !== peerId));
  }, []);

  const reconnectToLastRoom = useCallback(() => {
    if (lastRoom) join(lastRoom);
  }, [lastRoom, join]);

  return {
    myId,
    peers,
    status,
    joinError,
    joinSuccess,
    waitingApproval,
    incomingRequests,
    lastRoom,
    join,
    sendTo,
    acceptRequest,
    declineRequest,
    reconnectToLastRoom,
  };
}