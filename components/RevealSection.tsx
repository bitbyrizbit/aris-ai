"use client";

import { useRef } from "react";
import { motion, useTransform, useScroll, MotionValue } from "framer-motion";

type Point = { x: number; y: number };

const HOST: Point = { x: 50, y: 50 };
const A: Point = { x: 22, y: 26 };
const B: Point = { x: 78, y: 24 };
const C: Point = { x: 15, y: 68 };
const D: Point = { x: 83, y: 66 };
const E: Point = { x: 92, y: 84 };

function dist(p1: Point, p2: Point) {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

function RouteDots({
  from,
  to,
  range,
  scrollYProgress,
}: {
  from: Point;
  to: Point;
  range: [number, number];
  scrollYProgress: MotionValue<number>;
}) {
  const length = dist(from, to);
  const offset = useTransform(scrollYProgress, range, [length, 0]);
  return (
    <motion.line
      x1={from.x} y1={from.y} x2={to.x} y2={to.y}
      className="reveal-route"
      style={{ strokeDasharray: "0.9 1.6", strokeDashoffset: offset }}
      vectorEffect="non-scaling-stroke"
      strokeLinecap="round"
    />
  );
}

function Pin({
  point,
  code,
  range,
  scrollYProgress,
}: {
  point: Point;
  code: string;
  range: [number, number];
  scrollYProgress: MotionValue<number>;
}) {
  const opacity = useTransform(scrollYProgress, range, [0, 1]);
  const scale = useTransform(scrollYProgress, range, [0.5, 1]);

  return (
    <>
      <motion.div
        className="reveal-pin"
        style={{ left: `${point.x}%`, top: `${point.y}%`, opacity, scale }}
      >
        <svg viewBox="0 0 24 30" width="100%" height="100%">
          <path
            d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 18 12 18s12-9.6 12-18C24 5.4 18.6 0 12 0z"
            fill="currentColor"
          />
          <circle cx="12" cy="12" r="4.4" fill="var(--bg)" />
        </svg>
      </motion.div>
      <motion.span
        className="reveal-code"
        style={{ left: `${point.x}%`, top: `${point.y + 5}%`, opacity }}
      >
        {code}
      </motion.span>
    </>
  );
}

function HostNode({
  point,
  code,
  range,
  scrollYProgress,
}: {
  point: Point;
  code: string;
  range: [number, number];
  scrollYProgress: MotionValue<number>;
}) {
  const opacity = useTransform(scrollYProgress, range, [0, 1]);
  const scale = useTransform(scrollYProgress, range, [0.5, 1]);

  return (
    <>
      <motion.div
        className="reveal-host"
        style={{ left: `${point.x}%`, top: `${point.y}%`, opacity, scale }}
      />
      <motion.span
        className="reveal-code"
        style={{ left: `${point.x}%`, top: `${point.y + 4}%`, opacity }}
      >
        {code}
      </motion.span>
    </>
  );
}

export default function RevealSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const hostOpacity = useTransform(scrollYProgress, [0, 0.02], [0, 1]);

  const pinOpacityD = useTransform(
    scrollYProgress,
    [0.32, 0.46, 0.58, 0.64],
    [0, 1, 1, 0]
  );
  const hostOpacityD = useTransform(scrollYProgress, [0.58, 0.64], [0, 1]);

  const captionOpacity = useTransform(scrollYProgress, [0.86, 0.96], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.86, 0.96], [16, 0]);

  return (
    <section ref={ref} className="reveal-container">
      <div className="reveal-sticky">
        <div className="reveal-floor" />

        <div className="reveal-scene">
          <svg viewBox="0 0 100 100" className="reveal-svg" preserveAspectRatio="none">
            <RouteDots from={HOST} to={A} range={[0.08, 0.24]} scrollYProgress={scrollYProgress} />
            <RouteDots from={HOST} to={B} range={[0.08, 0.24]} scrollYProgress={scrollYProgress} />
            <RouteDots from={HOST} to={C} range={[0.32, 0.46]} scrollYProgress={scrollYProgress} />
            <RouteDots from={HOST} to={D} range={[0.32, 0.46]} scrollYProgress={scrollYProgress} />
            <RouteDots from={D} to={E} range={[0.68, 0.82]} scrollYProgress={scrollYProgress} />
          </svg>

          <motion.div
            className="reveal-host"
            style={{ left: `${HOST.x}%`, top: `${HOST.y}%`, opacity: hostOpacity }}
          />
          <motion.span
            className="reveal-code"
            style={{ left: `${HOST.x}%`, top: `${HOST.y + 4}%`, opacity: hostOpacity }}
          >
            ARIS-4821
          </motion.span>

          <Pin point={A} code="ARIS-7734" range={[0.08, 0.24]} scrollYProgress={scrollYProgress} />
          <Pin point={B} code="ARIS-1190" range={[0.08, 0.24]} scrollYProgress={scrollYProgress} />
          <Pin point={C} code="ARIS-2245" range={[0.32, 0.46]} scrollYProgress={scrollYProgress} />

          <motion.div
            className="reveal-pin"
            style={{ left: `${D.x}%`, top: `${D.y}%`, opacity: pinOpacityD }}
          >
            <svg viewBox="0 0 24 30" width="100%" height="100%">
              <path
                d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 18 12 18s12-9.6 12-18C24 5.4 18.6 0 12 0z"
                fill="currentColor"
              />
              <circle cx="12" cy="12" r="4.4" fill="var(--bg)" />
            </svg>
          </motion.div>
          <HostNode point={D} code="ARIS-5563" range={[0.58, 0.64]} scrollYProgress={scrollYProgress} />

          <Pin point={E} code="ARIS-3348" range={[0.7, 0.84]} scrollYProgress={scrollYProgress} />
        </div>

        <motion.p
          className="reveal-caption"
          style={{ opacity: captionOpacity, y: captionY }}
        >
          Any device that receives can carry the network forward.
        </motion.p>
      </div>
    </section>
  );
}