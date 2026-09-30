"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { timeline } from "./timelineData";
import CountUp from "./CountUp";

/** How many timeline columns fit on screen at the current width. */
function useVisibleCount() {
  const [count, setCount] = useState(4);

  useEffect(() => {
    const md = window.matchMedia("(min-width: 768px)");
    const lg = window.matchMedia("(min-width: 1024px)");
    const update = () => setCount(lg.matches ? 4 : md.matches ? 2 : 1);
    update();
    md.addEventListener("change", update);
    lg.addEventListener("change", update);
    return () => {
      md.removeEventListener("change", update);
      lg.removeEventListener("change", update);
    };
  }, []);

  return count;
}

export default function TimelineCarousel() {
  const visible = useVisibleCount();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const direction = useRef<1 | -1>(1);
  const touchStartX = useRef<number | null>(null);

  const last = timeline.length - 1;
  const maxOffset = Math.max(0, timeline.length - visible);
  const offset = Math.min(active, maxOffset);
  const current = timeline[active];



  // Auto-advance every 5 seconds (change AUTOPLAY_MS to adjust the speed)
  const AUTOPLAY_MS = 5000;
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setTimeout(() => {
      direction.current = 1;
      setActive((a) => (a >= last ? 0 : a + 1));
    }, AUTOPLAY_MS);

    return () => clearTimeout(id);
  }, [active, paused, last]);

  const goTo = (index: number) => {
    const next = Math.min(Math.max(index, 0), last);
    if (next === active) return;
    direction.current = next > active ? 1 : -1;
    setActive(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") goTo(active + 1);
    if (e.key === "ArrowLeft") goTo(active - 1);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(diff) > 50) goTo(active + (diff < 0 ? 1 : -1));
  };

  return (
    <section
      className="w-full overflow-hidden bg-[#0a1b2e] py-20 text-white"
      aria-roledescription="carousel"
      aria-label="Silverdab company timeline"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <style>{`
        @keyframes tl-year-next {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tl-year-prev {
          from { opacity: 0; transform: translateY(-32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tl-year-next { animation: tl-year-next 600ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        .tl-year-prev { animation: tl-year-prev 600ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        .tl-label-delay { animation-delay: 90ms; }
        @keyframes tl-year-tick {
          from { opacity: 0.3; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tl-year-tick { animation: tl-year-tick 260ms ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .tl-year-tick { animation: none; }
        }
        @keyframes tl-gradient-flow {
          from { background-position: 0% 0; }
          to   { background-position: 200% 0; }
        }
        .tl-gradient-text {
          background-image: linear-gradient(90deg, #38b6d8 0%, #1f5bb0 50%, #38b6d8 100%);
          background-size: 200% 100%;
          animation: tl-gradient-flow 6s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .tl-year-next, .tl-year-prev, .tl-gradient-text { animation: none; }
          .tl-track { transition: none !important; }
        }
      `}</style>

      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        {/* Heading + big year + logo */}
        <div className="flex items-start justify-between gap-8">
          <div>
            <h2 className="text-4xl font-medium leading-tight sm:text-5xl">
              See how we&apos;ve come,
              <span className="tl-gradient-text block bg-clip-text font-semibold italic text-transparent">
                from one bold vision
                <br />
                to a global presence.
              </span>
            </h2>

            <div className="mt-14 border-l-2 border-blue-600 pl-4" aria-live="polite">
              <div>
                <p className="text-6xl font-normal leading-none tabular-nums sm:text-7xl">
                  {Number.isNaN(Number(current.year)) ? (
                    <span key={current.year} className="tl-year-tick inline-block">
                      {current.year}
                    </span>
                  ) : (
                    <CountUp value={Number(current.year)} duration={1} />
                  )}
                </p>
                <p
                  key={active}
                  className={`mt-1 text-lg text-zinc-200 ${
                    direction.current === 1 ? "tl-year-next" : "tl-year-prev"
                  }`}
                >
                  {current.label}
                </p>
              </div>
            </div>
          </div>

          <div className="relative hidden h-40 w-40 shrink-0 md:block lg:h-56 lg:w-56">
            <Image
              src="/images/silverdab-logo.png"
              alt="Silverdab logo mark"
              fill
              sizes="224px"
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Timeline track */}
        <div
          className="mt-16"
          style={{ clipPath: "inset(-24px 0 -24px -24px)" }}
          onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
          onTouchEnd={handleTouchEnd}
        >
          <ul
            className="tl-track flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: `translateX(-${(offset * 100) / visible}%)`,
            }}
          >
            {timeline.map((item, i) => {
              const isActive = i === active;
              return (
                <li
                  key={item.year}
                  className="shrink-0 pr-6"
                  style={{ width: `${100 / visible}%` }}
                >
                  <p className="text-lg text-white">{item.year}</p>

                  <div className="relative mt-3 -mr-6 h-4">
                    <span
                      className={`absolute inset-x-0 top-1/2 h-px -translate-y-1/2 transition-all duration-500 ${
                        isActive
                          ? "bg-sky-300 shadow-[0_0_8px_1px_rgba(56,189,248,0.7)]"
                          : "bg-sky-500/60"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`Go to ${item.year}: ${item.label}`}
                      aria-current={isActive}
                      className={`relative block size-4 rounded-full transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                        isActive
                          ? "bg-sky-300 shadow-[0_0_12px_2px_rgba(125,211,252,0.6)]"
                          : "bg-[#1e8bb5] hover:bg-sky-400"
                      }`}
                    />
                  </div>

                  <div className="mt-8 w-full max-w-[220px] overflow-hidden rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.events[0].title}
                      width={0}
                      height={0}
                      sizes="220px"
                      className="block h-auto w-full"
                    />
                  </div>

                  <div className="mt-6 max-w-[220px] space-y-6">
                    {item.events.map((event) => (
                      <div key={event.title}>
                        <h3 className="text-lg font-normal text-white">
                          {event.title}
                        </h3>
                        <p className="mt-1 text-sm leading-snug text-zinc-300">
                          {event.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Arrows + page dots */}
        <div className="mt-14 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label="Previous year"
            className="grid size-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ChevronIcon direction="left" />
          </button>

          <div className="flex items-center gap-3.5 rounded-full bg-white/10 px-5 py-3">
            {timeline.map((item, i) => (
              <button
                key={item.year}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Page ${i + 1}: ${item.year}`}
                aria-current={i === active}
                className={`h-2 rounded-full transition-all duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  i === active ? "w-5 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(active + 1)}
            disabled={active === last}
            aria-label="Next year"
            className="grid size-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>
    </section>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"} />
    </svg>
  );
}
