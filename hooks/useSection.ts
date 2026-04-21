import { useEffect, useMemo, useState } from "react";
import { useGameStore } from "../store/useGameStore";

export type SectionRange = {
  name: string;
  start: number;
  end: number;
};

const DEFAULT_SECTIONS: SectionRange[] = [
  { name: "About", start: 0, end: 100 },
  { name: "Skills", start: 100, end: 200 },
];

export function useSection(sections: SectionRange[] = DEFAULT_SECTIONS) {
  const distance = useGameStore((state) => state.distance);
  const storeSection = useGameStore((state) => state.currentSection);

  const normalizedSections = useMemo(
    () => [...sections].sort((a, b) => a.start - b.start),
    [sections],
  );

  const [currentSection, setCurrentSection] = useState<string>(
    normalizedSections[0]?.name ?? "",
  );

  useEffect(() => {
    if (storeSection) {
      setCurrentSection(storeSection);
      return;
    }

    const matched =
      normalizedSections.find(
        (section) => distance >= section.start && distance < section.end,
      ) ?? normalizedSections[normalizedSections.length - 1];

    setCurrentSection(matched?.name ?? "");
  }, [distance, normalizedSections, storeSection]);

  return {
    distance,
    currentSection,
    sections: normalizedSections,
  };
}
