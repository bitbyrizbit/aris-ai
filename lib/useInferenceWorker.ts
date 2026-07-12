"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type PendingResolve = { resolve: (summary: string) => void; reject: (err: Error) => void };

export function useInferenceWorker() {
  const workerRef = useRef<Worker | null>(null);
  const pending = useRef<Map<string, PendingResolve>>(new Map());
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    const worker = new Worker(new URL("./inference.worker.ts", import.meta.url));
    workerRef.current = worker;
    setStatus("loading");

    worker.onmessage = (event: MessageEvent) => {
      const { type, id, summary, message } = event.data;

      if (type === "ready") setStatus("ready");

      if (type === "result" && id) {
        pending.current.get(id)?.resolve(summary);
        pending.current.delete(id);
      }

      if (type === "error") {
        if (id && pending.current.has(id)) {
          pending.current.get(id)?.reject(new Error(message));
          pending.current.delete(id);
        } else {
          setStatus("error");
        }
      }
    };

    worker.postMessage({ type: "load" });
    return () => worker.terminate();
  }, []);

  const summarize = useCallback((text: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const worker = workerRef.current;
      if (!worker) return reject(new Error("Worker not ready"));
      const id = crypto.randomUUID();
      pending.current.set(id, { resolve, reject });
      worker.postMessage({ type: "summarize", id, text });
    });
  }, []);

  return { status, summarize };
}