"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Reveal from "../Reveal";

type ServiceCard = {
  title: string;
  description: string;
  image: string; // path in /public/images/services/
};

const SERVICES: ServiceCard[] = [
  {
    title: "BIM in Modeling & Documentation",
    description:
      "Our BIM Modeling and Documentation services deliver intelligent, data-rich 3D models that support every stage of the project lifecycle, from design through construction and facility management. Using industry-leading platforms, we produce accurate drawings, schedules, and documentation directly from coordinated models, minimizing rework and ensuring standards-compliant delivery.",
    image: "/images/services/modeling-documentation.png",
  },
  {
    title: "BIM in Interior Design",
    description:
      "BIM enhances interior design by enabling detailed, coordinated 3D models of every interior element, including walls, ceilings, flooring, fixtures, and finishes. Our team visualizes layouts, materials, and design options while accurately managing dimensions and specifications, giving clients clarity before construction begins.",
    image: "/images/services/interior-design.png",
  },
  {
    title: "BIM in Structural Design",
    description:
      "We develop accurate, coordinated 3D models of structural elements such as foundations, columns, beams, and framing systems, integrated with structural analysis and design workflows. This improves clash detection, quantity extraction, and coordination with architectural and MEP disciplines, reducing conflicts and improving construction documentation.",
    image: "/images/services/structural-design.png",
  },
  {
    title: "BIM in Parametric Families",
    description:
      "We develop intelligent, reusable building components that automatically adjust based on defined parameters, including dimensions, materials, types, and performance requirements. This improves modeling efficiency, consistency, and accuracy, allowing teams to quickly modify and reuse components across projects.",
    image: "/images/services/parametric-families.png",
  },
  {
    title: "BIM in Rendering and Visualization",
    description:
      "Our BIM Rendering and Visualization services transform intelligent 3D models into compelling visual experiences that enhance design communication and decision-making. From photorealistic renderings to immersive walkthroughs, we bring design intent to life before construction begins, helping stakeholders review, approve, and understand projects faster.",
    image: "/images/services/rendering-visualization.png",
  },
];

const AUTO_ADVANCE_MS = 5000;

export default function ServicesCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Only run the auto-advance while the carousel is on screen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const total = SERVICES.length;

  const goTo = (i: number) => setIndex((i + total) % total);

  // Auto-advance every 5 seconds. The timer resets whenever `index` changes,
  // so clicking an arrow or dot restarts the countdown.
  useEffect(() => {
    if (paused || !inView) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % total), AUTO_ADVANCE_MS);
    return () => clearTimeout(id);
  }, [index, paused, inView, total]);

  return (
    <section id="services" className="w-full overflow-hidden bg-white py-20">
      <div
        className="mx-auto w-full max-w-7xl px-10"
        style={{ containerType: "inline-size" }}
      >
        <Reveal>
        <div>
          <h2 className="text-4xl font-medium text-black sm:text-5xl">
            Our Services
          </h2>
          <p className="mt-3 text-xl text-zinc-700">
            Specialized applications within BIM Modelling, built for precision
            at every scale.
          </p>
        </div>
        </Reveal>

        {/* Carousel viewport (bleeds to the right edge of the screen) */}
        <Reveal delay={0.2}>
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
            {SERVICES.map((card) => (
              <div key={card.title} className="w-[80cqw] shrink-0">
                <article className="grid h-full min-h-[460px] grid-cols-1 overflow-hidden rounded-2xl bg-[#F0F0F0] md:grid-cols-[1fr_auto]">
                  <div className="flex flex-col justify-start p-10">
                    <h3 className="max-w-md text-2xl font-medium text-black sm:text-3xl">
                      {card.title}
                    </h3>
                    <p className="mt-5 max-w-xl text-base leading-snug text-zinc-800">
                      {card.description}
                    </p>
                  </div>

                  <div className="relative h-72 w-full md:h-auto md:w-[520px]">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(min-width: 768px) 520px, 100vw"
                      className="origin-right scale-110 object-contain object-right"
                    />
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
        </Reveal>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => goTo(index - 1)}
              aria-label="Previous"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8e8ed] text-[#1d1d1f] transition-colors hover:bg-[#d2d2d7]"
            >
              <svg width="9" height="14" viewBox="0 0 9 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7.5 1.5 2 7l5.5 5.5" />
              </svg>
            </button>

            <div className="flex h-9 items-center gap-[15px] rounded-full bg-[#e8e8ed] px-7">
              {SERVICES.map((card, i) => (
                <button
                  key={card.title}
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${card.title}`}
                  className={`size-[9px] rounded-full transition-colors duration-300 ${
                    i === index ? "bg-[#1d1d1f]" : "bg-[#86868b] hover:bg-[#6e6e73]"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => goTo(index + 1)}
              aria-label="Next"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8e8ed] text-[#1d1d1f] transition-colors hover:bg-[#d2d2d7]"
            >
              <svg width="9" height="14" viewBox="0 0 9 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1.5 1.5 7 7l-5.5 5.5" />
              </svg>
            </button>
          </div>
      </div>
    </section>
  );
}