"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "Does any of this touch a server?",
    a: "Only the handshake. A small relay helps two devices find each other, the same way a phone book helps two people find each other's number. Every summary, every model, every byte of your actual document stays on the devices in the room.",
  },
  {
    q: "Can a stranger join my session?",
    a: "No. Every join request needs to be accepted by the host device first. Sharing your room code or QR isn't enough on its own — you approve every device that connects.",
  },
  {
    q: "What happens if a device drops mid-task?",
    a: "Its chunk stays unfinished and is flagged, rather than silently vanishing. The rest of the network keeps working on their own portions.",
  },
  {
    q: "Why not just use one strong device?",
    a: "For a short document, you're right, it barely matters. The architecture is built for the case that actually needs it: long documents, heavy transcription, batches of files — where pooling a few idle devices beats waiting on one.",
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