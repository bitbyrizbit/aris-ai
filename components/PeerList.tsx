"use client";

import { useState, useRef, useEffect } from "react";

export default function PeerList({
  peers,
  onDisconnect,
}: {
  peers: string[];
  onDisconnect: (peerId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (peers.length === 0) return null;

  return (
    <div className="peer-list-wrap" ref={ref}>
      <button className="peer-list-trigger" onClick={() => setOpen((v) => !v)}>
        {peers.length} device{peers.length === 1 ? "" : "s"} connected
      </button>
      {open && (
        <div className="peer-list-dropdown">
          {peers.map((peerId) => (
            <div key={peerId} className="peer-list-row">
              <code>{peerId}</code>
              <button
                className="peer-list-disconnect"
                onClick={() => {
                  onDisconnect(peerId);
                  if (peers.length === 1) setOpen(false);
                }}
              >
                Disconnect
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}