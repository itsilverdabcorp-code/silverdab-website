"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { timeline, type TimelineItem } from "./timelineData";
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

const clamp3 = (n: number) => Math.min(Math.max(n, 0), 3);

const AUTOPLAY_MS = 5000; // auto-advance speed
const CLOSING_TEXT = "Still Growing, Still Going....";

export default function TimelineCarousel() {
  const visible = useVisibleCount();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // wrap = sliding forward from "Beyond" into the copy of 2019 (endless loop)
  const [wrap, setWrap] = useState(false);
  // instant = jump without animation (used to swap the copy for the real 2019)
  const [instant, setInstant] = useState(false);
  // becomes true the first time the timeline loops past "Beyond"
  const [looped, setLooped] = useState(false);
  const direction = useRef<1 | -1>(1);
  const touchStartX = useRef<number | null>(null);

  const last = timeline.length - 1;
  const current = timeline[active];

  // Track layout, measured in columns:
  // [copy of Beyond][copy of closing text] 2019 ... Beyond [closing text][copy of 2019]
  const closingSpan = Math.min(2, visible);
  const preCols = timeline.length + closingSpan;
  const cloneCol = preCols + last + 1 + closingSpan;
  const col = wrap ? cloneCol : preCols + active;
  // Position used to work out what is in focus
  const cur = wrap ? last + 1 : active;

  const wrapToStart = useCallback(() => {
    direction.current = 1;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(0);
      return;
    }
    setLooped(true);
    setWrap(true);
    setActive(0);
  }, []);

  // Once the slide into the copy of 2019 has finished, silently swap to the real 2019
  useEffect(() => {
    if (!wrap) return;
    const id = window.setTimeout(() => {
      setInstant(true);
      setWrap(false);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setInstant(false))
      );
    }, 760);
    return () => window.clearTimeout(id);
  }, [wrap]);

  // Auto-advance (loops forever)
  useEffect(() => {
    if (paused || wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setTimeout(() => {
      if (active >= last) {
        wrapToStart();
      } else {
        direction.current = 1;
        setActive(active + 1);
      }
    }, AUTOPLAY_MS);

    return () => clearTimeout(id);
  }, [active, paused, wrap, last, wrapToStart]);

  const goTo = (index: number) => {
    if (wrap) return;
    if (index > last) {
      wrapToStart(); // "next" from Beyond loops to 2019
      return;
    }
    const next = Math.max(index, 0);
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

  const renderYear = (
    item: TimelineItem,
    key: string,
    opts: {
      isActive: boolean;
      dist: number;
      onSelect: () => void;
      hidden?: boolean;
      extendLeft?: boolean;
      extendRight?: boolean;
    }
  ) => {
    const { isActive, dist, onSelect, hidden, extendLeft, extendRight } = opts;

    // Years further from the active one fade a little
    const focusStyle = {
      opacity: [1, 0.9, 0.8, 0.5][dist],
      transition: "opacity 700ms ease",
    };

    return (
      <li
        key={key}
        aria-hidden={hidden || undefined}
        className="shrink-0 pr-6"
        style={{ width: `calc(100cqw / ${visible})` }}
        data-ghost={!looped && key.startsWith("pre-") ? "true" : undefined}
      >
        <p className="text-lg text-white" style={focusStyle}>
          {item.year}
        </p>

        <div className="relative mt-3 -mr-6 h-4">
          {extendLeft && (
            <span className="absolute right-full top-1/2 h-px w-screen -translate-y-1/2 bg-sky-500/60" />
          )}
          {extendRight && (
            <span className="absolute left-full top-1/2 h-px w-screen -translate-y-1/2 bg-sky-500/60" />
          )}
          <span
            className={`absolute inset-x-0 top-1/2 h-px -translate-y-1/2 transition-all duration-500 ${
              isActive
                ? "bg-sky-300 shadow-[0_0_8px_1px_rgba(56,189,248,0.7)]"
                : "bg-sky-500/60"
            }`}
          />
          <button
            type="button"
            onClick={onSelect}
            tabIndex={hidden ? -1 : undefined}
            aria-label={`Go to ${item.year}: ${item.label}`}
            aria-current={isActive}
            className={`relative block size-4 rounded-full transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              isActive
                ? "bg-sky-300 shadow-[0_0_12px_2px_rgba(125,211,252,0.6)]"
                : "bg-[#1e8bb5] hover:bg-sky-400"
            }`}
          />
        </div>

        <div
          className="mt-8 w-full max-w-[220px] overflow-hidden rounded-lg"
          style={focusStyle}
        >
          <Image
            src={item.image}
            alt={item.events[0].title}
            width={0}
            height={0}
            sizes="220px"
            className="block h-auto w-full"
          />
        </div>

        <div className="mt-6 max-w-[220px] space-y-6" style={focusStyle}>
          {item.events.map((event) => (
            <div key={event.title}>
              <h3 className="text-lg font-normal text-white">{event.title}</h3>
              <p className="mt-1 text-sm leading-snug text-zinc-300">
                {event.text}
              </p>
            </div>
          ))}
        </div>
      </li>
    );
  };

  const renderClosing = (
    key: string,
    dist: number,
    shine: boolean,
    hidden: boolean
  ) => (
    <li
      key={key}
      aria-hidden={hidden || undefined}
      className="shrink-0 pr-6"
      style={{ width: `calc(100cqw / ${visible} * ${closingSpan})` }}
      data-ghost={!looped && key.startsWith("pre-") ? "true" : undefined}
    >
      {/* Invisible spacer so the line lines up with the year columns */}
      <p className="invisible text-lg" aria-hidden="true">
        &nbsp;
      </p>
      <div className="relative mt-3 -mr-6 h-4">
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-sky-500/60" />
      </div>

      <div
        className="mt-8 flex min-h-[137px] items-center"
        style={{
          opacity: [1, 0.9, 0.8, 0.5][dist],
          transition: "opacity 700ms ease",
        }}
      >
        <p
          className={`${
            shine ? "tl-closing-shine" : "tl-closing-static"
          } w-fit max-w-full bg-clip-text text-3xl font-medium leading-tight text-transparent sm:text-4xl`}
        >
          {CLOSING_TEXT}
        </p>
      </div>
    </li>
  );

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

        @keyframes tl-year-tick {
          from { opacity: 0.3; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tl-year-tick { animation: tl-year-tick 260ms ease-out both; }

        @keyframes tl-fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tl-heading-line {
          animation: tl-fade-up 800ms cubic-bezier(0.22, 1, 0.36, 1) 100ms both;
        }

        @keyframes tl-year-slide {
          from { opacity: 0; transform: translateX(-48px); }
          to   { opacity: 1; transform: none; }
        }
        .tl-year-intro {
          animation: tl-year-slide 900ms cubic-bezier(0.22, 1, 0.36, 1) 1700ms both;
        }

        @keyframes tl-enter {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: none; }
        }
        .tl-enter {
          animation: tl-enter 800ms cubic-bezier(0.22, 1, 0.36, 1) 100ms both;
        }

        @keyframes tl-shine {
          from { background-position: 100% 0, 0 0; }
          to   { background-position: 0% 0, 0 0; }
        }
        .tl-shine-text {
          background-image:
            linear-gradient(90deg, transparent 0%, transparent 55%, rgba(190, 235, 255, 0.95) 60%, #12365f 64%, #12365f 100%),
            linear-gradient(90deg, #1f5bb0 0%, #38b6d8 100%);
          background-size: 300% 100%, 100% 100%;
          background-repeat: no-repeat;
          background-position: 0% 0, 0 0;
          animation:
            tl-fade-up 800ms cubic-bezier(0.22, 1, 0.36, 1) 900ms both,
            tl-shine 2000ms cubic-bezier(0.45, 0, 0.25, 1) 700ms both;
        }

        /* Closing text after "Beyond": normal gradient, or the one-time shine */
        .tl-closing-static {
          background-image: linear-gradient(90deg, #38b6d8 0%, #1f5bb0 100%);
        }
        .tl-closing-shine {
          background-image:
            linear-gradient(90deg, transparent 0%, transparent 55%, rgba(190, 235, 255, 0.95) 60%, #12365f 64%, #12365f 100%),
            linear-gradient(90deg, #38b6d8 0%, #1f5bb0 100%);
          background-size: 300% 100%, 100% 100%;
          background-repeat: no-repeat;
          background-position: 0% 0, 0 0;
          animation: tl-shine 2000ms cubic-bezier(0.45, 0, 0.25, 1) 500ms both;
        }

        /* Copies to the left of 2019 stay invisible until the first loop (the line stays) */
        li[data-ghost="true"] > :not(:nth-child(2)) { visibility: hidden; }
        li[data-ghost="true"] button { visibility: hidden; }

        @media (prefers-reduced-motion: reduce) {
          .tl-year-next, .tl-year-prev, .tl-year-tick,
          .tl-heading-line, .tl-shine-text, .tl-year-intro,
          .tl-enter, .tl-closing-shine { animation: none; }
          .tl-track { transition: none !important; }
        }
      `}</style>

      <div
        className="mx-auto w-full max-w-7xl px-6 sm:px-10"
        style={{ containerType: "inline-size" }}
      >
        {/* Heading + big year + logo */}
        <div className="flex items-start justify-between gap-8">
          <div>
            <h2 className="text-4xl font-medium leading-tight sm:text-5xl">
              <span className="tl-heading-line block">
                See how we&apos;ve come,
              </span>
              <span className="tl-shine-text block bg-clip-text font-semibold italic text-transparent">
                from one bold vision
                <br />
                to a global presence.
              </span>
            </h2>

            <div
              className="tl-year-intro mt-14 border-l-2 border-blue-600 pl-4"
              aria-live="polite"
            >
              <div>
                <p className="text-6xl font-medium leading-none tabular-nums sm:text-7xl">
                  {Number.isNaN(Number(current.year)) ? (
                    <span
                      key={current.year}
                      className="tl-year-tick inline-block"
                    >
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

          <div className="tl-enter relative hidden h-40 w-40 shrink-0 md:block lg:h-56 lg:w-56">
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

        {/* Timeline track (full width, endless loop) */}
        <div
          className="tl-enter mt-16"
          style={{
            marginInline: "calc(50% - 50vw)",
            paddingLeft: "calc(50vw - 50cqw)",
            clipPath: "inset(-24px 0 -24px 0)",
          }}
          onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
          onTouchEnd={handleTouchEnd}
        >
          <ul
            className={`tl-track flex ${
              instant
                ? ""
                : "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            }`}
            style={{
              transform: `translateX(calc(${col} * -100cqw / ${visible}))`,
            }}
          >
            {/* Copies before 2019, so the loop has no visible seam */}
            {timeline.map((item, k) =>
              renderYear(item, `pre-${item.year}`, {
                isActive: false,
                dist: clamp3(Math.abs(k - last - 1 - cur)),
                onSelect: () => goTo(k),
                hidden: true,
                extendLeft: k === 0,
              })
            )}
            {renderClosing(
              "pre-closing",
              clamp3(Math.ceil(Math.abs(-0.5 - cur) - 0.5)),
              false,
              true
            )}

            {/* The real timeline */}
            {timeline.map((item, i) =>
              renderYear(item, item.year, {
                isActive: !wrap && i === active,
                dist: clamp3(Math.abs(i - cur)),
                onSelect: () => goTo(i),
              })
            )}

            {/* Closing text + copy of 2019 that the last slide runs into */}
            {renderClosing(
              "closing",
              clamp3(Math.ceil(Math.abs(last + 0.5 - cur) - 0.5)),
              cur === last,
              false
            )}
            {timeline.map((item, k) =>
              renderYear(item, `post-${item.year}`, {
                isActive: wrap && k === 0,
                dist: clamp3(Math.abs(last + 1 + k - cur)),
                onSelect: () =>
                  k === 0 && active === last ? goTo(last + 1) : goTo(k),
                hidden: true,
                extendRight: k === last,
              })
            )}
          </ul>
        </div>

        {/* Arrows + page dots */}
        <div className="tl-enter mt-14 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={active === 0 || wrap}
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
            disabled={wrap}
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