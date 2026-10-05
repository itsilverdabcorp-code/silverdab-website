// app/projects/page.tsx
"use client";

import { useState } from "react";
import ProjectsIntro from "../components/projects/ProjectsIntro";
import ProjectGlobe from "../components/projects/ProjectGlobe";


import type { Project } from "../data/projects";
import ProjectDetailsCard from "../components/projects/ProjectDetailsCard";
import ProjectsShowcase from "../components/projects/ProjectsShowcase";





export default function ProjectsPage() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [cardPos, setCardPos] = useState<{ x: number; y: number } | null>(null);

  const handleSelect = (project: Project, position: { x: number; y: number }) => {
    setSelected(project);
    setCardPos(position);
  };

  return (
    <>
      <ProjectsIntro />

      <div className="relative w-full overflow-hidden bg-white px-6 pb-20">

        <div className="relative mt-10">
          <ProjectGlobe
            onSelect={handleSelect}
            activeCode={selected?.countryCode ?? null}
          />

          {selected && cardPos && (
            <ProjectDetailsCard
              key={selected.countryCode}
              project={selected}
              position={cardPos}
              onClose={() => setSelected(null)}
            />
          )}
        </div>
      </div>

      <ProjectsShowcase />
    </>
  );
}