import { create } from "zustand";

export type SectionName =
  | "About"
  | "Skills"
  | "Projects"
  | "Experience"
  | "Education";

type GameState = {
  distance: number;
  velocity: number;
  isMoving: boolean;
  playerPosition: [number, number, number];
  playerRotationY: number;
  currentSection: SectionName;
  focusedBallId: string | null;
  setDistance: (value: number) => void;
  addDistance: (delta: number) => void;
  setVelocity: (value: number) => void;
  setIsMoving: (value: boolean) => void;
  setPlayerPosition: (position: [number, number, number]) => void;
  setPlayerRotationY: (rotation: number) => void;
  resetDistance: () => void;
  setCurrentSection: (section: SectionName) => void;
  setFocusedBallId: (ballId: string | null) => void;
  kickedBallId: string | null;
  kickDirection: [number, number, number];
  triggerBallKick: (
    ballId: string,
    direction: [number, number, number],
  ) => void;
  clearKickedBall: () => void;
};

export const useGameStore = create<GameState>((set) => ({
  distance: 0,
  velocity: 0,
  isMoving: false,
  playerPosition: [0, 0, 0],
  playerRotationY: 0,
  currentSection: "About",
  focusedBallId: null,
  kickedBallId: null,
  kickDirection: [0, 0, 1],
  setDistance: (value) => set({ distance: Math.max(0, value) }),
  addDistance: (delta) =>
    set((state) => ({ distance: Math.max(0, state.distance + delta) })),
  setVelocity: (value) => set({ velocity: value }),
  setIsMoving: (value) => set({ isMoving: value }),
  setPlayerPosition: (position) => set({ playerPosition: position }),
  setPlayerRotationY: (rotation) => set({ playerRotationY: rotation }),
  resetDistance: () =>
    set({
      distance: 0,
      velocity: 0,
      isMoving: false,
      playerPosition: [0, 0, 0],
      playerRotationY: 0,
      currentSection: "About",
      focusedBallId: null,
      kickedBallId: null,
      kickDirection: [0, 0, 1],
    }),
  setCurrentSection: (section) => set({ currentSection: section }),
  setFocusedBallId: (ballId) => set({ focusedBallId: ballId }),
  triggerBallKick: (ballId, direction) =>
    set({
      kickedBallId: ballId,
      kickDirection: direction,
    }),
  clearKickedBall: () => set({ kickedBallId: null }),
}));
