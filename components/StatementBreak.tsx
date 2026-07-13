"use client";

import { motion } from "framer-motion";

export default function StatementBreak() {
  return (
    <section className="statement-section">
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Built for a network that doesn't need permission from anyone but you.
      </motion.p>
    </section>
  );
}