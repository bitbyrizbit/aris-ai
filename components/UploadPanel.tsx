"use client";

import { useEffect, useRef, useState } from "react";
import { chunkText } from "@/lib/chunker";
import { useInferenceWorker } from "@/lib/useInferenceWorker";

type ChunkStatus = "pending" | "processing" | "done" | "error";

type DeviceResult = {
  deviceId: string;
  status: ChunkStatus;
  summary?: string;
};

export default function UploadPanel({
  peers,
  myId,
  sendTo,
  incoming,
}: {
  peers: string[];
  myId: string;
  sendTo: (peerId: string, data: unknown) => void;
  incoming: { peerId: string; data: any } | null;
}) {
  const { status: workerStatus, summarize } = useInferenceWorker();
  const [text, setText] = useState("");
  const [results, setResults] = useState<DeviceResult[]>([]);
  const [running, setRunning] = useState(false);
  const [incomingTask, setIncomingTask] = useState<
    { fromPeer: string; status: "processing" | "done" } | null
  >(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!incoming) return;
    const { peerId, data } = incoming;

    if (data?.type === "chunk") {
      setIncomingTask({ fromPeer: peerId, status: "processing" });
      if (workerStatus === "ready") {
        summarize(data.text).then((summary) => {
          sendTo(peerId, { type: "result", summary });
          setIncomingTask({ fromPeer: peerId, status: "done" });
        });
      }
    }

    if (data?.type === "result") {
      setResults((prev) =>
        prev.map((r) =>
          r.deviceId === peerId ? { ...r, status: "done", summary: data.summary } : r
        )
      );
    }
  }, [incoming, workerStatus, summarize, sendTo]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const content = await file.text();
    setText(content);
  }

  async function handleRun() {
    if (!text.trim() || workerStatus !== "ready") return;
    setRunning(true);

    const deviceIds = [myId, ...peers];
    const chunks = chunkText(text, deviceIds.length);

    setResults(
      deviceIds.map((id, i) => ({
        deviceId: id,
        status: chunks[i] ? "pending" : "done",
      }))
    );

    chunks.forEach((chunk, i) => {
      const deviceId = deviceIds[i];
      if (deviceId === myId) {
        setResults((prev) =>
          prev.map((r) => (r.deviceId === myId ? { ...r, status: "processing" } : r))
        );
        summarize(chunk)
          .then((summary) => {
            setResults((prev) =>
              prev.map((r) => (r.deviceId === myId ? { ...r, status: "done", summary } : r))
            );
          })
          .catch(() => {
            setResults((prev) =>
              prev.map((r) => (r.deviceId === myId ? { ...r, status: "error" } : r))
            );
          });
      } else {
        sendTo(deviceId, { type: "chunk", text: chunk });
        setResults((prev) =>
          prev.map((r) => (r.deviceId === deviceId ? { ...r, status: "processing" } : r))
        );
      }
    });
  }

  return (
    <div className="upload-panel">
      {incomingTask && (
        <div className={`incoming-banner incoming-${incomingTask.status}`}>
          {incomingTask.status === "processing"
            ? `Task received from ${incomingTask.fromPeer.slice(0, 9)} — processing your portion…`
            : `Done — your summary was sent back to ${incomingTask.fromPeer.slice(0, 9)}.`}
        </div>
      )}

      <div className="upload-row">
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.md"
          onChange={handleFile}
          className="upload-file-input"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="upload-file-label">
          Upload .txt file
        </label>
        <span className="upload-hint">
          {workerStatus === "loading" && "loading model…"}
          {workerStatus === "ready" && "model ready"}
          {workerStatus === "error" && "model failed to load"}
        </span>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="paste a long document here, or upload a .txt file above"
        className="upload-textarea"
      />

      <button
        className="upload-run"
        onClick={handleRun}
        disabled={!text.trim() || workerStatus !== "ready" || running}
      >
        {running ? "Running across devices…" : "Split and summarize"}
      </button>

      {results.length > 0 && (
        <div className="result-list">
          {results.map((r) => (
            <div key={r.deviceId} className="result-row">
              <span className="result-device">
                {r.deviceId === myId ? "this device" : r.deviceId.slice(0, 9)}
              </span>
              <span className={`result-status status-${r.status}`}>{r.status}</span>
              {r.summary && <p className="result-summary">{r.summary}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}