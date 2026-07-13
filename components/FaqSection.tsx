"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "Where does the data actually go?",
    a: "Nowhere but the devices in the room. A small relay helps two machines find each other, the way a switchboard connects a call without listening in. Everything else — every summary, every fragment of your document — stays local.",
  },
  {
    q: "Who can get in?",
    a: "No one, unless you let them. Every device that requests to join waits for the host to approve it by hand. A code alone opens nothing.",
  },
  {
    q: "What if a device disappears mid-task?",
    a: "Its fragment is marked incomplete, not lost silently. The rest of the network finishes without it.",
  },
  {
    q: "Why not just run this on one good laptop?",
    a: "You can — for something short it barely matters. This exists for when it does: long documents, heavy transcription, batches of files, where a room of ordinary devices outruns one powerful one.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="faq-section">
      <div className="map-index">
        <span className="num">04</span>
        <span className="map-label">Questions</span>
      </div>
      <div className="faq-list">
        {faqs.map((item, i) => (
          <div key={item.q} className="faq-item">
            <button
              className="faq-question"
              onClick={() => setOpen(open === i ? null : i)}
            >
              {item.q}
              <span className={`faq-chevron ${open === i ? "faq-chevron-open" : ""}`}>
                ↓
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.p
                  className="faq-answer body-copy"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {item.a}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}