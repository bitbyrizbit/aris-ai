"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type Building = { x: number; y: number; delay: [number, number] };

const buildings: Building[] = [
  { x: 50, y: 55, delay: [0, 0.05] },
  { x: 22, y: 22, delay: [0.1, 0.22] },
  { x: 78, y: 26, delay: [0.28, 0.4] },
  { x: 12, y: 62, delay: [0.46, 0.58] },
  { x: 88, y: 66, delay: [0.64, 0.76] },
];

export default function RevealSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const captionOpacity = useTransform(scrollYProgress, [0.82, 0.92], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.82, 0.92], [16, 0]);
  const sceneRotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);

  return (
    <section ref={ref} className="reveal-container">
      <div className="reveal-sticky">
        <div className="reveal-floor" />

        <motion.div className="reveal-scene" style={{ rotate: sceneRotate }}>
          <svg viewBox="0 0 100 100" className="reveal-svg" preserveAspectRatio="none">
            {buildings.slice(1).map((b, i) => (
              <RevealLine key={i} scrollYProgress={scrollYProgress} to={b} />
            ))}
          </svg>

          {buildings.map((b, i) => (
            <RevealBuilding key={i} scrollYProgress={scrollYProgress} building={b} isSelf={i === 0} />
          ))}
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

function RevealLine({
  scrollYProgress,
  to,
}: {
  scrollYProgress: any;
  to: Building;
}) {
  const progress = useTransform(scrollYProgress, to.delay, [0, 1]);
  return (
    <motion.line
      x1="50" y1="55" x2={to.x} y2={to.y}
      className="reveal-line"
      style={{ pathLength: progress, vectorEffect: "non-scaling-stroke" }}
      strokeLinecap="round"
    />
  );
}

function RevealBuilding({
  scrollYProgress,
  building,
  isSelf,
}: {
  scrollYProgress: any;
  building: Building;
  isSelf: boolean;
}) {
  const opacity = useTransform(scrollYProgress, building.delay, [0, 1]);
  const y = useTransform(scrollYProgress, building.delay, [20, 0]);

  return (
    <motion.div
      className={`reveal-block ${isSelf ? "reveal-block-self" : ""}`}
      style={{ left: `${building.x}%`, top: `${building.y}%`, opacity, y }}
    >
      <span className="reveal-block-shadow" />
    </motion.div>
  );
}