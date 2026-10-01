// components/expertise/ExpertiseCarousel.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type IconName =
  | "box"
  | "ruler"
  | "crane"
  | "cone"
  | "clipboard"
  | "clash"
  | "hardhat"
  | "calculator"
  | "gantt"
  | "users"
  | "vr"
  | "video"
  | "handover"
  | "factory"
  | "pin"
  | "wrench"
  | "sofa"
  | "recycle"
  | "training"
  | "book"
  | "support"
  | "certificate";

type ExpertiseItem = { label: string; icon: IconName };

type ExpertiseCard = {
  title: string;
  tagline: string;
  image: string; // path in /public/images/expertise/
  items: ExpertiseItem[];
  columns?: 1 | 2; // defaults to 2
};

const EXPERTISE: ExpertiseCard[] = [
  {
    title: "BIM Modelling",
    tagline: "Where accurate models shape smarter projects.",
    image: "/images/expertise/bim-modelling.jpg",
    items: [
      { label: "2D to 3D Conversion", icon: "box" },
      { label: "Design Modelling & Documentation", icon: "ruler" },
      { label: "Construction Modelling", icon: "crane" },
      { label: "Coordination & Shop Drawings", icon: "cone" },
    ],
  },
  {
    title: "BIM Management",
    tagline: "Managing information. Mastering delivery.",
    image: "/images/expertise/bim-management.jpg",
    items: [
      { label: "Consultancy", icon: "clipboard" },
      { label: "Clash Detection", icon: "clash" },
      { label: "Constructability Reviews", icon: "hardhat" },
      { label: "3D Quantity Takeoff", icon: "calculator" },
      { label: "3D Scheduling", icon: "gantt" },
      { label: "3D Coordination", icon: "users" },
    ],
  },
  {
    title: "BIM Visualization",
    tagline: "Immersive visuals for smarter decisions.",
    image: "/images/expertise/bim-visualization.jpg",
    items: [
      { label: "Virtual Reality", icon: "vr" },
      { label: "Rendering/Walkthrough", icon: "video" },
    ],
    columns: 1,
  },
  {
    title: "BIM Asset Management",
    tagline: "Your digital foundation for long-term asset performance.",
    image: "/images/expertise/bim-asset-management.jpg",
    items: [
      { label: "Digital Handover", icon: "handover" },
      { label: "Asset Tagging & Tracking", icon: "pin" },
      { label: "Space Management & Occupancy", icon: "sofa" },
      { label: "Facility Management Integration", icon: "factory" },
      { label: "Preventive Maintenance Planning", icon: "wrench" },
      { label: "Lifecycle Cost Management", icon: "recycle" },
    ],
  },
  {
    title: "BIM Academy",
    tagline: "Your pathway to certified BIM excellence.",
    image: "/images/expertise/bim-academy.jpg",
    items: [
      { label: "BIM Training", icon: "training" },
      { label: "BIM Support", icon: "support" },
      { label: "BIM Coaching", icon: "book" },
      { label: "BIM ISO 19650 Accreditation", icon: "certificate" },
    ],
    columns: 1,
  },
];

const AUTO_ADVANCE_MS = 5000;

// Inline SVG path data per icon (24x24 grid, Lucide style).
const ICON_PATHS: Record<IconName, React.ReactNode> = {
  // 2D to 3D Conversion: cube
  box: (
    <>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </>
  ),
  // Design Modelling & Documentation: ruler / drafting
  ruler: (
    <>
      <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z" />
      <path d="m14.5 12.5 2-2" />
      <path d="m11.5 9.5 2-2" />
      <path d="m8.5 6.5 2-2" />
      <path d="m17.5 15.5 2-2" />
    </>
  ),
  // Construction Modelling: tower crane
  crane: (
    <>
      <path d="M2 21h20" />
      <path d="M6 21V8" />
      <path d="M2 8h18" />
      <path d="m6 3 4 5" />
      <path d="M6 3 2 8" />
      <path d="M17 8v6" />
      <rect x="15" y="14" width="4" height="3" rx="0.5" />
    </>
  ),
  // Coordination & Shop Drawings: traffic cone
  cone: (
    <>
      <path d="M9.3 6.2 4.5 20h15L14.7 6.2a1 1 0 0 0-.9-.7h-3.6a1 1 0 0 0-.9.7Z" />
      <path d="M8 13.5h8" />
      <path d="M2.5 20h19" />
      <path d="M12 5.5V4" />
    </>
  ),
  // Consultancy: clipboard with list
  clipboard: (
    <>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M8 11h.01" />
      <path d="M12 11h4" />
      <path d="M8 15h.01" />
      <path d="M12 15h4" />
    </>
  ),
  // Clash Detection: two overlapping squares
  clash: (
    <>
      <rect x="3" y="3" width="12" height="12" rx="2" />
      <rect x="9" y="9" width="12" height="12" rx="2" />
    </>
  ),
  // Constructability Reviews: hard hat
  hardhat: (
    <>
      <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2Z" />
      <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" />
      <path d="M4 15v-3a6 6 0 0 1 6-6" />
      <path d="M14 6a6 6 0 0 1 6 6v3" />
    </>
  ),
  // 3D Quantity Takeoff: calculator
  calculator: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 6h8" />
      <path d="M16 14h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M16 18h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M16 10h.01" />
    </>
  ),
  // 3D Scheduling: gantt bars
  gantt: (
    <>
      <path d="M3 3v18h18" />
      <path d="M8 8h6" />
      <path d="M11 12h8" />
      <path d="M8 16h5" />
    </>
  ),
  // 3D Coordination: group of people
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  // Virtual Reality: VR headset
  vr: (
    <>
      <path d="M2 8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4l-2-3h-4l-2 3H4a2 2 0 0 1-2-2Z" />
      <circle cx="7.5" cy="11.5" r="1" />
      <circle cx="16.5" cy="11.5" r="1" />
    </>
  ),
  // Rendering/Walkthrough: video camera
  video: (
    <>
      <path d="m22 8-6 4 6 4V8Z" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </>
  ),
  // Digital Handover: hand holding
  handover: (
    <>
      <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" />
      <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
      <path d="m2 16 6 6" />
      <path d="M16 3.5a2 2 0 0 0-2 2c0 1.2 2 2.5 2 2.5s2-1.3 2-2.5a2 2 0 0 0-2-2Z" />
    </>
  ),
  // Facility Management Integration: factory
  factory: (
    <>
      <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M17 18h1" />
      <path d="M12 18h1" />
      <path d="M7 18h1" />
    </>
  ),
  // Asset Tagging & Tracking: map pin
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  // Preventive Maintenance Planning: wrench
  wrench: (
    <>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
    </>
  ),
  // Space Management & Occupancy: sofa
  sofa: (
    <>
      <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" />
      <path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z" />
      <path d="M4 18v2" />
      <path d="M20 18v2" />
    </>
  ),
  // Lifecycle Cost Management: recycle loop
  recycle: (
    <>
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </>
  ),
  // BIM Training: presenter at a board
  training: (
    <>
      <path d="M2 3h20" />
      <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
      <path d="m7 21 5-5 5 5" />
    </>
  ),
  // BIM Coaching: open book
  book: (
    <>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </>
  ),
  // BIM Support: headset
  support: (
    <>
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </>
  ),
  // BIM ISO 19650 Accreditation: certificate / award
  certificate: (
    <>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </>
  ),
};

