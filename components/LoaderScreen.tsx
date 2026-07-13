"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const letters = ["A", "R", "I", "S"];
const dotStarts = [
  { x: -90, y: -60 },
  { x: 100, y: -70 },
  { x: -110, y: 55 },
  { x: 95, y: 60 },
];
const dotTargets = [-54, -18, 18, 54];

export default function LoaderScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="loader-screen"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          onClick={() => setVisible(false)}
        >
          <div className="loader-stage">
            {dotStarts.map((d, i) => (
              <motion.span
                key={i}
                className="loader-dot"
                initial={{ x: d.x, y: d.y, opacity: 0 }}
                animate={{ x: dotTargets[i], y: 26, opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 1.5,
                  delay: 0.1 * i,
                  times: [0, 0.5, 0.8, 1],
                  ease: "easeInOut",
                }}
              />
            ))}
            <div className="loader-word">
              {letters.map((letter, i) => (
                <motion.span
                  key={letter}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.1, ease: "easeOut" }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </div>
          <motion.div
            className="loader-bar"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2.7, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}