"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ArisNetwork } from "@/lib/peer";

export type ArisStatus = "connecting" | "ready" | "error";

export function useAris(onData?: (peerId: string, data: unknown) => void) {
  const networkRef = useRef<ArisNetwork | null>(null);
  const [myId, setMyId] = useState("");
  const [peers, setPeers] = useState<string[]>([]);
  const [status, setStatus] = useState<ArisStatus>("connecting");
  const [joinError, setJoinError] = useState("");
  const onDataRef = useRef(onData);
  onDataRef.current = onData;

  useEffect(() => {
    const network = new ArisNetwork({
      onOpen: (id) => {
        setMyId(id);
        setStatus("ready");
      },
      onPeerConnect: (peerId) => {
        setJoinError("");
        setPeers((prev) => (prev.includes(peerId) ? prev : [...prev, peerId]));
      },
      onPeerDisconnect: (peerId) => {
        setPeers((prev) => prev.filter((p) => p !== peerId));
      },
      onError: (message) => {
        setStatus("error");
        setJoinError(
          message.includes("Could not connect")
            ? "That room code isn't reachable — check it and try again."
            : "Connection issue — check your network and try again."
        );
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

  return { myId, peers, status, joinError, join, sendTo };
}