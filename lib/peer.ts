import Peer, { DataConnection } from "peerjs";

export type PeerEventHandlers = {
  onOpen?: (id: string) => void;
  onIncomingRequest?: (peerId: string) => void;
  onWaitingApproval?: (peerId: string) => void;
  onPeerConnect?: (peerId: string) => void;
  onPeerDisconnect?: (peerId: string) => void;
  onError?: (message: string) => void;
  onData?: (peerId: string, data: unknown) => void;
};

const STORAGE_KEY = "aris-my-room-code";

function generateRoomCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `ARIS-${num}`;
}

export class ArisNetwork {
  peer!: Peer;
  connections: Map<string, DataConnection> = new Map();
  private pendingIncoming: Map<string, DataConnection> = new Map();
  private handlers: PeerEventHandlers;

  constructor(handlers: PeerEventHandlers = {}) {
    this.handlers = handlers;
    const remembered = sessionStorage.getItem(STORAGE_KEY);
    this.initPeer(remembered || generateRoomCode());
  }

  private initPeer(id: string) {
    this.peer = new Peer(id, {
      host: process.env.NEXT_PUBLIC_PEER_HOST,
      port: Number(process.env.NEXT_PUBLIC_PEER_PORT || 443),
      path: process.env.NEXT_PUBLIC_PEER_PATH || "/aris",
      secure: process.env.NEXT_PUBLIC_PEER_SECURE !== "false",
    });

    this.peer.on("open", (openId) => {
      sessionStorage.setItem(STORAGE_KEY, openId);
      this.handlers.onOpen?.(openId);
    });

    this.peer.on("connection", (conn) => {
      this.pendingIncoming.set(conn.peer, conn);
      this.handlers.onIncomingRequest?.(conn.peer);

      conn.on("data", (data: any) => {
        if (data?.type === "__handshake_accept") return;
        this.handlers.onData?.(conn.peer, data);
      });

      conn.on("close", () => {
        this.pendingIncoming.delete(conn.peer);
        this.connections.delete(conn.peer);
        this.handlers.onPeerDisconnect?.(conn.peer);
      });
    });

    this.peer.on("error", (err: any) => {
      if (err.type === "unavailable-id") {
        sessionStorage.removeItem(STORAGE_KEY);
        this.initPeer(generateRoomCode());
        return;
      }
      this.handlers.onError?.(err.message || "Connection error");
    });
  }

  acceptIncoming(peerId: string) {
    const conn = this.pendingIncoming.get(peerId);
    if (!conn) return;
    this.pendingIncoming.delete(peerId);
    this.connections.set(peerId, conn);
    conn.send({ type: "__handshake_accept" });
    this.handlers.onPeerConnect?.(peerId);
  }

  declineIncoming(peerId: string) {
    const conn = this.pendingIncoming.get(peerId);
    if (!conn) return;
    conn.close();
    this.pendingIncoming.delete(peerId);
  }

  join(roomCode: string) {
    const code = roomCode.trim();
    if (!code) return;

    sessionStorage.setItem("aris-last-joined", code);

    const conn = this.peer.connect(code, { reliable: true });
    this.handlers.onWaitingApproval?.(conn.peer);

    const failTimeout = setTimeout(() => {
      if (!this.connections.has(conn.peer)) {
        this.handlers.onError?.("No response from that room code. Check it and try again.");
      }
    }, 12000);

    conn.on("data", (data: any) => {
      if (data?.type === "__handshake_accept") {
        clearTimeout(failTimeout);
        this.connections.set(conn.peer, conn);
        this.handlers.onPeerConnect?.(conn.peer);
        return;
      }
      this.handlers.onData?.(conn.peer, data);
    });

    conn.on("close", () => {
      clearTimeout(failTimeout);
      this.connections.delete(conn.peer);
      this.handlers.onPeerDisconnect?.(conn.peer);
    });

    conn.on("error", () => {
      clearTimeout(failTimeout);
      this.handlers.onError?.("That room code isn't reachable. Check it and try again.");
    });
  }

  broadcast(data: unknown) {
    this.connections.forEach((conn) => conn.send(data));
  }

  sendTo(peerId: string, data: unknown) {
    this.connections.get(peerId)?.send(data);
  }
  
  disconnect(peerId: string) {
    const conn = this.connections.get(peerId);
    if (!conn) return;
    conn.close();
    this.connections.delete(peerId);
    this.handlers.onPeerDisconnect?.(peerId);
  }

  get id() {
    return this.peer.id;
  }

  destroy() {
    this.peer.destroy();
  }
}

export function getLastJoinedRoom(): string | null {
  return sessionStorage.getItem("aris-last-joined");
}