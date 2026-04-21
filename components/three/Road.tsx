"use client";

import React from "react";

type RoadProps = {
  segmentCount?: number;
  segmentLength?: number;
};

export default function Road({
  segmentCount = 12,
  segmentLength = 20,
}: RoadProps) {
  return (
    <group>
      {Array.from({ length: segmentCount }).map((_, index) => (
        <mesh
          key={index}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.49, -index * segmentLength]}
          castShadow
          receiveShadow
        >
          <planeGeometry args={[6, segmentLength]} />
          <meshStandardMaterial color="#6b7280" roughness={0.9} metalness={0.05} />
        </mesh>
      ))}

      {Array.from({ length: segmentCount * 2 }).map((_, index) => (
        <mesh
          key={`marker-${index}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.485, -index * (segmentLength / 2) - 3]}
        >
          <planeGeometry args={[0.2, 2.4]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} metalness={0.1} />
        </mesh>
      ))}

      {Array.from({ length: segmentCount * 2 }).map((_, index) => (
        <mesh
          key={`variation-${index}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[(index % 2 === 0 ? -1.3 : 1.3), -0.488, -index * (segmentLength / 2) - 2]}
        >
          <planeGeometry args={[0.9, 3]} />
          <meshStandardMaterial color="#5f6670" roughness={1} metalness={0} transparent opacity={0.2} />
        </mesh>
      ))}

      {Array.from({ length: segmentCount }).map((_, index) => (
        <mesh
          key={`edge-left-${index}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-3.3, -0.5, -index * segmentLength]}
          receiveShadow
        >
          <planeGeometry args={[0.9, segmentLength]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.72} metalness={0.08} />
        </mesh>
      ))}

      {Array.from({ length: segmentCount }).map((_, index) => (
        <mesh
          key={`edge-right-${index}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[3.3, -0.5, -index * segmentLength]}
          receiveShadow
        >
          <planeGeometry args={[0.9, segmentLength]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.72} metalness={0.08} />
        </mesh>
      ))}

      {Array.from({ length: segmentCount }).map((_, index) => (
        <mesh
          key={`sidewalk-left-${index}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-4.5, -0.5, -index * segmentLength]}
          receiveShadow
        >
          <planeGeometry args={[1.5, segmentLength]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.82} metalness={0.04} />
        </mesh>
      ))}

      {Array.from({ length: segmentCount }).map((_, index) => (
        <mesh
          key={`sidewalk-right-${index}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[4.5, -0.5, -index * segmentLength]}
          receiveShadow
        >
          <planeGeometry args={[1.5, segmentLength]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.82} metalness={0.04} />
        </mesh>
      ))}

      {Array.from({ length: segmentCount }).map((_, index) => (
        <mesh
          key={`grass-left-${index}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-7.4, -0.52, -index * segmentLength]}
        >
          <planeGeometry args={[4.3, segmentLength]} />
          <meshStandardMaterial color="#bbf7d0" roughness={0.95} metalness={0} />
        </mesh>
      ))}

      {Array.from({ length: segmentCount }).map((_, index) => (
        <mesh
          key={`grass-right-${index}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[7.4, -0.52, -index * segmentLength]}
        >
          <planeGeometry args={[4.3, segmentLength]} />
          <meshStandardMaterial color="#bbf7d0" roughness={0.95} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}
