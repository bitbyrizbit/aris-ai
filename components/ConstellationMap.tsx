"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Sparkles, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
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
      <planeGeometry args={[40, 40, 40, 40]} />
      <meshBasicMaterial color="#4C6FFF" wireframe transparent opacity={0.05} />
    </mesh>
  );
}

function Buildings() {
  const buildings = useMemo(() => {
    const seeded: { pos: Vec3; h: number }[] = [];
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      const radius = 5 + (i % 3) * 1.5;
      const h = 0.5 + ((i * 37) % 10) / 5;
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
          <boxGeometry args={[0.3, b.h, 0.3]} />
          <meshStandardMaterial color="#0B0C0E" metalness={0.9} roughness={0.1} transparent opacity={0.8} />
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(0.3, b.h, 0.3)]} />
            <lineBasicMaterial color="#4C6FFF" transparent opacity={0.15} />
          </lineSegments>
        </mesh>
      ))}
    </>
  );
}

function Node({ position, self = false }: { position: Vec3; self?: boolean }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * 2 + position[0]) * 0.1;
    ref.current.rotation.y = t * 0.5;
    ref.current.rotation.z = Math.sin(t) * 0.1;
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <boxGeometry args={self ? [0.35, 0.35, 0.35] : [0.25, 0.25, 0.25]} />
        <meshPhysicalMaterial 
          color={self ? "#4C6FFF" : "#FF6B45"} 
          emissive={self ? "#4C6FFF" : "#FF6B45"} 
          emissiveIntensity={1.5}
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      <mesh>
        <boxGeometry args={self ? [0.5, 0.5, 0.5] : [0.35, 0.35, 0.35]} />
        <meshBasicMaterial color={self ? "#ffffff" : "#FF6B45"} wireframe transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function Signal({ from, to }: { from: Vec3; to: Vec3 }) {
  const lineRef = useRef<any>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (lineRef.current?.material) {
      lineRef.current.material.dashOffset = -clock.getElapsedTime() * 1.5;
    }
    if (pulseRef.current) {
      const t = (clock.getElapsedTime() * 0.6 + from[0] * 10) % 1;
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
        color="#4C6FFF"
        lineWidth={2}
        dashed
        dashScale={4}
        dashSize={0.5}
        gapSize={0.2}
        transparent
        opacity={0.6}
      />
      <mesh ref={pulseRef}>
        <boxGeometry args={[0.08, 0.08, 0.08]} />
        <meshBasicMaterial color="#ffffff" />
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
      <Sparkles count={80} scale={10} size={2} speed={0.2} color="#4C6FFF" opacity={0.4} />
    </>
  );
}

export default function ConstellationMap({ peerCount }: { peerCount: number }) {
  return (
    <Canvas camera={{ position: [5, 4, 7], fov: 42 }}>
      <color attach="background" args={["#0B0C0E"]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 5, 2]} intensity={2} color="#4C6FFF" />
      <pointLight position={[-4, 2, -2]} intensity={1} color="#FF6B45" />
      <Scene peerCount={peerCount} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate
        autoRotate
        autoRotateSpeed={0.5}
        minDistance={5}
        maxDistance={12}
        dampingFactor={0.05}
        enableDamping
      />
      <EffectComposer>
        <Bloom intensity={2} luminanceThreshold={0.1} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}