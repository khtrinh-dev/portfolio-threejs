import { useFrame } from "@react-three/fiber";
import { Object3D } from "three";
import { useGameStore } from "../store/useGameStore";

type UseMovementOptions = {
  speed?: number;
  target?: Object3D | null;
};

export function useMovement({ speed = 8, target }: UseMovementOptions = {}) {
  const distance = useGameStore((state) => state.distance);
  const addDistance = useGameStore((state) => state.addDistance);

  useFrame((_, delta) => {
    const moveStep = speed * delta;
    addDistance(moveStep);

    if (target) {
      target.position.z = -distance - moveStep;
    }
  });

  return {
    distance,
  };
}
