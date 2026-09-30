// app/projects/page.tsx
"use client";

import { useState } from "react";
import ProjectGlobe from "../components/projects/ProjectGlobe";
import ProjectDetailsCard from "../components/projects/ProjectDetailsCard";
import type { Project } from "../data/projects";

export default function ProjectsPage() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [cardPos, setCardPos] = useState<{ x: number; y: number } | null>(null);

  const handleSelect = (project: Project, position: { x: number; y: number }) => {
    setSelected(project);
    setCardPos(position);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#060b18] px-6 py-16">
      <div className="mx-auto max-w-5xl text-center text-white">
        <h1 className="text-3xl font-semibold sm:text-4xl">
          Our Projects Around the World
        </h1>
        <p className="mt-3 text-zinc-400">
          Drag to rotate the globe. Click a marker to see project details.
        </p>
      </div>

      <div className="relative mt-10">
        <ProjectGlobe onSelect={handleSelect} />

        {selected && cardPos && (
          <ProjectDetailsCard
            project={selected}
            position={cardPos}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
}