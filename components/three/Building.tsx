"use client";

import React from "react";

export type BuildingData = {
  x: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  color: string;
};

type BuildingProps = {
  data: BuildingData;
};

export const BUILDING_COLORS = ["#f8fafc", "#e2e8f0", "#cbd5e1", "#dbeafe", "#ede9fe", "#fee2e2"];

export default function Building({ data }: BuildingProps) {
  return (
    <group position={[data.x, -0.49, data.z]}>
      <mesh castShadow receiveShadow position={[0, data.height / 2, 0]}>
        <boxGeometry args={[data.width, data.height, data.depth]} />
        <meshStandardMaterial color={data.color} />
      </mesh>

      <mesh receiveShadow position={[0, 0.01, 0]} scale={[data.width * 0.7, 1, data.depth * 0.7]}>
        <cylinderGeometry args={[1, 1, 0.01, 12]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  );
}
