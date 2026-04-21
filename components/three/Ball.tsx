"use client";

import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, MeshStandardMaterial, Vector3 } from "three";

type BallProps = {
  position: [number, number, number];
  kickDirection: [number, number, number];
  kickSignal: number;
  isFocused: boolean;
};

export default function Ball({ position, kickDirection, kickSignal, isFocused }: BallProps) {
  const ballRef = useRef<Group>(null);
  const shellRef = useRef<MeshStandardMaterial>(null);
  const pulseRef = useRef(0);
  const currentOffsetRef = useRef(new Vector3());
  const velocityRef = useRef(new Vector3());
  const desiredOffsetRef = useRef(new Vector3());
  const bounceRef = useRef(0);
  const bounceVelocityRef = useRef(0);

  useEffect(() => {
    if (kickSignal > 0) {
      velocityRef.current.addScaledVector(
        new Vector3(kickDirection[0], 0, kickDirection[2]).normalize(),
        1.15,
      );
      bounceVelocityRef.current += 0.85;
    }
  }, [kickSignal]);

  useFrame((_, delta) => {
    if (!ballRef.current) return;

    pulseRef.current += delta * (isFocused ? 8 : 3.5);
    const pulseScale = isFocused ? 1 + Math.sin(pulseRef.current) * 0.05 : 1;

    // Forward impulse + spring-damped easing back to anchor.
    desiredOffsetRef.current.set(0, 0, 0);
    velocityRef.current.addScaledVector(
      desiredOffsetRef.current.clone().sub(currentOffsetRef.current),
      Math.min(1, delta * 4.4),
    );
    velocityRef.current.multiplyScalar(Math.max(0, 1 - delta * 3.6));
    currentOffsetRef.current.addScaledVector(velocityRef.current, delta);

    bounceVelocityRef.current += (-bounceRef.current * 11 - bounceVelocityRef.current * 4.2) * delta;
    bounceRef.current += bounceVelocityRef.current * delta;

    ballRef.current.position.x = position[0] + currentOffsetRef.current.x;
    ballRef.current.position.z = position[2] + currentOffsetRef.current.z;
    ballRef.current.position.y = position[1] + Math.max(0, bounceRef.current) * 0.2;
    ballRef.current.rotation.x += delta * (2.2 + velocityRef.current.length() * 3.2);
    ballRef.current.scale.setScalar(pulseScale);

    if (shellRef.current) {
      shellRef.current.emissive.set(isFocused ? "#5eead4" : "#000000");
      shellRef.current.emissiveIntensity = isFocused ? 0.36 : 0;
    }
  });

  return (
    <group ref={ballRef} position={position}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.38, 22, 22]} />
        <meshStandardMaterial
          ref={shellRef}
          color="#ffffff"
          roughness={0.55}
          metalness={0.04}
          emissive="#000000"
        />
      </mesh>
      <mesh castShadow position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.11, 10, 10]} />
        <meshStandardMaterial color="#111111" roughness={0.42} />
      </mesh>
      <mesh castShadow position={[0.18, -0.05, 0.2]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color="#111111" roughness={0.42} />
      </mesh>
      <mesh castShadow position={[-0.22, -0.08, -0.14]}>
        <sphereGeometry args={[0.085, 10, 10]} />
        <meshStandardMaterial color="#111111" roughness={0.42} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.36, 0]}>
        <circleGeometry args={[0.45, 20]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}
