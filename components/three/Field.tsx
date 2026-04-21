"use client";

import React from "react";

export default function Field() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[260, 260]} />
        <meshStandardMaterial color="#3f9f56" roughness={0.95} metalness={0.02} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <planeGeometry args={[110, 70]} />
        <meshStandardMaterial color="#4fb768" roughness={0.9} metalness={0} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[8.8, 9.3, 48]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} metalness={0.04} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.011, 0]}>
        <planeGeometry args={[0.45, 70]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} metalness={0.04} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -34.8]}>
        <planeGeometry args={[110, 0.45]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} metalness={0.04} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 34.8]}>
        <planeGeometry args={[110, 0.45]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} metalness={0.04} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-54.8, 0.012, 0]}>
        <planeGeometry args={[0.45, 70]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} metalness={0.04} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[54.8, 0.012, 0]}>
        <planeGeometry args={[0.45, 70]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} metalness={0.04} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.013, -24]}>
        <planeGeometry args={[44, 18]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} metalness={0.04} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.013, 24]}>
        <planeGeometry args={[44, 18]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} metalness={0.04} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, -30]}>
        <planeGeometry args={[18, 7]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} metalness={0.04} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, 30]}>
        <planeGeometry args={[18, 7]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} metalness={0.04} />
      </mesh>

      <group position={[0, 0, -46]}>
        <mesh castShadow receiveShadow position={[0, 2.5, 0]}>
          <boxGeometry args={[44, 5, 12]} />
          <meshStandardMaterial color="#b9c6d4" roughness={0.88} metalness={0.06} />
        </mesh>
      </group>
      <group position={[0, 0, 46]}>
        <mesh castShadow receiveShadow position={[0, 2.5, 0]}>
          <boxGeometry args={[44, 5, 12]} />
          <meshStandardMaterial color="#b9c6d4" roughness={0.88} metalness={0.06} />
        </mesh>
      </group>
    </group>
  );
}
