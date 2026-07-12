"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QrScanner({
  onScan,
  onClose,
}: {
  onScan: (code: string) => void;
  onClose: () => void;
}) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const startedRef = useRef(false);
  const containerId = "aris-qr-reader";

  useEffect(() => {
    const scanner = new Html5Qrcode(containerId);
    scannerRef.current = scanner;
    let cancelled = false;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          if (cancelled) return;
          cancelled = true;
          onScan(decodedText.trim());
          safeStop();
        },
        () => {}
      )
      .then(() => {
        startedRef.current = true;
      })
      .catch(() => {
        onClose();
      });

    function safeStop() {
      const scannerInstance = scannerRef.current;
      if (!scannerInstance || !startedRef.current) return;
      startedRef.current = false;
      scannerInstance.stop().catch(() => {});
    }

    return () => {
      cancelled = true;
      safeStop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="qr-scanner-overlay">
      <div className="qr-scanner-box">
        <div id={containerId} className="qr-scanner-frame" />
        <button className="qr-scanner-close" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}