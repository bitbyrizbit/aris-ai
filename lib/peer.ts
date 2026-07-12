import Peer, { DataConnection } from "peerjs";

export type PeerEventHandlers = {
  onOpen?: (id: string) => void;
  onPeerConnect?: (peerId: string) => void;
  onPeerDisconnect?: (peerId: string) => void;
  onError?: (message: string) => void;
  onData?: (peerId: string, data: unknown) => void;
};

export class ArisNetwork {
  peer: Peer;
  connections: Map<string, DataConnection> = new Map();
  private handlers: PeerEventHandlers;

  constructor(handlers: PeerEventHandlers = {}) {
    this.handlers = handlers;

    this.peer = new Peer({
      host: process.env.NEXT_PUBLIC_PEER_HOST,
      port: Number(process.env.NEXT_PUBLIC_PEER_PORT || 443),
      path: process.env.NEXT_PUBLIC_PEER_PATH || "/aris",
      secure: process.env.NEXT_PUBLIC_PEER_SECURE !== "false",
    });

    this.peer.on("open", (id) => this.handlers.onOpen?.(id));
    this.peer.on("connection", (conn) => this.registerConnection(conn));
    this.peer.on("error", (err) => this.handlers.onError?.(err.message));
  }

  private registerConnection(conn: DataConnection) {
    conn.on("open", () => {
      this.connections.set(conn.peer, conn);
      this.handlers.onPeerConnect?.(conn.peer);
    });

    conn.on("data", (data) => {
      this.handlers.onData?.(conn.peer, data);
    });

    conn.on("close", () => {
      this.connections.delete(conn.peer);
      this.handlers.onPeerDisconnect?.(conn.peer);
    });

    conn.on("error", () => {
      this.connections.delete(conn.peer);
      this.handlers.onPeerDisconnect?.(conn.peer);
    });
  }

  join(roomCode: string) {
    const conn = this.peer.connect(roomCode, { reliable: true });
    this.registerConnection(conn);
  }

  broadcast(data: unknown) {
    this.connections.forEach((conn) => conn.send(data));
  }
  sendTo(peerId: string, data: unknown) {
    const conn = this.connections.get(peerId);
    conn?.send(data);
  }

  get id() {
    return this.peer.id;
  }

  destroy() {
    this.peer.destroy();
  }
}