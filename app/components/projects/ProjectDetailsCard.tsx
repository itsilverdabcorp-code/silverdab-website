// components/projects/ProjectDetailsCard.tsx
"use client";

import type { Project } from "../../data/projects";

type Props = {
  project: Project;
  position: { x: number; y: number };
  onClose: () => void;
};

export default function ProjectDetailsCard({ project, position, onClose }: Props) {
  const cardWidth = 320;
  const offset = 20;

  // Flip to the left side of the click if it would overflow the right edge
  const wouldOverflowRight =
    typeof window !== "undefined" && position.x + offset + cardWidth > window.innerWidth - 24;

  const style: React.CSSProperties = wouldOverflowRight
    ? { right: `calc(100% - ${position.x - offset}px)`, top: position.y }
    : { left: position.x + offset, top: position.y };

  return (
    <div
      style={style}
      className="absolute z-20 w-[320px] rounded-2xl border border-white/10 bg-[#0b1520]/95 p-5 text-white shadow-2xl backdrop-blur"
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-xs text-zinc-300 hover:bg-white/10"
        aria-label="Close"
      >
        ×
      </button>

      <div className="flex items-center gap-2 pr-8">
        <span className="flex h-6 w-8 items-center justify-center rounded-sm bg-white/10 text-[10px] font-bold">
          {project.countryCode}
        </span>
        <h3 className="text-base font-semibold">{project.country}</h3>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-zinc-300">
        <span>📍</span>
        <span>{project.country}</span>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-full bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-400 w-fit">
        🌐 {project.projects.length} PROJECT{project.projects.length > 1 ? "S" : ""}
      </div>

      <ul className="mt-4 space-y-2 text-sm text-zinc-200">
        {project.projects.map((p) => (
          <li key={p} className="flex gap-2">
            <span className="text-sky-400">•</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}