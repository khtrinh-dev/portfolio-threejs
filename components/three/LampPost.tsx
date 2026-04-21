"use client";

import React from "react";
import { SectionName } from "../../store/useGameStore";

type LampPostProps = {
  label: SectionName;
  position: [number, number, number];
};

export default function LampPost({ label, position }: LampPostProps) {
  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 8]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.08, 0.11, 3, 8]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>

      <mesh position={[0, 3.1, 0]}>
        <boxGeometry args={[0.35, 0.28, 0.35]} />
        <meshStandardMaterial color="#f8fafc" emissive="#fde047" emissiveIntensity={1.15} />
      </mesh>

      <pointLight position={[0, 3.1, 0]} intensity={1.3} distance={11} decay={2} color="#fff4bf" />

      <mesh position={[0, 3.65, 0.12]}>
        <boxGeometry args={[1.8, 0.34, 0.08]} />
        <meshStandardMaterial color={label === "About" ? "#1f2937" : "#0f172a"} />
      </mesh>
    </group>
  );
}
