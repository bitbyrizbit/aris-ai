"use client";

// Placeholder nodes — wired to real peer connections on Day 2/3
const nodes = [
  { id: "you", x: 50, y: 50 },
  { id: "peer-1", x: 20, y: 20 },
  { id: "peer-2", x: 80, y: 25 },
];

export default function ConstellationMap() {
  const self = nodes[0];

  return (
    <svg
      viewBox="0 0 100 100"
      className="constellation"
      role="img"
      aria-label="Device connection map"
    >
      {nodes.slice(1).map((node) => (
        <line
          key={`line-${node.id}`}
          x1={self.x}
          y1={self.y}
          x2={node.x}
          y2={node.y}
          className="thread"
        />
      ))}
      {nodes.map((node) => (
        <circle
          key={node.id}
          cx={node.x}
          cy={node.y}
          r={node.id === "you" ? 3 : 2}
          className={node.id === "you" ? "node node-self" : "node"}
        />
      ))}
    </svg>
  );
}