function ItemIcon({ name }: { name: IconName }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-zinc-800"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

export default function ExpertiseCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = EXPERTISE.length;

  const goTo = (i: number) => setIndex((i + total) % total);

  // Auto-advance every 5 seconds. The timer resets whenever `index` changes,
  // so clicking an arrow or dot restarts the 5s countdown instead of
  // jumping again right after.
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % total), AUTO_ADVANCE_MS);
    return () => clearTimeout(id);
  }, [index, paused, total]);

  return (
    <section className="w-full overflow-hidden bg-[#F5F6F7] py-20">
      <div
        className="mx-auto w-full max-w-7xl px-10"
        style={{ containerType: "inline-size" }}
      >
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-medium text-black sm:text-5xl">
              Expertise
            </h2>
            <p className="mt-3 text-sm text-zinc-700">
              Five disciplines. One connected process.
            </p>
          </div>

          <Link
            href="/expertise"
            className="text-sm text-sky-600 transition-colors hover:text-sky-700"
          >
            Learn More About Our Expertise &rsaquo;
          </Link>
        </div>

        {/* Carousel viewport */}
        <div
          className="mt-8"
          style={{
            marginInline: "calc(50% - 50vw)",
            paddingLeft: "calc(50vw - 50cqw)",
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="flex gap-6 transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(calc(${index} * -1 * (80cqw + 1.5rem)))`,
            }}
          >
            {EXPERTISE.map((card) => (
              <div key={card.title} className="w-[80cqw] shrink-0">
                <article className="grid h-full min-h-[460px] grid-cols-1 overflow-hidden rounded-2xl bg-white md:grid-cols-[1fr_auto]">
                  <div className="flex flex-col justify-start p-12">
                    <h3 className="text-4xl font-medium text-black sm:text-5xl">
                      {card.title}
                    </h3>
                    <p className="mt-4 max-w-lg text-xl italic text-zinc-800">
                      &ldquo;{card.tagline}&rdquo;
                    </p>

                    <ul
                      className={`mt-8 grid max-w-2xl grid-cols-1 gap-x-10 gap-y-5 ${
                        card.columns === 1 ? "" : "sm:grid-cols-2"
                      }`}
                    >
                      {card.items.map((item) => (
                        <li
                          key={item.label}
                          className="flex items-center gap-3 text-base text-zinc-800"
                        >
                          <ItemIcon name={item.icon} />
                          <span>{item.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="relative m-5 h-72 w-full md:h-auto md:w-[460px]">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(min-width: 768px) 420px, 100vw"
                      className="rounded-xl object-cover"
                    />
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => goTo(index - 1)}
            aria-label="Previous"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 text-xs text-zinc-700 transition-colors hover:bg-zinc-300"
          >
            &lsaquo;
          </button>

          <div className="flex items-center gap-3 rounded-full bg-zinc-200 px-4 py-2">
            {EXPERTISE.map((card, i) => (
              <button
                key={card.title}
                onClick={() => goTo(i)}
                aria-label={`Go to ${card.title}`}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === index ? "bg-zinc-800" : "bg-zinc-400"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => goTo(index + 1)}
            aria-label="Next"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 text-xs text-zinc-700 transition-colors hover:bg-zinc-300"
          >
            &rsaquo;
          </button>
        </div>
      </div>
    </section>
  );
}