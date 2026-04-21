"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import { PCFSoftShadowMap } from "three";
import Player from "./Player";
import Field from "./Field";
import BallGroup from "./BallGroup";
import CameraFollow from "./CameraFollow";
import { usePlayerControls } from "../../hooks/usePlayerControls";

function SceneContent() {
  usePlayerControls();

  return (
    <>
      <hemisphereLight intensity={1.18} color="#d9efff" groundColor="#9cc486" />
      <ambientLight intensity={0.44} color="#ffffff" />
      <directionalLight
        castShadow
        position={[28, 34, 14]}
        intensity={2}
        color="#ffe9bd"
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-near={1}
        shadow-camera-far={140}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-bias={-0.00022}
        shadow-radius={6}
      />
      <Field />
      <BallGroup />
      <Player />
      <CameraFollow />
    </>
  );
}

export default function Scene() {
  return (
    <Canvas
      shadows
      gl={{ antialias: true }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = PCFSoftShadowMap;
      }}
      camera={{
        position: [0, 5, -10],
        fov: 68,
        near: 0.1,
        far: 280,
      }}
    >
      <color attach="background" args={["#8fd2ff"]} />
      <fog attach="fog" args={["#dcf4ff", 90, 230]} />
      <Sky distance={450000} sunPosition={[24, 32, 14]} inclination={0.49} azimuth={0.16} />
      <SceneContent />
    </Canvas>
  );
}
