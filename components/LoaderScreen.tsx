"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const dots = [
  { x: -60, y: -40 },
  { x: 55, y: -50 },
  { x: -70, y: 35 },
  { x: 60, y: 40 },
  { x: 0, y: -72 },
];

export default function LoaderScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("aris-seen-loader");
    if (seen) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("aris-seen-loader", "1");
    }, 2300);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    sessionStorage.setItem("aris-seen-loader", "1");
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="loader-screen"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          onClick={dismiss}
        >
          <div className="loader-stage">
            {dots.map((d, i) => (
              <motion.span
                key={i}
                className="loader-dot"
                initial={{ x: d.x, y: d.y, opacity: 0, scale: 0.4 }}
                animate={{ x: 0, y: 0, opacity: [0, 1, 1, 0], scale: [0.4, 1, 1, 0.4] }}
                transition={{
                  duration: 1.5,
                  delay: 0.08 * i,
                  times: [0, 0.4, 0.75, 1],
                  ease: "easeInOut",
                }}
              />
            ))}
            <motion.h1
              className="loader-word"
              initial={{ opacity: 0, letterSpacing: "0.4em" }}
              animate={{ opacity: 1, letterSpacing: "-0.02em" }}
              transition={{ duration: 0.7, delay: 1.2, ease: "easeOut" }}
            >
              ARIS
            </motion.h1>
          </div>
          <motion.div
            className="loader-bar"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2.1, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}