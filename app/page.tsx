"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import ConstellationMap from "@/components/ConstellationMap";
import PeerConnect from "@/components/PeerConnect";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
} as const;

export default function Home() {
  const [peerCount, setPeerCount] = useState(0);
  const handlePeerCount = useCallback((count: number) => setPeerCount(count), []);

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <span className="nav-mark">Aris</span>
          <span className="nav-status">
            <span className="status-dot" />
            {peerCount} device{peerCount === 1 ? "" : "s"} online
          </span>
          <div className="nav-links">
            <a href="#how">How it works</a>
            <a
              href="https://github.com/bitbyrizbit/aris-ai"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      <main className="grid-shell">
        <motion.section
          className="hero section-fade"
          initial="hidden"
          animate="show"
          variants={fadeUp}
        >
          <h1>Aris</h1>
          <div className="hero-meta">
            <p className="hero-tag">On-device AI network</p>
            <p className="body-copy">
              Devices converge and run the model together. No cloud
              inference, no central server — the computation happens
              where you are.
            </p>
            <PeerConnect onPeerCountChange={handlePeerCount} />
          </div>
        </motion.section>

        <motion.section
          className="map-module section-fade"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <div className="map-index">
            <span className="num">01</span>
            <span className="map-label">Connection map</span>
            <p className="body-copy">
              Live status of every device currently joined to this
              session. Nothing shown here passes through a server.
            </p>
          </div>
          <div className="map-canvas-frame">
            <ConstellationMap peerCount={peerCount} />
          </div>
        </motion.section>

        <motion.section
          id="how"
          className="how-section section-fade"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <div className="how-heading">
            <span className="num">02</span>
            <span className="map-label">How it works</span>
          </div>
          <div className="how-grid">
            <div className="how-step">
              <span className="step-num">01</span>
              <h3>Join</h3>
              <p className="body-copy">
                Open Aris on any device on the same network. It finds
                the others directly — no account, no server relay for
                the actual work.
              </p>
            </div>
            <div className="how-step">
              <span className="step-num">02</span>
              <h3>Split</h3>
              <p className="body-copy">
                A task gets divided across every connected device,
                sized to how many are in the room.
              </p>
            </div>
            <div className="how-step">
              <span className="step-num">03</span>
              <h3>Converge</h3>
              <p className="body-copy">
                Each device runs inference locally, in parallel, and
                the results merge back into one answer.
              </p>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}