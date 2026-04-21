"use client";

import React, { useLayoutEffect, useMemo, useRef } from "react";
import { Color, InstancedMesh, Matrix4, Object3D } from "three";
import { BUILDING_COLORS, BuildingData } from "./Building";

type BuildingGroupProps = {
  countPerSide?: number;
  blockLength?: number;
};

function createSeededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

export default function BuildingGroup({ countPerSide = 48, blockLength = 10 }: BuildingGroupProps) {
  const buildingsRef = useRef<InstancedMesh>(null);
  const shadowsRef = useRef<InstancedMesh>(null);
  const rooftopsRef = useRef<InstancedMesh>(null);
  const windowsLeftRef = useRef<InstancedMesh>(null);
  const windowsRightRef = useRef<InstancedMesh>(null);

  const data = useMemo(() => {
    const random = createSeededRandom(42);
    const list: BuildingData[] = [];
    const buildSide = (isLeft: boolean) => {
      let currentZ = 0;

      for (let i = 0; i < countPerSide; i += 1) {
        const width = 2 + random() * 3.2;
        const height = 4 + random() * 11;
        const depth = 2 + random() * 2.9;
        const laneOffset = 8.8 + random() * 5.6;
        const rowJitter = (random() - 0.5) * 1.4;
        const z = -(currentZ + rowJitter);
        const x = isLeft ? -laneOffset : laneOffset;
        const color = BUILDING_COLORS[Math.floor(random() * BUILDING_COLORS.length)];
        list.push({ x, z, width, height, depth, color });

        const spacing = blockLength * (0.7 + random() * 1.1);
        const occasionalGap = random() > 0.84 ? blockLength * (1.1 + random() * 1.6) : 0;
        currentZ += spacing + occasionalGap;
      }
    };

    buildSide(true);
    buildSide(false);

    for (let i = 0; i < list.length; i += 1) {
      if (random() > 0.9) {
        list[i].height *= 0.6 + random() * 0.45;
      }
    }

    return list;
  }, [blockLength, countPerSide]);

  useLayoutEffect(() => {
    if (
      !buildingsRef.current ||
      !shadowsRef.current ||
      !rooftopsRef.current ||
      !windowsLeftRef.current ||
      !windowsRightRef.current
    ) {
      return;
    }

    const dummy = new Object3D();
    const matrix = new Matrix4();

    data.forEach((building, index) => {
      dummy.position.set(building.x, -0.49 + building.height / 2, building.z);
      dummy.scale.set(building.width, building.height, building.depth);
      dummy.updateMatrix();
      buildingsRef.current!.setMatrixAt(index, dummy.matrix);
      buildingsRef.current!.setColorAt(index, new Color(building.color));

      dummy.position.set(building.x, -0.485, building.z);
      dummy.scale.set(building.width * 0.8, 0.02, building.depth * 0.8);
      dummy.updateMatrix();
      matrix.copy(dummy.matrix);
      shadowsRef.current!.setMatrixAt(index, matrix);

      dummy.position.set(building.x, -0.49 + building.height + 0.12, building.z + building.depth * 0.12);
      dummy.scale.set(building.width * 0.42, 0.24, building.depth * 0.34);
      dummy.updateMatrix();
      rooftopsRef.current!.setMatrixAt(index, dummy.matrix);
      rooftopsRef.current!.setColorAt(
        index,
        new Color(building.color).offsetHSL(0, -0.05, -0.12),
      );

      const windowHeight = Math.max(1.6, building.height * 0.75);
      const windowWidth = Math.max(0.5, building.width * 0.55);
      const windowDepthOffset = building.depth / 2 + 0.01;

      dummy.position.set(building.x, -0.49 + building.height * 0.52, building.z - windowDepthOffset);
      dummy.scale.set(windowWidth, windowHeight, 0.05);
      dummy.updateMatrix();
      windowsLeftRef.current!.setMatrixAt(index, dummy.matrix);

      dummy.position.set(building.x, -0.49 + building.height * 0.52, building.z + windowDepthOffset);
      dummy.scale.set(windowWidth, windowHeight, 0.05);
      dummy.updateMatrix();
      windowsRightRef.current!.setMatrixAt(index, dummy.matrix);

      const glowStrength = 0.1 + (building.height / 15) * 0.16;
      windowsLeftRef.current!.setColorAt(index, new Color(1, 0.93, 0.72).multiplyScalar(glowStrength));
      windowsRightRef.current!.setColorAt(index, new Color(1, 0.93, 0.72).multiplyScalar(glowStrength));
    });

    buildingsRef.current.instanceMatrix.needsUpdate = true;
    shadowsRef.current.instanceMatrix.needsUpdate = true;
    rooftopsRef.current.instanceMatrix.needsUpdate = true;
    windowsLeftRef.current.instanceMatrix.needsUpdate = true;
    windowsRightRef.current.instanceMatrix.needsUpdate = true;
    if (buildingsRef.current.instanceColor) {
      buildingsRef.current.instanceColor.needsUpdate = true;
    }
    if (windowsLeftRef.current.instanceColor) {
      windowsLeftRef.current.instanceColor.needsUpdate = true;
    }
    if (windowsRightRef.current.instanceColor) {
      windowsRightRef.current.instanceColor.needsUpdate = true;
    }
    if (rooftopsRef.current.instanceColor) {
      rooftopsRef.current.instanceColor.needsUpdate = true;
    }
  }, [data]);

  return (
    <group>
      <instancedMesh ref={buildingsRef} args={[undefined, undefined, data.length]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial vertexColors roughness={0.78} metalness={0.08} />
      </instancedMesh>

      <instancedMesh ref={shadowsRef} args={[undefined, undefined, data.length]} receiveShadow>
        <cylinderGeometry args={[1, 1, 1, 12]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.1} depthWrite={false} />
      </instancedMesh>

      <instancedMesh ref={rooftopsRef} args={[undefined, undefined, data.length]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial vertexColors roughness={0.82} metalness={0.06} />
      </instancedMesh>

      <instancedMesh ref={windowsLeftRef} args={[undefined, undefined, data.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          vertexColors
          emissive="#fef3c7"
          emissiveIntensity={0.25}
          metalness={0.02}
          roughness={0.32}
        />
      </instancedMesh>

      <instancedMesh ref={windowsRightRef} args={[undefined, undefined, data.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          vertexColors
          emissive="#fef3c7"
          emissiveIntensity={0.25}
          metalness={0.02}
          roughness={0.32}
        />
      </instancedMesh>
    </group>
  );
}
