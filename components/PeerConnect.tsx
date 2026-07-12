"use client";

import { useState } from "react";

export default function PeerConnect({
  myId,
  peers,
  status,
  joinError,
  onJoin,
}: {
  myId: string;
  peers: string[];
  status: "connecting" | "ready" | "error";
  joinError: string;
  onJoin: (code: string) => void;
}) {
  const [joinCode, setJoinCode] = useState("");
  const [copied, setCopied] = useState(false);

  function handleJoin() {
    if (!joinCode.trim()) return;
    onJoin(joinCode.trim());
    setJoinCode("");
  }

  function handleCopy() {
    if (!myId) return;
    navigator.clipboard.writeText(myId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="peer-panel">
      <div className="peer-row">
        <span className="peer-label">Your room code</span>
        <div className="peer-code-row">
          <code className="peer-code">
            {status === "ready" ? myId : status === "error" ? "connection failed" : "connecting…"}
          </code>
          {status === "ready" && (
            <button className="peer-copy" onClick={handleCopy}>
              {copied ? "copied" : "copy"}
            </button>
          )}
        </div>
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
        {joinError && <p className="peer-error">{joinError}</p>}
      </div>

      <p className="peer-count">
        {peers.length} device{peers.length === 1 ? "" : "s"} connected
      </p>
    </div>
  );
}