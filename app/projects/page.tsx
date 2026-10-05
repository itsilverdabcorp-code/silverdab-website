// app/projects/page.tsx
"use client";

import { useState } from "react";
import ProjectsIntro from "../components/projects/ProjectsIntro";
import ProjectGlobe from "../components/projects/ProjectGlobe";


import type { Project } from "../data/projects";
import ProjectDetailsCard from "../components/projects/ProjectDetailsCard";
import ProjectsShowcase from "../components/projects/ProjectsShowcase";
import ClientLogos from "../components/clients/ClientLogos"; // adjust to where your ClientLogos file is
import Reveal from "../components/Reveal";
import Link from "next/link";





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

      <ClientLogos />

      {/* Let's Build Something Together */}
      <section className="w-full bg-white pb-24">
        <div className="mx-auto w-full max-w-7xl px-10">
        <Reveal>
          <div className="flex w-full flex-col items-center gap-5 rounded-xl bg-[#F5F6F7] px-6 py-20 text-center">
            <h2 className="text-4xl font-medium text-black sm:text-5xl">
              Let&apos;s Build Something Together
            </h2>

            <p className="text-xl text-zinc-900 sm:text-2xl">
              Have a project in mind? We&apos;re ready to bring it to life.
            </p>

            <Link
              href="/contact"
              className="mt-3 rounded-full bg-[#35A2CA] px-8 py-3 text-lg font-normal text-white transition-colors hover:bg-[#2b8aae]"
            >
              Let&apos;s Connect
            </Link>
          </div>
        </Reveal>
        </div>
      </section>
    </>
  );
}