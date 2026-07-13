"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function RevealSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const node1Opacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const node1Height = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  const line1Progress = useTransform(scrollYProgress, [0.12, 0.28], [0, 1]);
  const node2Opacity = useTransform(scrollYProgress, [0.12, 0.28], [0, 1]);
  const node2Height = useTransform(scrollYProgress, [0.12, 0.28], [0, 1]);

  const line2Progress = useTransform(scrollYProgress, [0.36, 0.52], [0, 1]);
  const node3Opacity = useTransform(scrollYProgress, [0.36, 0.52], [0, 1]);
  const node3Height = useTransform(scrollYProgress, [0.36, 0.52], [0, 1]);

  const captionOpacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.6, 0.7], [16, 0]);

  const floorShift = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const sceneRotateY = useTransform(scrollYProgress, [0, 1], [-10, 10]);
  const sceneScale = useTransform(scrollYProgress, [0, 0.1], [1.06, 1]);

  return (
    <section ref={ref} className="reveal-container">
      <div className="reveal-sticky">
        <motion.div className="reveal-floor" style={{ backgroundPositionY: floorShift }} />

        <motion.div
          className="reveal-scene"
          style={{ rotateY: sceneRotateY, scale: sceneScale }}
        >
          <svg viewBox="0 0 100 100" className="reveal-svg" preserveAspectRatio="none">
            <motion.line
              x1="50" y1="52" x2="20" y2="20"
              className="reveal-line"
              style={{ pathLength: line1Progress, vectorEffect: "non-scaling-stroke" }}
              strokeLinecap="round"
            />
            <motion.line
              x1="50" y1="52" x2="80" y2="25"
              className="reveal-line"
              style={{ pathLength: line2Progress, vectorEffect: "non-scaling-stroke" }}
              strokeLinecap="round"
            />
          </svg>

          <motion.div
            className="reveal-block reveal-block-self"
            style={{ left: "50%", top: "52%", opacity: node1Opacity, scaleY: node1Height }}
          >
            <span className="reveal-block-shadow" />
          </motion.div>
          <motion.div
            className="reveal-block"
            style={{ left: "20%", top: "20%", opacity: node2Opacity, scaleY: node2Height }}
          >
            <span className="reveal-block-shadow" />
          </motion.div>
          <motion.div
            className="reveal-block"
            style={{ left: "80%", top: "25%", opacity: node3Opacity, scaleY: node3Height }}
          >
            <span className="reveal-block-shadow" />
          </motion.div>
        </motion.div>

        <motion.p
          className="reveal-caption"
          style={{ opacity: captionOpacity, y: captionY }}
        >
          Every device that joins becomes part of the structure.
        </motion.p>
      </div>
    </section>
  );
}