"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { useRef, useState, type ReactNode } from "react";
import type { Group, Mesh } from "three";
import { MathUtils } from "three";

type Props = { reducedMotion: boolean; fallback: ReactNode };

/** Glossy morphing blob with orbit rings; the whole group leans toward the pointer. */
function Orb({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<Group>(null);
  const ringA = useRef<Mesh>(null);
  const ringB = useRef<Mesh>(null);
  const spin = useRef(0);
  const [hovered, setHovered] = useState(false);
  const speed = reducedMotion ? 0 : 1;

  useFrame((state, delta) => {
    if (!group.current) return;
    // A click adds a spin that decays; otherwise ease toward the pointer (state.pointer is -1..1).
    spin.current = MathUtils.damp(spin.current, 0, 3, delta);
    const lean = state.pointer.x * 0.6 + spin.current;
    group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, lean, 0.06);
    group.current.rotation.x = MathUtils.lerp(group.current.rotation.x, -state.pointer.y * 0.4, 0.06);
    const target = hovered ? 1.08 : 1;
    group.current.scale.setScalar(MathUtils.lerp(group.current.scale.x, target, 0.1));
    if (ringA.current) ringA.current.rotation.z += delta * 0.35 * speed;
    if (ringB.current) ringB.current.rotation.z -= delta * 0.25 * speed;
  });

  return (
    <group ref={group}>
      <Float speed={2 * speed} rotationIntensity={0.6 * speed} floatIntensity={1.2 * speed}>
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => {
            if (!reducedMotion) spin.current += Math.PI * 2;
          }}
        >
          <icosahedronGeometry args={[1.15, 64]} />
          <MeshDistortMaterial
            color={hovered ? "#8b5cf6" : "#6366f1"}
            roughness={0.15}
            metalness={0.35}
            distort={hovered ? 0.5 : 0.35}
            speed={2.2 * speed}
          />
        </mesh>
      </Float>
      <mesh ref={ringA} rotation={[Math.PI / 2.4, 0.2, 0]}>
        <torusGeometry args={[1.85, 0.018, 16, 160]} />
        <meshStandardMaterial color="#a5b4fc" emissive="#6366f1" emissiveIntensity={0.6} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 1.8, -0.4, 0.3]}>
        <torusGeometry args={[2.15, 0.012, 16, 160]} />
        <meshStandardMaterial color="#c4b5fd" emissive="#8b5cf6" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[1.9, 0.6, 0.4]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color="#34d399" emissive="#10b981" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-1.7, -0.9, 0.6]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="#f472b6" emissive="#ec4899" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

export default function HeroScene({ reducedMotion, fallback }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      frameloop={reducedMotion ? "demand" : "always"}
      fallback={fallback}
      aria-hidden
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <pointLight position={[-4, -2, 2]} intensity={25} color="#ec4899" />
      <pointLight position={[4, 2, -2]} intensity={20} color="#22d3ee" />
      <Orb reducedMotion={reducedMotion} />
      {!reducedMotion && <Sparkles count={45} scale={[6, 5, 3]} size={2.5} speed={0.35} color="#a5b4fc" />}
    </Canvas>
  );
}
