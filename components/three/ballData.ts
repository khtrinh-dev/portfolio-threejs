import { SectionName } from "../../store/useGameStore";

export type BallSection = Exclude<SectionName, "About">;

export type FootballBallData = {
  id: string;
  section: BallSection;
  position: [number, number, number];
};

export const FOOTBALL_BALLS: FootballBallData[] = [
  { id: "skills-ball", section: "Skills", position: [-12, 0.42, 10] },
  { id: "projects-ball", section: "Projects", position: [10, 0.42, 14] },
  { id: "experience-ball", section: "Experience", position: [-10, 0.42, -12] },
  { id: "education-ball", section: "Education", position: [14, 0.42, -10] },
];
