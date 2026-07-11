"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type Vec3 = [number, number, number];

function generatePeers(count: number): { id: string; pos: Vec3 }[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }).map((_, i) => {
    const angle = i * golden;
    const radius = 1.8 + (i % 3) * 0.4;
    return {
      id: `peer-${i}`,
      pos: [
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.6,
        -0.4 - (i % 3) * 0.6,
      ] as Vec3,
    };
  });
}

function Node({ position, self = false }: { position: Vec3; self?: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current || self) return;
    const t = clock.getElapsedTime();
    ref.current.scale.setScalar(1 + Math.sin(t * 2 + position[0]) * 0.14);
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[self ? 0.22 : 0.13, 32, 32]} />
      <meshStandardMaterial
        color={self ? "#0E0E0E" : "#1E3FFF"}
        emissive={self ? "#0E0E0E" : "#1E3FFF"}
        emissiveIntensity={self ? 0.15 : 1.6}
      />
    </mesh>
  );
}

function Signal({ from, to }: { from: Vec3; to: Vec3 }) {
  const lineRef = useRef<any>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (lineRef.current?.material) {
      lineRef.current.material.dashOffset = -clock.getElapsedTime() * 0.6;
    }
    if (pulseRef.current) {
      const t = (clock.getElapsedTime() * 0.4 + from[0]) % 1;
      pulseRef.current.position.set(
        THREE.MathUtils.lerp(from[0], to[0], t),
        THREE.MathUtils.lerp(from[1], to[1], t),
        THREE.MathUtils.lerp(from[2], to[2], t)
      );
    }
  });

  return (
    <>
      <Line
        ref={lineRef}
        points={[from, to]}
        color="#B9B6A8"
        lineWidth={1}
        dashed
        dashScale={6}
        dashSize={0.4}
        gapSize={0.3}
        transparent
        opacity={0.5}
      />
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#FF5A36" emissive="#FF5A36" emissiveIntensity={2} />
      </mesh>
    </>
  );
}

function Scene({ peerCount }: { peerCount: number }) {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });
  const peers = generatePeers(peerCount);

  useEffect(() => {
    function handlePointer(e: PointerEvent) {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 0.8;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * -0.4;
    }
    window.addEventListener("pointermove", handlePointer);
    return () => window.removeEventListener("pointermove", handlePointer);
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const drift = Math.sin(clock.getElapsedTime() * 0.15) * 0.15;
    group.current.rotation.y +=
      (target.current.x + drift - group.current.rotation.y) * 0.03;
    group.current.rotation.x +=
      (target.current.y - group.current.rotation.x) * 0.03;
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
      <Sparkles count={70} scale={6} size={1.6} speed={0.2} color="#1E3FFF" opacity={0.35} />
    </group>
  );
}

export default function ConstellationMap({ peerCount }: { peerCount: number }) {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 42 }}>
      <ambientLight intensity={0.55} />
      <pointLight position={[3, 3, 4]} intensity={1.4} color="#1E3FFF" />
      <pointLight position={[-3, -2, 2]} intensity={0.6} color="#FF5A36" />
      <Scene peerCount={peerCount} />
      <EffectComposer>
        <Bloom intensity={1.1} luminanceThreshold={0.12} luminanceSmoothing={0.4} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}