"use client";

import React from "react";
import LampPost from "./LampPost";
import { SectionName } from "../../store/useGameStore";

export type LampMilestone = {
  section: SectionName;
  z: number;
};

type LampPostGroupProps = {
  milestones: LampMilestone[];
};

export default function LampPostGroup({ milestones }: LampPostGroupProps) {
  return (
    <group>
      {milestones.map((milestone) => (
        <group key={milestone.section}>
          <LampPost label={milestone.section} position={[-4.8, 0, milestone.z]} />
          <LampPost label={milestone.section} position={[4.8, 0, milestone.z]} />
        </group>
      ))}
    </group>
  );
}
