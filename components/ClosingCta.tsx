"use client";

import { motion } from "framer-motion";

export default function ClosingCta() {
  function scrollToConnect() {
    document.getElementById("connect")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="cta-section">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        Bring a second device.
        <br />
        Watch it think as one.
      </motion.h2>
      <motion.button
        className="cta-button"
        onClick={scrollToConnect}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Begin
      </motion.button>
    </section>
  );
}