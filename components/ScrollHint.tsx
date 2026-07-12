"use client";

import { motion } from "framer-motion";

export default function ScrollHint() {
  return (
    <motion.div
      className="scroll-hint"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.8 }}
    >
      <span>scroll to see it converge</span>
      <motion.div
        className="scroll-hint-line"
        animate={{ scaleY: [0, 1, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}