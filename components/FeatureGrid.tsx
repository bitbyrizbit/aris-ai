"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Zero cloud inference",
    body: "The model runs in your browser. Your document never leaves the device it was opened on.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none">
        <path d="M10 24a7 7 0 0 1 1-14 9 9 0 0 1 17 3 6 6 0 0 1-1 11H10Z" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 8 32 32" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    title: "Host-approved connections",
    body: "Every device that joins needs to be accepted first. A room code alone isn't enough.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none">
        <path d="M20 6 32 11v9c0 8-5 13-12 15-7-2-12-7-12-15v-9l12-5Z" stroke="currentColor" strokeWidth="1.4" />
        <path d="M14 20l4 4 8-8" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    title: "Runs in any browser",
    body: "No install, no account. Open a link on any laptop or phone and it's part of the network.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none">
        <rect x="6" y="9" width="28" height="22" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M6 15h28" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    title: "Fully open source",
    body: "MIT licensed. Read every line, run your own relay, fork the network.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none">
        <circle cx="12" cy="10" r="4" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="12" cy="30" r="4" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="28" cy="20" r="4" stroke="currentColor" strokeWidth="1.4" />
        <path d="M12 14v12M15 10h9a4 4 0 0 1 4 4M15 30h9a4 4 0 0 0 4-4" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
];

export default function FeatureGrid() {
  return (
    <section className="feature-section">
      <div className="feature-grid">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="feature-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
          >
            <div className="feature-icon">{f.icon}</div>
            <h4>{f.title}</h4>
            <p className="body-copy">{f.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}