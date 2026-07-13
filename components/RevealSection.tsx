"use client";

import { useState } from "react";

type Point = { id: string; x: number; y: number; code: string; type: 'host' | 'peer' };

const NODES: Point[] = [
  { id: 'host', x: 50, y: 50, code: "ARIS-4821 (YOU)", type: 'host' },
  { id: 'p1', x: 22, y: 26, code: "ARIS-7734", type: 'peer' },
  { id: 'p2', x: 78, y: 24, code: "ARIS-1190", type: 'peer' },
  { id: 'p3', x: 15, y: 68, code: "ARIS-2245", type: 'peer' },
  { id: 'p4', x: 83, y: 66, code: "ARIS-5563", type: 'peer' },
  { id: 'p5', x: 92, y: 84, code: "ARIS-3348", type: 'peer' },
  { id: 'p6', x: 35, y: 85, code: "ARIS-9912", type: 'peer' },
];

export default function RevealSection() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <section className="reveal-wrapper">
      <style>{`
        .reveal-wrapper {
          position: relative;
          min-height: 120vh;
          width: 100%;
          background: #0B0C0E;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: var(--font-body, sans-serif);
          border-top: 1px solid var(--line);
        }

        .reveal-bg-glow {
          position: absolute;
          width: 80vw;
          height: 80vw;
          background: radial-gradient(circle, rgba(76, 111, 255, 0.05) 0%, transparent 60%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .iso-scene {
          position: relative;
          width: 800px;
          height: 800px;
          transform: rotateX(55deg) rotateZ(-45deg);
          transform-style: preserve-3d;
          perspective: 2500px;
        }

        .iso-grid {
          position: absolute;
          inset: -50%;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: center;
          transform: translateZ(0);
          mask-image: radial-gradient(circle, black 30%, transparent 70%);
          -webkit-mask-image: radial-gradient(circle, black 30%, transparent 70%);
        }

        .svg-lines {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          transform: translateZ(1px);
          overflow: visible;
          pointer-events: none;
        }

        .connection-line {
          stroke: rgba(255, 255, 255, 0.1);
          stroke-width: 2px;
          fill: none;
          stroke-dasharray: 6 6;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .connection-line.active {
          stroke: #FF6B45;
          stroke-width: 3px;
          filter: drop-shadow(0 0 6px rgba(255, 107, 69, 0.8)) drop-shadow(0 0 12px rgba(255, 107, 69, 0.5));
          stroke-dasharray: 12 12;
          animation: dashFlow 1s linear infinite;
        }

        .connection-line.active-host {
          stroke: #4C6FFF;
          stroke-width: 3px;
          filter: drop-shadow(0 0 6px rgba(76, 111, 255, 0.8)) drop-shadow(0 0 12px rgba(76, 111, 255, 0.5));
          animation: dashFlow 1s linear infinite reverse;
        }

        @keyframes dashFlow {
          to { stroke-dashoffset: -24; }
        }

        .node-hitbox {
          position: absolute;
          width: 80px;
          height: 80px;
          transform: translate(-50%, -50%);
          cursor: pointer;
          transform-style: preserve-3d;
          z-index: 10;
        }

        .node-container {
          position: absolute;
          transform-style: preserve-3d;
          width: 40px;
          height: 40px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .node-container.host {
          width: 60px;
          height: 60px;
        }

        .iso-block {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.15);
          transform-style: preserve-3d;
          transform: translateZ(20px);
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          backdrop-filter: blur(8px);
        }

        .iso-block::before, .iso-block::after {
          content: '';
          position: absolute;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        /* Front face */
        .iso-block::before {
          width: 100%;
          height: 20px;
          top: 100%; left: 0;
          transform-origin: top;
          transform: rotateX(-90deg);
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-top: none;
        }

        /* Right face */
        .iso-block::after {
          width: 20px;
          height: 100%;
          top: 0; left: 100%;
          transform-origin: left;
          transform: rotateY(90deg);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-left: none;
        }

        .node-container.host .iso-block {
          background: rgba(76, 111, 255, 0.1);
          border-color: rgba(76, 111, 255, 0.3);
          transform: translateZ(30px);
        }
        .node-container.host .iso-block::before {
          height: 30px;
          background: rgba(76, 111, 255, 0.05);
          border-color: rgba(76, 111, 255, 0.2);
        }
        .node-container.host .iso-block::after {
          width: 30px;
          background: rgba(76, 111, 255, 0.08);
          border-color: rgba(76, 111, 255, 0.25);
        }

        /* Hover States */
        .node-container:hover .iso-block, .node-container.active .iso-block {
          transform: translateZ(50px);
          background: rgba(255, 107, 69, 0.15);
          border-color: rgba(255, 107, 69, 0.6);
          box-shadow: 0 0 20px rgba(255, 107, 69, 0.3), inset 0 0 20px rgba(255, 107, 69, 0.2);
        }
        .node-container:hover .iso-block::before, .node-container.active .iso-block::before {
          height: 50px;
          background: rgba(255, 107, 69, 0.08);
          border-color: rgba(255, 107, 69, 0.3);
        }
        .node-container:hover .iso-block::after, .node-container.active .iso-block::after {
          width: 50px;
          background: rgba(255, 107, 69, 0.12);
          border-color: rgba(255, 107, 69, 0.4);
        }

        .node-container.host:hover .iso-block, .node-container.host.active .iso-block {
          transform: translateZ(70px);
          background: rgba(76, 111, 255, 0.2);
          border-color: rgba(76, 111, 255, 0.8);
          box-shadow: 0 0 30px rgba(76, 111, 255, 0.4), inset 0 0 30px rgba(76, 111, 255, 0.3);
        }
        .node-container.host:hover .iso-block::before, .node-container.host.active .iso-block::before {
          height: 70px;
          background: rgba(76, 111, 255, 0.1);
          border-color: rgba(76, 111, 255, 0.4);
        }
        .node-container.host:hover .iso-block::after, .node-container.host.active .iso-block::after {
          width: 70px;
          background: rgba(76, 111, 255, 0.15);
          border-color: rgba(76, 111, 255, 0.5);
        }

        .node-label {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotateZ(45deg) rotateX(-55deg) translateZ(60px);
          color: rgba(255, 255, 255, 0.5);
          font-family: var(--font-mono, monospace);
          font-size: 12px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          text-shadow: 0 2px 10px rgba(0,0,0,1);
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .node-container.host .node-label {
          transform: translate(-50%, -50%) rotateZ(45deg) rotateX(-55deg) translateZ(80px);
        }

        .node-container:hover .node-label, .node-container.active .node-label {
          opacity: 1;
          color: #fff;
          transform: translate(-50%, -50%) rotateZ(45deg) rotateX(-55deg) translateZ(100px);
        }

        .node-container.host:hover .node-label, .node-container.host.active .node-label {
          transform: translate(-50%, -50%) rotateZ(45deg) rotateX(-55deg) translateZ(130px);
          color: #4C6FFF;
        }

        .node-glow {
          position: absolute;
          top: 50%; left: 50%;
          width: 10px; height: 10px;
          background: rgba(255,255,255,0.8);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 10px rgba(255,255,255,0.4);
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .node-container.host .node-glow {
          background: #4C6FFF;
          box-shadow: 0 0 20px #4C6FFF;
        }

        .node-container:hover .node-glow, .node-container.active .node-glow {
          background: #FF6B45;
          box-shadow: 0 0 20px #FF6B45, 0 0 40px #FF6B45;
          width: 14px; height: 14px;
        }

        .node-container.host:hover .node-glow, .node-container.host.active .node-glow {
          background: #fff;
          box-shadow: 0 0 30px #fff, 0 0 60px #4C6FFF;
          width: 18px; height: 18px;
        }

        .reveal-header {
          position: absolute;
          top: 15vh;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 10;
          pointer-events: none;
        }

        .reveal-header h2 {
          font-family: var(--font-serif, serif);
          font-style: italic;
          font-size: 2.8rem;
          color: #F2F1EC;
          margin-bottom: 0.5rem;
          text-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }

        .reveal-header p {
          font-family: var(--font-mono, monospace);
          color: #9A9C97;
          font-size: 0.9rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
      `}</style>

      <div className="reveal-bg-glow" />

      <div className="reveal-header">
        <h2>Network Topology</h2>
        <p>Hover nodes to trace connections</p>
      </div>

      <div className="iso-scene">
        <div className="iso-grid" />
        
        <svg className="svg-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
          {NODES.filter(n => n.type !== 'host').map((peer, i) => {
            const host = NODES.find(n => n.type === 'host')!;
            const isActive = hoveredNode === peer.id || hoveredNode === host.id;
            const isHostActive = hoveredNode === host.id;
            
            const isXFirst = i % 2 === 0;
            const d = isXFirst
              ? `M ${host.x} ${host.y} L ${peer.x} ${host.y} L ${peer.x} ${peer.y}`
              : `M ${host.x} ${host.y} L ${host.x} ${peer.y} L ${peer.x} ${peer.y}`;
            
            return (
              <g key={`line-${peer.id}`}>
                <path
                  d={d}
                  className={`connection-line ${isActive ? 'active' : ''} ${isHostActive ? 'active-host' : ''}`}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            );
          })}
        </svg>

        {NODES.map((node) => {
          const isHovered = hoveredNode === node.id;
          const isHostHovered = hoveredNode === 'host';
          const isActive = isHovered || (isHostHovered && node.type !== 'host');

          return (
            <div
              key={node.id}
              className="node-hitbox"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div
                className={`node-container ${isActive ? 'active' : ''} ${node.type === 'host' ? 'host' : ''}`}
              >
              <div className="iso-block">
                <div className="node-glow" />
              </div>
              <div className="node-label">
                {node.code}
              </div>
            </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}