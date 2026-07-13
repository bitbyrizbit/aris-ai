"use client";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import QrScanner from "@/components/QrScanner";

export default function PeerConnect({
  myId,
  peers,
  status,
  joinError,
  joinSuccess,
  waitingApproval,
  incomingRequests,
  onJoin,
  onAccept,
  onDecline,
}: {
  myId: string;
  peers: string[];
  status: "connecting" | "ready" | "error";
  joinError: string;
  joinSuccess: boolean;
  waitingApproval: boolean;
  incomingRequests: string[];
  onJoin: (code: string) => void;
  onAccept: (peerId: string) => void;
  onDecline: (peerId: string) => void;
}) {
  const [joinCode, setJoinCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [scanning, setScanning] = useState(false);

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
            <>
              <button className="peer-copy" onClick={handleCopy}>
                {copied ? "copied" : "copy"}
              </button>
              <button className="peer-copy" onClick={() => setShowQr((v) => !v)}>
                {showQr ? "hide qr" : "show qr"}
              </button>
            </>
          )}
        </div>
        {showQr && status === "ready" && (
          <div className="peer-qr">
            <QRCodeSVG value={myId} size={128} bgColor="transparent" fgColor="#0E0E0E" />
          </div>
        )}
      </div>

      {incomingRequests.length > 0 && (
        <div className="peer-row">
          <span className="peer-label">Join requests</span>
          {incomingRequests.map((peerId) => (
            <div key={peerId} className="peer-request" style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '1rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
              <code style={{ color: '#fff', fontWeight: 'bold', letterSpacing: '0.05em' }}>{peerId}</code>
              <div className="peer-request-actions" style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="peer-accept" style={{ background: '#1f9c58', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }} onClick={() => onAccept(peerId)}>
                  Accept
                </button>
                <button className="peer-decline" style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }} onClick={() => onDecline(peerId)}>
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="peer-row">
        <span className="peer-label">Join a room</span>
        <div className="peer-join">
          <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            placeholder="ARIS-1234"
            suppressHydrationWarning
          />
          <button onClick={handleJoin} disabled={waitingApproval} suppressHydrationWarning>
            {waitingApproval ? "Waiting…" : "Connect"}
          </button>
          <button className="peer-scan-btn" onClick={() => setScanning(true)} disabled={waitingApproval}>
            Scan QR
          </button>
        </div>
        {waitingApproval && (
          <p className="peer-waiting">Waiting for the host to accept your request…</p>
        )}
        {joinError && <p className="peer-error">{joinError}</p>}
        {joinSuccess && <p className="peer-success">Connected.</p>}
      </div>

      {scanning && (
        <QrScanner
          onScan={(code) => {
            setScanning(false);
            onJoin(code);
          }}
          onClose={() => setScanning(false)}
        />
      )}

      <p className="peer-count">
        {peers.length} device{peers.length === 1 ? "" : "s"} connected
      </p>
    </div>
  );
}