"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function RevealSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const node1Opacity = useTransform(scrollYProgress, [0, 0.06], [0, 1]);
  const node1Rise = useTransform(scrollYProgress, [0, 0.06], [14, 0]);

  const line1Progress = useTransform(scrollYProgress, [0.16, 0.34], [0, 1]);
  const node2Opacity = useTransform(scrollYProgress, [0.16, 0.34], [0, 1]);
  const node2Rise = useTransform(scrollYProgress, [0.16, 0.34], [14, 0]);

  const line2Progress = useTransform(scrollYProgress, [0.46, 0.64], [0, 1]);
  const node3Opacity = useTransform(scrollYProgress, [0.46, 0.64], [0, 1]);
  const node3Rise = useTransform(scrollYProgress, [0.46, 0.64], [14, 0]);

  const captionOpacity = useTransform(scrollYProgress, [0.8, 0.94], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.8, 0.94], [16, 0]);

  const floorShift = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section ref={ref} className="reveal-container">
      <div className="reveal-sticky">
        <motion.div className="reveal-floor" style={{ backgroundPositionY: floorShift }} />

        <div className="reveal-scene">
          <svg viewBox="0 0 100 100" className="reveal-svg" preserveAspectRatio="none">
            <motion.line
              x1="50" y1="50" x2="20" y2="20"
              className="reveal-line"
              style={{ pathLength: line1Progress, vectorEffect: "non-scaling-stroke" }}
              strokeLinecap="round"
            />
            <motion.line
              x1="50" y1="50" x2="80" y2="25"
              className="reveal-line"
              style={{ pathLength: line2Progress, vectorEffect: "non-scaling-stroke" }}
              strokeLinecap="round"
            />
          </svg>

          <motion.div
            className="reveal-node reveal-node-self"
            style={{ left: "50%", top: "50%", opacity: node1Opacity, y: node1Rise }}
          >
            <span className="reveal-node-shadow" />
          </motion.div>
          <motion.div
            className="reveal-node"
            style={{ left: "20%", top: "20%", opacity: node2Opacity, y: node2Rise }}
          >
            <span className="reveal-node-shadow" />
          </motion.div>
          <motion.div
            className="reveal-node"
            style={{ left: "80%", top: "25%", opacity: node3Opacity, y: node3Rise }}
          >
            <span className="reveal-node-shadow" />
          </motion.div>
        </div>

        <motion.p
          className="reveal-caption"
          style={{ opacity: captionOpacity, y: captionY }}
        >
          Watch it converge — keep scrolling.
        </motion.p>
      </div>
    </section>
  );
}