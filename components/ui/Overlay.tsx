"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSection } from "../../hooks/useSection";

const SECTION_CONTENT: Record<string, { title: string; description: string }> = {
  About: {
    title: "About",
    description: "Building interactive 3D experiences with clean UI architecture.",
  },
  Skills: {
    title: "Skills",
    description: "React, Three.js, TypeScript, and performance-first frontend work.",
  },
  Projects: {
    title: "Projects",
    description: "A selection of interactive builds, product work, and experiments.",
  },
  Experience: {
    title: "Experience",
    description: "Hands-on delivery across frontend engineering and 3D web interfaces.",
  },
  Education: {
    title: "Education",
    description: "Foundations in software engineering, design systems, and product thinking.",
  },
};

export default function Overlay() {
  const { currentSection } = useSection();
  const [displaySection, setDisplaySection] = useState(currentSection);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (currentSection === displaySection) return;

    setVisible(false);
    const timer = window.setTimeout(() => {
      setDisplaySection(currentSection);
      setVisible(true);
    }, 180);

    return () => window.clearTimeout(timer);
  }, [currentSection, displaySection]);

  const content = useMemo(
    () =>
      SECTION_CONTENT[displaySection] ?? {
        title: displaySection || "Section",
        description: "Content is being prepared.",
      },
    [displaySection],
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 24,
        left: 24,
        zIndex: 10,
        maxWidth: 420,
        padding: "16px 20px",
        borderRadius: 12,
        background: "rgba(17, 24, 39, 0.72)",
        border: "1px solid rgba(255, 255, 255, 0.14)",
        color: "#f9fafb",
        backdropFilter: "blur(6px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(6px)",
        transition: "opacity 180ms ease, transform 180ms ease",
      }}
    >
      <p style={{ margin: 0, fontSize: 12, opacity: 0.75 }}>Current Section</p>
      <h2 style={{ margin: "6px 0 8px", fontSize: 28, lineHeight: 1.1 }}>
        {content.title}
      </h2>
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>{content.description}</p>
      <p style={{ margin: "12px 0 0", fontSize: 12, opacity: 0.82 }}>
        Arrow keys to move. Touch a football to open that section.
      </p>
    </div>
  );
}
