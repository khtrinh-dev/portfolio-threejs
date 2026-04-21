import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { FOOTBALL_BALLS } from "../components/three/ballData";
import { useGameStore } from "../store/useGameStore";

const MAX_FORWARD_SPEED = 11;
const MAX_REVERSE_SPEED = 6;
const ACCELERATION = 18;
const BRAKE_ACCELERATION = 24;
const COAST_DAMPING = 7;
const TURN_SPEED = 2.8;
const KICK_DISTANCE = 1.5;
const FOCUS_DISTANCE = 1.9;
const UI_TRIGGER_DELAY_MS = 160;

export function usePlayerControls() {
  const playerPosition = useGameStore((state) => state.playerPosition);
  const playerRotationY = useGameStore((state) => state.playerRotationY);
  const setVelocity = useGameStore((state) => state.setVelocity);
  const setIsMoving = useGameStore((state) => state.setIsMoving);
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
  const setPlayerRotationY = useGameStore((state) => state.setPlayerRotationY);
  const setCurrentSection = useGameStore((state) => state.setCurrentSection);
  const setFocusedBallId = useGameStore((state) => state.setFocusedBallId);
  const triggerBallKick = useGameStore((state) => state.triggerBallKick);
  const velocityRef = useRef(0);
  const inputRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });
  const positionRef = useRef<[number, number, number]>(playerPosition);
  const rotationRef = useRef(playerRotationY);
  const activeKickContactBallRef = useRef<string | null>(null);
  const focusedBallRef = useRef<string | null>(null);
  const uiDelayTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    positionRef.current = playerPosition;
  }, [playerPosition]);

  useEffect(() => {
    rotationRef.current = playerRotationY;
  }, [playerRotationY]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "ArrowUp") inputRef.current.forward = true;
      if (event.code === "ArrowDown") inputRef.current.backward = true;
      if (event.code === "ArrowLeft") inputRef.current.left = true;
      if (event.code === "ArrowRight") inputRef.current.right = true;
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "ArrowUp") inputRef.current.forward = false;
      if (event.code === "ArrowDown") inputRef.current.backward = false;
      if (event.code === "ArrowLeft") inputRef.current.left = false;
      if (event.code === "ArrowRight") inputRef.current.right = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (uiDelayTimeoutRef.current !== null) {
        window.clearTimeout(uiDelayTimeoutRef.current);
        uiDelayTimeoutRef.current = null;
      }
    };
  }, []);

  useFrame((_, delta) => {
    const forward = inputRef.current.forward;
    const backward = inputRef.current.backward;
    const left = inputRef.current.left;
    const right = inputRef.current.right;
    const direction = Number(forward) - Number(backward);
    const movingForward = velocityRef.current >= 0;

    if (direction !== 0) {
      const isBraking = (direction > 0 && !movingForward) || (direction < 0 && movingForward);
      const appliedAcceleration = isBraking ? BRAKE_ACCELERATION : ACCELERATION;
      velocityRef.current += direction * appliedAcceleration * delta;
    } else {
      const dampingFactor = Math.exp(-COAST_DAMPING * delta);
      velocityRef.current *= dampingFactor;
    }

    velocityRef.current = Math.max(
      -MAX_REVERSE_SPEED,
      Math.min(MAX_FORWARD_SPEED, velocityRef.current),
    );
    if (Math.abs(velocityRef.current) < 0.02) velocityRef.current = 0;

    const steerStrength = 0.5 + Math.min(0.5, Math.abs(velocityRef.current) / MAX_FORWARD_SPEED);
    let turnDelta = 0;
    if (left) turnDelta -= TURN_SPEED * steerStrength * delta;
    if (right) turnDelta += TURN_SPEED * steerStrength * delta;
    // Left turn => negative Y rotation, right turn => positive Y rotation.
    rotationRef.current += turnDelta;

    const moveDistance = velocityRef.current * delta;
    // Move along the player's current facing direction in world space.
    const deltaX = Math.sin(rotationRef.current) * moveDistance;
    const deltaZ = Math.cos(rotationRef.current) * moveDistance;
    positionRef.current = [
      positionRef.current[0] + deltaX,
      positionRef.current[1],
      positionRef.current[2] + deltaZ,
    ];

    const nearestBall = FOOTBALL_BALLS.reduce<{ id: string; section: (typeof FOOTBALL_BALLS)[number]["section"]; distance: number } | null>(
      (nearest, ball) => {
        const dx = ball.position[0] - positionRef.current[0];
        const dz = ball.position[2] - positionRef.current[2];
        const distance = Math.hypot(dx, dz);
        if (!nearest || distance < nearest.distance) {
          return { id: ball.id, section: ball.section, distance };
        }
        return nearest;
      },
      null,
    );
    const nextFocusedBallId = nearestBall && nearestBall.distance < FOCUS_DISTANCE ? nearestBall.id : null;
    if (focusedBallRef.current !== nextFocusedBallId) {
      focusedBallRef.current = nextFocusedBallId;
      setFocusedBallId(nextFocusedBallId);
    }

    if (nearestBall && nearestBall.distance < KICK_DISTANCE) {
      if (activeKickContactBallRef.current !== nearestBall.id) {
        activeKickContactBallRef.current = nearestBall.id;
        const ball = FOOTBALL_BALLS.find((entry) => entry.id === nearestBall.id);
        if (ball) {
          const fromPlayerToBallX = ball.position[0] - positionRef.current[0];
          const fromPlayerToBallZ = ball.position[2] - positionRef.current[2];
          const directionLength = Math.hypot(fromPlayerToBallX, fromPlayerToBallZ) || 1;
          const kickDirection: [number, number, number] = [
            fromPlayerToBallX / directionLength,
            0,
            fromPlayerToBallZ / directionLength,
          ];
          triggerBallKick(nearestBall.id, kickDirection);
          if (uiDelayTimeoutRef.current !== null) {
            window.clearTimeout(uiDelayTimeoutRef.current);
          }
          uiDelayTimeoutRef.current = window.setTimeout(() => {
            setCurrentSection(nearestBall.section);
            uiDelayTimeoutRef.current = null;
          }, UI_TRIGGER_DELAY_MS);
        }
      }
    } else if (activeKickContactBallRef.current) {
      // Re-arm kicking once the player leaves close contact.
      activeKickContactBallRef.current = null;
    }

    setVelocity(velocityRef.current);
    setIsMoving(Math.abs(velocityRef.current) > 0.25);
    setPlayerRotationY(rotationRef.current);
    setPlayerPosition(positionRef.current);
  });

  return {
    playerPosition,
    playerRotationY,
    velocity: velocityRef.current,
  };
}
