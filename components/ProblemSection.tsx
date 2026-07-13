"use client";

import { motion } from "framer-motion";

const lines = [
  "Every prompt leaves home before it's answered.",
  "Logged, filtered, priced by infrastructure you'll never see.",
  "What if the room itself was enough?",
];

export default function ProblemSection() {
  return (
    <section className="problem-section">
      {lines.map((line, i) => (
        <motion.p
          key={line}
          className="problem-line"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
        >
          {line}
        </motion.p>
      ))}
    </section>
  );
}