"use client";

import React, { useEffect, useState } from "react";
import Ball from "./Ball";
import { FOOTBALL_BALLS } from "./ballData";
import { useGameStore } from "../../store/useGameStore";

type KickMap = Record<string, number>;
type DirectionMap = Record<string, [number, number, number]>;

export default function BallGroup() {
  const focusedBallId = useGameStore((state) => state.focusedBallId);
  const kickedBallId = useGameStore((state) => state.kickedBallId);
  const kickDirection = useGameStore((state) => state.kickDirection);
  const clearKickedBall = useGameStore((state) => state.clearKickedBall);
  const [kickCounts, setKickCounts] = useState<KickMap>({});
  const [kickDirections, setKickDirections] = useState<DirectionMap>({});

  useEffect(() => {
    if (!kickedBallId) return;

    setKickCounts((prev) => ({
      ...prev,
      [kickedBallId]: (prev[kickedBallId] ?? 0) + 1,
    }));
    setKickDirections((prev) => ({
      ...prev,
      [kickedBallId]: kickDirection,
    }));

    const timer = window.setTimeout(() => clearKickedBall(), 80);
    return () => window.clearTimeout(timer);
  }, [clearKickedBall, kickDirection, kickedBallId]);

  return (
    <group>
      {FOOTBALL_BALLS.map((ball) => (
        <Ball
          key={ball.id}
          position={ball.position}
          kickDirection={kickDirections[ball.id] ?? [0, 0, 1]}
          kickSignal={kickCounts[ball.id] ?? 0}
          isFocused={focusedBallId === ball.id}
        />
      ))}
    </group>
  );
}
