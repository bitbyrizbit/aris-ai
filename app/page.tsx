"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import ConstellationMap from "@/components/ConstellationMap";
import PeerConnect from "@/components/PeerConnect";
import UploadPanel from "@/components/UploadPanel";
import ProblemSection from "@/components/ProblemSection";
import RevealSection from "@/components/RevealSection";
import HowItWorksScroll from "@/components/HowItWorksScroll";
import { useAris } from "@/lib/useAris";
import ScrollHint from "@/components/ScrollHint";
import FaqSection from "@/components/FaqSection";
import FeatureGrid from "@/components/FeatureGrid";
import StatementBreak from "@/components/StatementBreak";
import ClosingCta from "@/components/ClosingCta";
import PeerList from "@/components/PeerList";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
} as const;

export default function Home() {
  const [incoming, setIncoming] = useState<{ peerId: string; data: any } | null>(null);

  const handleData = useCallback((peerId: string, data: unknown) => {
    setIncoming({ peerId, data });
  }, []);

  const {
    myId,
    peers,
    status,
    joinError,
    joinSuccess,
    waitingApproval,
    incomingRequests,
    join,
    sendTo,
    disconnectPeer,
    acceptRequest,
    declineRequest,
  } = useAris(handleData);

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <span className="nav-mark">Aris</span>
          {peers.length > 0 ? (
            <PeerList peers={peers} onDisconnect={disconnectPeer} />
          ) : (
            <span className="nav-status">
              <span className="status-dot" />
              0 devices online
            </span>
          )}
          <div className="nav-links">
            <a href="#how">How it works</a>
            <a href="https://github.com/bitbyrizbit/aris-ai" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </nav>

      <main>
        <div className="grid-shell">
          <motion.section
            className="hero section-fade"
            initial="hidden"
            animate="show"
            variants={fadeUp}
          >
            <h1>Aris</h1>
            <div className="hero-meta">
              <p className="hero-tag">Intelligence, distributed</p>
              <p className="body-copy">
                No servers. No middlemen. Just the devices already in
                your hands, thinking as one.
              </p>
            </div>
            <ScrollHint />
          </motion.section>
        </div>

        <ProblemSection />
        <RevealSection />
        <FeatureGrid />

        <div className="grid-shell">
          <motion.section
            id="connect"
            className="map-module section-fade"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <div className="map-index">
              <span className="num">01</span>
              <span className="map-label">Connect</span>
              <p className="body-copy">
                Show a code, scan a screen. The room forms itself, 
                and no server ever sees who's in it.
              </p>
              <PeerConnect
                myId={myId}
                peers={peers}
                status={status}
                joinError={joinError}
                joinSuccess={joinSuccess}
                waitingApproval={waitingApproval}
                incomingRequests={incomingRequests}
                onJoin={join}
                onAccept={acceptRequest}
                onDecline={declineRequest}
              />
            </div>
            <div className="map-canvas-frame">
              <ConstellationMap peerCount={peers.length} />
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
              <span className="num">02</span>
              <span className="map-label">Run a task</span>
              <p className="body-copy">
                Feed it something long. Watch it fracture across the
                room and return whole.
              </p>
            </div>
            <UploadPanel myId={myId} peers={peers} sendTo={sendTo} incoming={incoming} />
          </motion.section>
        </div>

        <StatementBreak />
        <HowItWorksScroll />
        <ClosingCta />

        <div className="grid-shell">
          <FaqSection />
          <footer className="footer-section">
            <span className="nav-mark">Aris</span>
            <p className="body-copy">
              No cloud inference. No central server. Just devices,
              converging.
            </p>
            <a
              href="https://github.com/bitbyrizbit/aris-ai"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              View source on GitHub
            </a>
          </footer>
        </div>
      </main>
    </>
  );
}