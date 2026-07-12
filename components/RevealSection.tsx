"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function RevealSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const node1Opacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);
  const node1Scale = useTransform(scrollYProgress, [0, 0.08], [0.5, 1]);

  // line and its target node now share the exact same scroll range,
  // so the line always finishes drawing at the same instant the node lands
  const line1Progress = useTransform(scrollYProgress, [0.14, 0.34], [0, 1]);
  const node2Opacity = useTransform(scrollYProgress, [0.14, 0.34], [0, 1]);
  const node2Scale = useTransform(scrollYProgress, [0.14, 0.34], [0.4, 1]);

  const line2Progress = useTransform(scrollYProgress, [0.44, 0.64], [0, 1]);
  const node3Opacity = useTransform(scrollYProgress, [0.44, 0.64], [0, 1]);
  const node3Scale = useTransform(scrollYProgress, [0.44, 0.64], [0.4, 1]);

  const captionOpacity = useTransform(scrollYProgress, [0.78, 0.92], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.78, 0.92], [16, 0]);

  return (
    <section ref={ref} className="reveal-container">
      <div className="reveal-sticky">
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
          style={{ left: "50%", top: "50%", opacity: node1Opacity, scale: node1Scale }}
        />
        <motion.div
          className="reveal-node"
          style={{ left: "20%", top: "20%", opacity: node2Opacity, scale: node2Scale }}
        />
        <motion.div
          className="reveal-node"
          style={{ left: "80%", top: "25%", opacity: node3Opacity, scale: node3Scale }}
        />

        <motion.p
          className="reveal-caption"
          style={{ opacity: captionOpacity, y: captionY }}
        >
          Every device that joins makes the network stronger.
        </motion.p>
      </div>
    </section>
  );
}