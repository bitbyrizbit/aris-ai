"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Sparkles, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type Vec3 = [number, number, number];

function generatePeers(count: number): { id: string; pos: Vec3 }[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }).map((_, i) => {
    const angle = i * golden;
    const radius = 1.6 + (i % 4) * 0.5;
    return {
      id: `peer-${i}`,
      pos: [
        Math.cos(angle) * radius,
        0.1,
        Math.sin(angle) * radius,
      ] as Vec3,
    };
  });
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
      <planeGeometry args={[30, 30, 30, 30]} />
      <meshStandardMaterial color="#0B0C0E" wireframe opacity={0.25} transparent />
    </mesh>
  );
}

function Buildings() {
  const buildings = useMemo(() => {
    const seeded: { pos: Vec3; h: number }[] = [];
    for (let i = 0; i < 22; i++) {
      const angle = (i / 22) * Math.PI * 2 + (i % 3);
      const radius = 4 + (i % 5) * 1.1;
      const h = 0.3 + ((i * 37) % 10) / 10;
      seeded.push({
        pos: [Math.cos(angle) * radius, -0.4 + h / 2, Math.sin(angle) * radius],
        h,
      });
    }
    return seeded;
  }, []);

  return (
    <>
      {buildings.map((b, i) => (
        <mesh key={i} position={b.pos}>
          <boxGeometry args={[0.25, b.h, 0.25]} />
          <meshStandardMaterial color="#ff0084" emissive="#ff0099" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </>
  );
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
      <sphereGeometry args={[self ? 0.16 : 0.11, 32, 32]} />
      <meshStandardMaterial
        color={self ? "#F2F1EC" : "#0434f2"}
        emissive={self ? "#F2F1EC" : "#324eba"}
        emissiveIntensity={self ? 0.6 : 1.8}
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
        color="#FF6B45"
        lineWidth={1}
        dashed
        dashScale={6}
        dashSize={0.4}
        gapSize={0.3}
        transparent
        opacity={0.6}
      />
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#FF6B45" emissive="#FF6B45" emissiveIntensity={2} />
      </mesh>
    </>
  );
}

function Scene({ peerCount }: { peerCount: number }) {
  const peers = generatePeers(peerCount);

  return (
    <>
      <Ground />
      <Buildings />
      <Node position={[0, 0.1, 0]} self />
      {peers.map((p) => (
        <Signal key={`s-${p.id}`} from={[0, 0.1, 0]} to={p.pos} />
      ))}
      {peers.map((p) => (
        <Node key={p.id} position={p.pos} />
      ))}
      <Sparkles count={60} scale={8} size={1.4} speed={0.15} color="#4C6FFF" opacity={0.3} />
    </>
  );
}

export default function ConstellationMap({ peerCount }: { peerCount: number }) {
  return (
    <Canvas camera={{ position: [4, 3.5, 6], fov: 42 }}>
      <color attach="background" args={["#141926"]} />
      <ambientLight intensity={0.65} />
      <pointLight position={[4, 5, 4]} intensity={1.6} color="#0032f9" />
      <pointLight position={[-4, 2, -2]} intensity={0.7} color="#FF6B45" />
      <Scene peerCount={peerCount} />
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={2.5}
        maxDistance={14}
        dampingFactor={0.08}
        enableDamping
      />
      <EffectComposer>
        <Bloom intensity={1.1} luminanceThreshold={0.12} luminanceSmoothing={0.4} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}