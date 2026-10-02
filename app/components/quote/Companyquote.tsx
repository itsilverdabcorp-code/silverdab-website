"use client";

import { useEffect, useRef, useState } from "react";

// ---- Easy settings -------------------------------------------------------
const DURATION_MS = 800; // how long each piece takes to slide in
const STEP_MS = 220; // gap between the quote, each paragraph and the signature
// --------------------------------------------------------------------------

const CSS = `
  .cq-rise {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity ${DURATION_MS}ms ease var(--d, 0ms),
                transform ${DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms);
  }
  .cq-shown .cq-rise { opacity: 1; transform: none; }
  @media (prefers-reduced-motion: reduce) {
    .cq-rise { transition: none; }
  }
`;

const step = (i: number) => ({ "--d": `${i * STEP_MS}ms` }) as React.CSSProperties;

export default function CompanyQuote() {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  // Play once, when the section scrolls into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`w-full bg-white px-6 py-16 md:py-24 ${shown ? "cq-shown" : ""}`}
      aria-label="Company statement"
    >
      <style>{CSS}</style>

      <div className="mx-auto flex max-w-[1040px] flex-col items-center text-center text-zinc-900">
        <blockquote
          className="cq-rise max-w-[980px] text-balance text-[28px] font-medium leading-[1.25] md:text-[32px] lg:text-[40px]"
          style={step(0)}
        >
          &ldquo;Effective communication and collaboration is the company&rsquo;s core attribute to
          achieve its goal.&rdquo;
        </blockquote>

        <p
          className="cq-rise mt-10 w-full max-w-[980px] text-[14.5px] leading-[1.35] text-zinc-800 md:text-[length:min(1.382vw,16.58px)]"
          style={step(1)}
        >
          Silverdab Corporation, since its foundation, was established with the vision to provide
          BIM support services that presents innovative solutions and fosters inclusive and
          trustworthy stakeholder community.
        </p>

        <p
          className="cq-rise mt-6 w-full max-w-[980px] text-[14.5px] leading-[1.35] text-zinc-800 md:text-[length:min(1.382vw,16.58px)]"
          style={step(2)}
        >
          Silverdab Corporation&rsquo;s commitment, through our purpose, to improve society by
          considering social outcomes in all that we do, focusing on excellence and digital
          innovation, is demonstrated by our ongoing improvement of built environment standards.
        </p>

        <p
          className="cq-rise mt-8 text-[14.5px] text-zinc-800 md:text-[length:min(1.382vw,16.58px)]"
          style={step(3)}
        >
          - Silverdab Corporation President / BIM Director -
        </p>
      </div>
    </section>
  );
}