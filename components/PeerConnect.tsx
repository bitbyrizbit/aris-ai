"use client";

import { useEffect, useRef, useState } from "react";
import { ArisNetwork } from "@/lib/peer";

export default function PeerConnect({
  onPeerCountChange,
}: {
  onPeerCountChange?: (count: number) => void;
}) {
  const networkRef = useRef<ArisNetwork | null>(null);
  const [myId, setMyId] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [peers, setPeers] = useState<string[]>([]);
  const [status, setStatus] = useState<"connecting" | "ready" | "error">(
    "connecting"
  );

  useEffect(() => {
    const network = new ArisNetwork({
      onOpen: (id) => {
        setMyId(id);
        setStatus("ready");
      },
      onPeerConnect: (peerId) => {
        setPeers((prev) => (prev.includes(peerId) ? prev : [...prev, peerId]));
      },
      onPeerDisconnect: (peerId) => {
        setPeers((prev) => prev.filter((p) => p !== peerId));
      },
      onError: () => setStatus("error"),
    });

    networkRef.current = network;
    return () => network.destroy();
  }, []);

  useEffect(() => {
    onPeerCountChange?.(peers.length);
  }, [peers, onPeerCountChange]);

  function handleJoin() {
    if (!joinCode.trim() || !networkRef.current) return;
    networkRef.current.join(joinCode.trim());
    setJoinCode("");
  }

  return (
    <div className="peer-panel">
      <div className="peer-row">
        <span className="peer-label">Your room code</span>
        <code className="peer-code">
          {status === "ready" ? myId : status === "error" ? "connection failed" : "connecting…"}
        </code>
      </div>

      <div className="peer-row">
        <span className="peer-label">Join a room</span>
        <div className="peer-join">
          <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            placeholder="paste a room code"
          />
          <button onClick={handleJoin}>Connect</button>
        </div>
      </div>

      <p className="peer-count">
        {peers.length} device{peers.length === 1 ? "" : "s"} connected
      </p>
    </div>
  );
}