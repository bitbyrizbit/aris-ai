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
        { fps: 10, qrbox: { width: 250, height: 250 } },
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
      <style>{`
        .qr-scanner-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(11, 12, 14, 0.95);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qr-scanner-box {
          background: rgba(255, 255, 255, 0.02);
          padding: 2.5rem;
          border-radius: 8px;
          border: 1px solid rgba(76, 111, 255, 0.3);
          box-shadow: 0 0 50px rgba(76, 111, 255, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          position: relative;
        }

        .qr-scanner-frame {
          width: 280px;
          height: 280px;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          background: #000;
        }
        
        .qr-scanner-reticle {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 10;
        }
        
        .qr-scanner-reticle::before, .qr-scanner-reticle::after {
          content: ''; position: absolute; width: 30px; height: 30px; border: 3px solid var(--signal);
          box-shadow: 0 0 10px var(--signal);
        }
        .qr-scanner-reticle::before { top: 10px; left: 10px; border-right: none; border-bottom: none; }
        .qr-scanner-reticle::after { bottom: 10px; right: 10px; border-left: none; border-top: none; }
        
        .qr-scanner-reticle-inner::before, .qr-scanner-reticle-inner::after {
          content: ''; position: absolute; width: 30px; height: 30px; border: 3px solid var(--signal);
          box-shadow: 0 0 10px var(--signal);
        }
        .qr-scanner-reticle-inner::before { top: 10px; right: 10px; border-left: none; border-bottom: none; }
        .qr-scanner-reticle-inner::after { bottom: 10px; left: 10px; border-right: none; border-top: none; }

        .qr-scanline {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 2px;
          background: #fff;
          box-shadow: 0 0 20px 4px var(--signal);
          z-index: 11;
          animation: scan 2.5s ease-in-out infinite alternate;
        }

        @keyframes scan {
          0% { top: 10px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 270px; opacity: 0; }
        }

        .qr-scanner-close {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          padding: 0.75rem 1.5rem;
          border: 1px solid var(--signal);
          border-radius: 4px;
          background: transparent;
          color: var(--signal);
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: all 0.2s ease;
        }

        .qr-scanner-close:hover {
          background: var(--signal);
          color: #fff;
          box-shadow: 0 0 20px rgba(76, 111, 255, 0.4);
        }
      `}</style>

      <div className="qr-scanner-box">
        <div style={{ position: 'relative' }}>
          <div id={containerId} className="qr-scanner-frame" />
          <div className="qr-scanner-reticle">
            <div className="qr-scanner-reticle-inner" style={{ width: '100%', height: '100%', position: 'absolute' }} />
          </div>
          <div className="qr-scanline" />
        </div>
        
        <button className="qr-scanner-close" onClick={onClose}>
          Abort Scan
        </button>
      </div>
    </div>
  );
}