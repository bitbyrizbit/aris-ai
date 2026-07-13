"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Join",
    body: "Open Aris anywhere. It finds its own kind. No accounts, no relay standing between you and the room.",
  },
  {
    num: "02",
    title: "Split",
    body: "The work divides itself the instant a second device arrives. Every machine carries exactly its share.",
  },
  {
    num: "03",
    title: "Converge",
    body: "Each fragment resolves where it stands. What comes back is whole, assembled rather than stitched.",
  },
];

function IsoBlock({ color }: { color: string }) {
  return (
    <div className="iso-abstract-block" style={{ borderColor: color, boxShadow: `0 0 20px ${color}40, inset 0 0 10px ${color}20` }}>
      <div className="iso-face-bottom" style={{ borderColor: color, background: `${color}10` }} />
      <div className="iso-face-right" style={{ borderColor: color, background: `${color}15` }} />
      <div className="iso-core" style={{ background: color, boxShadow: `0 0 15px ${color}` }} />
    </div>
  );
}

function ScrollVisual({ active }: { active: number }) {
  return (
    <div className="scroll-visual-wrapper">
      <style>{`
        .scroll-visual-wrapper {
          position: relative;
          width: 500px;
          height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 2000px;
        }

        .scroll-scene {
          position: relative;
          width: 100%;
          height: 100%;
          transform: rotateX(55deg) rotateZ(-45deg);
          transform-style: preserve-3d;
        }

        .iso-abstract-block {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transform-style: preserve-3d;
          backdrop-filter: blur(4px);
        }

        .iso-face-bottom {
          position: absolute;
          width: 100%;
          height: 30px;
          top: 100%; left: 0;
          transform-origin: top;
          transform: rotateX(-90deg);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-top: none;
        }

        .iso-face-right {
          position: absolute;
          width: 30px;
          height: 100%;
          top: 0; left: 100%;
          transform-origin: left;
          transform: rotateY(90deg);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-left: none;
        }
        
        .iso-core {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 8px; height: 8px;
          border-radius: 50%;
        }

        .connection-beam {
          position: absolute;
          height: 2px;
          background: var(--signal);
          top: 50%; left: 50%;
          transform-origin: left center;
          box-shadow: 0 0 10px var(--signal);
          z-index: -1;
        }
      `}</style>

      <div className="scroll-scene">
        {/* Core Node */}
        <motion.div
          animate={{
            scale: active === 2 ? 1.5 : 1,
            z: active === 2 ? 60 : 20,
          }}
          transition={{ duration: 0.8, ease: "anticipate" }}
          style={{ position: 'absolute', width: '80px', height: '80px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', transformStyle: 'preserve-3d' }}
        >
          <IsoBlock color={active === 2 ? '#ffffff' : '#4C6FFF'} />
        </motion.div>

        {/* Peer Node 1 */}
        <motion.div
          animate={{
            x: active === 0 ? '-100px' : active === 1 ? '-160px' : '0px',
            y: active === 0 ? '0px' : active === 1 ? '-60px' : '0px',
            scale: active === 2 ? 0 : 1,
            opacity: active === 2 ? 0 : 1,
            z: 20
          }}
          transition={{ duration: 0.8, ease: "anticipate" }}
          style={{ position: 'absolute', width: '60px', height: '60px', top: '50%', left: '50%', marginTop: '-30px', marginLeft: '-30px', transformStyle: 'preserve-3d' }}
        >
          <IsoBlock color="#FF6B45" />
        </motion.div>

        {/* Peer Node 2 */}
        <motion.div
          animate={{
            x: active === 0 ? '100px' : active === 1 ? '60px' : '0px',
            y: active === 0 ? '0px' : active === 1 ? '160px' : '0px',
            scale: active === 2 ? 0 : 1,
            opacity: active === 2 ? 0 : 1,
            z: 20
          }}
          transition={{ duration: 0.8, ease: "anticipate" }}
          style={{ position: 'absolute', width: '60px', height: '60px', top: '50%', left: '50%', marginTop: '-30px', marginLeft: '-30px', transformStyle: 'preserve-3d' }}
        >
          <IsoBlock color="#4C6FFF" />
        </motion.div>
        
        {/* Connection Beams (visible only in step 0, disappear in step 1, re-appear step 2 before combining) */}
        <motion.div
          animate={{
             opacity: active === 0 ? 1 : 0,
             width: active === 0 ? '100px' : '160px',
             rotateZ: 180
          }}
          style={{ position: 'absolute', top: '50%', left: '50%', height: '2px', background: 'var(--signal)', transformOrigin: 'left center' }}
        />
        <motion.div
          animate={{
             opacity: active === 0 ? 1 : 0,
             width: active === 0 ? '100px' : '160px',
             rotateZ: 0
          }}
          style={{ position: 'absolute', top: '50%', left: '50%', height: '2px', background: 'var(--signal)', transformOrigin: 'left center' }}
        />

      </div>
    </div>
  );
}

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
      <div className="how-scroll-sticky" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '4rem', padding: '0 4rem', maxWidth: '1400px', margin: '0 auto' }}>
        
        <div style={{ paddingLeft: '2rem' }}>
          <span className="how-scroll-number">{steps[active].num}</span>
          <div className="how-scroll-text" style={{ marginTop: '2rem' }}>
            <motion.h3
              key={`title-${active}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {steps[active].title}
            </motion.h3>
            <motion.p
              key={`body-${active}`}
              className="body-copy"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {steps[active].body}
            </motion.p>
            <div className="how-scroll-dots" style={{ marginTop: '3rem' }}>
              {steps.map((s, i) => (
                <span
                  key={s.num}
                  className={`how-dot ${i === active ? "how-dot-active" : ""}`}
                  style={{ 
                    width: i === active ? '24px' : '8px', 
                    borderRadius: '4px',
                    background: i === active ? 'var(--signal)' : 'var(--line)',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <ScrollVisual active={active} />
        
      </div>
    </section>
  );
}