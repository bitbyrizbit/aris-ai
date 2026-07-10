"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type Vec3 = [number, number, number];

const peers: { id: string; pos: Vec3 }[] = [
  { id: "peer-1", pos: [-2.3, 1.3, -0.6] },
  { id: "peer-2", pos: [2.5, 1.0, -1.0] },
  { id: "peer-3", pos: [0.2, -1.7, -0.4] },
];

function Node({ position, self = false }: { position: Vec3; self?: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current || self) return;
    const t = clock.getElapsedTime();
    ref.current.scale.setScalar(1 + Math.sin(t * 2 + position[0]) * 0.12);
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[self ? 0.22 : 0.14, 32, 32]} />
      <meshStandardMaterial
        color={self ? "#0E0E0E" : "#1E3FFF"}
        emissive={self ? "#0E0E0E" : "#1E3FFF"}
        emissiveIntensity={self ? 0.2 : 1.5}
      />
    </mesh>
  );
}

function Signal({ from, to }: { from: Vec3; to: Vec3 }) {
  const ref = useRef<any>(null);

  useFrame(({ clock }) => {
    if (ref.current?.material) {
      ref.current.material.dashOffset = -clock.getElapsedTime() * 0.6;
    }
  });

  return (
    <Line
      ref={ref}
      points={[from, to]}
      color="#B9B6A8"
      lineWidth={1}
      dashed
      dashScale={6}
      dashSize={0.4}
      gapSize={0.3}
      transparent
      opacity={0.55}
    />
  );
}

function Scene() {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function handlePointer(e: PointerEvent) {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 0.6;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * -0.3;
    }
    window.addEventListener("pointermove", handlePointer);
    return () => window.removeEventListener("pointermove", handlePointer);
  }, []);

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y +=
      (target.current.x - group.current.rotation.y) * 0.04 + 0.0006;
    group.current.rotation.x +=
      (target.current.y - group.current.rotation.x) * 0.04;
  });

  return (
    <group ref={group}>
      <Node position={[0, 0, 0]} self />
      {peers.map((p) => (
        <Signal key={`s-${p.id}`} from={[0, 0, 0]} to={p.pos} />
      ))}
      {peers.map((p) => (
        <Node key={p.id} position={p.pos} />
      ))}
      <Sparkles count={40} scale={5} size={1.4} speed={0.25} color="#1E3FFF" opacity={0.4} />
    </group>
  );
}

export default function ConstellationMap() {
  return (
    <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 3]} intensity={1.2} color="#1E3FFF" />
      <Scene />
      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.15} luminanceSmoothing={0.4} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}