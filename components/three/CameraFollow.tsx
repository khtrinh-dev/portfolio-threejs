"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { useGameStore } from "../../store/useGameStore";

const cameraOffset = new Vector3(0, 4.8, -9.8);
const lookAheadOffset = new Vector3(0, 1.3, 0);
const desiredPosition = new Vector3();
const lookAtTarget = new Vector3();
const smoothLookTarget = new Vector3();
const upAxis = new Vector3(0, 1, 0);

export default function CameraFollow() {
  const { camera } = useThree();
  const playerPosition = useGameStore((state) => state.playerPosition);
  const playerRotationY = useGameStore((state) => state.playerRotationY);

  useFrame((_, delta) => {
    desiredPosition.copy(cameraOffset).applyAxisAngle(upAxis, playerRotationY);
    desiredPosition.add(new Vector3(playerPosition[0], playerPosition[1], playerPosition[2]));

    const positionLerp = Math.min(1, delta * 3.2);
    camera.position.lerp(desiredPosition, positionLerp);

    lookAtTarget
      .set(playerPosition[0], playerPosition[1], playerPosition[2])
      .add(lookAheadOffset);
    const lookLerp = Math.min(1, delta * 4.1);
    smoothLookTarget.lerp(lookAtTarget, lookLerp);
    camera.lookAt(smoothLookTarget);
  });

  return null;
}
