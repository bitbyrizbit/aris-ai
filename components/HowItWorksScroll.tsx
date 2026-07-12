"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Join",
    body: "Open Aris on any device. It finds the others directly — no account, no server relay for the actual work.",
  },
  {
    num: "02",
    title: "Split",
    body: "A task gets divided across every connected device, sized to how many are in the room.",
  },
  {
    num: "03",
    title: "Converge",
    body: "Each device runs inference locally, in parallel, and the results merge back into one answer.",
  },
];

export default function HowItWorksScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const idx = Math.min(steps.length - 1, Math.floor(v * steps.length));
      setActive(idx);
    });
  }, [scrollYProgress]);

  return (
    <section id="how" ref={ref} className="how-scroll-container">
      <div className="how-scroll-sticky">
        <span className="how-scroll-number">{steps[active].num}</span>
        <div className="how-scroll-text">
          <h3>{steps[active].title}</h3>
          <p className="body-copy">{steps[active].body}</p>
          <div className="how-scroll-dots">
            {steps.map((s, i) => (
              <span
                key={s.num}
                className={`how-dot ${i === active ? "how-dot-active" : ""}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}