"use client";

import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { useGameStore } from "../../store/useGameStore";

type PlayerProps = {
  baseHeight?: number;
};

export default function Player({ baseHeight = 0 }: PlayerProps) {
  const playerRef = useRef<Group>(null);
  const leftLegRef = useRef<Group>(null);
  const rightLegRef = useRef<Group>(null);
  const leftArmRef = useRef<Group>(null);
  const rightArmRef = useRef<Group>(null);
  const walkTimeRef = useRef(0);
  const kickTimeRef = useRef(0);
  const prevKickedBallRef = useRef<string | null>(null);

  const velocity = useGameStore((state) => state.velocity);
  const isMoving = useGameStore((state) => state.isMoving);
  const playerPosition = useGameStore((state) => state.playerPosition);
  const playerRotationY = useGameStore((state) => state.playerRotationY);
  const kickedBallId = useGameStore((state) => state.kickedBallId);

  useEffect(() => {
    if (kickedBallId && kickedBallId !== prevKickedBallRef.current) {
      kickTimeRef.current = 0.28;
      prevKickedBallRef.current = kickedBallId;
    }
  }, [kickedBallId]);

  useFrame((_, delta) => {
    if (!playerRef.current) return;

    const smoothing = Math.min(1, delta * 7);
    const targetY = baseHeight;
    playerRef.current.position.x += (playerPosition[0] - playerRef.current.position.x) * smoothing;
    playerRef.current.position.y += (targetY - playerRef.current.position.y) * smoothing;
    playerRef.current.position.z += (playerPosition[2] - playerRef.current.position.z) * smoothing;
    playerRef.current.rotation.y += (playerRotationY - playerRef.current.rotation.y) * smoothing;

    walkTimeRef.current += delta * (1.2 + Math.abs(velocity) * 0.18);
    const walkSwing = isMoving ? Math.sin(walkTimeRef.current * 7) * 0.45 : 0;

    if (kickTimeRef.current > 0) {
      kickTimeRef.current = Math.max(0, kickTimeRef.current - delta);
    }
    const kickProgress = kickTimeRef.current > 0 ? 1 - kickTimeRef.current / 0.28 : 0;
    const kickSwing = kickProgress > 0 ? Math.sin(kickProgress * Math.PI) * 0.95 : 0;

    if (leftLegRef.current) leftLegRef.current.rotation.x = walkSwing * 0.75;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -walkSwing * 0.75 + kickSwing;
    if (leftArmRef.current) leftArmRef.current.rotation.x = -walkSwing * 0.45;
    if (rightArmRef.current) rightArmRef.current.rotation.x = walkSwing * 0.45;
  });

  return (
    <group ref={playerRef} position={[playerPosition[0], baseHeight, playerPosition[2]]}>
      <mesh castShadow receiveShadow position={[0, 1.62, 0]}>
        <sphereGeometry args={[0.5, 18, 18]} />
        <meshStandardMaterial color="#f6caa8" roughness={0.78} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.14, 1.67, 0.45]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial color="#111111" roughness={0.35} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.14, 1.67, 0.45]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial color="#111111" roughness={0.35} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 0.95, 0]}>
        <boxGeometry args={[0.76, 0.68, 0.4]} />
        <meshStandardMaterial color="#ef4444" roughness={0.58} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.08, 0.205]}>
        <boxGeometry args={[0.19, 0.42, 0.05]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>

      <group ref={leftArmRef} position={[-0.5, 1.02, 0]}>
        <mesh castShadow receiveShadow position={[0, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.075, 0.075, 0.5, 12]} />
          <meshStandardMaterial color="#f6caa8" roughness={0.72} />
        </mesh>
      </group>
      <group ref={rightArmRef} position={[0.5, 1.02, 0]}>
        <mesh castShadow receiveShadow position={[0, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.075, 0.075, 0.5, 12]} />
          <meshStandardMaterial color="#f6caa8" roughness={0.72} />
        </mesh>
      </group>

      <group ref={leftLegRef} position={[-0.2, 0.56, 0]}>
        <mesh castShadow receiveShadow position={[0, -0.23, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.5, 12]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.72} />
        </mesh>
      </group>
      <group ref={rightLegRef} position={[0.2, 0.56, 0]}>
        <mesh castShadow receiveShadow position={[0, -0.23, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.5, 12]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.72} />
        </mesh>
      </group>
      <mesh castShadow receiveShadow position={[-0.2, 0.11, 0.08]}>
        <boxGeometry args={[0.22, 0.08, 0.34]} />
        <meshStandardMaterial color="#1f2937" roughness={0.7} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.2, 0.11, 0.08]}>
        <boxGeometry args={[0.22, 0.08, 0.34]} />
        <meshStandardMaterial color="#1f2937" roughness={0.7} />
      </mesh>

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[0.7, 28]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
