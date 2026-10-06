"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// ---- Easy settings -------------------------------------------------------
const LOGO_SRC = "/images/bsi-kitemark.png"; // your BSI logo in /public/images
const CERTIFICATE_URL = encodeURI(
  "/Silverdab Corporation's BSI Kitemark ISO 19650 Certificate - KM 777798 - 001.pdf"
);
const DELAY_TO_SLIDE_MS = 1400; // pause after the text pops out, before it slides
const DELAY_TO_BUTTON_MS = 1400; // pause after the slide, before the button shows
// --------------------------------------------------------------------------

const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export default function KitemarkSection() {
  const ref = useRef<HTMLElement>(null);
  const started = useRef(false);
  // 0 = hidden, 1 = text popped out, 2 = slid right + logo in, 3 = button shown
  const [stage, setStage] = useState(0);
  const [showCert, setShowCert] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let timers: number[] = [];
    const clearTimers = () => {
      timers.forEach((t) => window.clearTimeout(t));
      timers = [];
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.4) {
          if (started.current) return;
          started.current = true;
          if (reduceMotion) {
            setStage(3);
            return;
          }
          setStage(1);
          timers.push(
            window.setTimeout(() => setStage(2), DELAY_TO_SLIDE_MS),
            window.setTimeout(
              () => setStage(3),
              DELAY_TO_SLIDE_MS + DELAY_TO_BUTTON_MS
            )
          );
        }
      },
      { threshold: [0, 0.4] }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimers();
    };
  }, []);

  // Popup: close on Escape and lock page scroll while it's open
  useEffect(() => {
    if (!showCert) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowCert(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [showCert]);

  const aligned = stage >= 2;

  // Each text line is centered at first, then slides to the left edge
  const line = `relative w-fit transition-all duration-1000 ${ease} ${
    aligned ? "left-0 translate-x-0" : "left-1/2 -translate-x-1/2"
  }`;

  return (
    <section
      ref={ref}
      className="flex min-h-[40vh] w-full items-center justify-center bg-white px-6 py-28"
    >
      <div className="flex flex-col items-center md:flex-row md:items-center">
        {/* Logo + button: hidden at first, opens up and slides in from the left */}
        <div
          className={`overflow-hidden transition-all duration-1000 ${ease} ${
            aligned
              ? "max-h-[420px] opacity-100 md:max-w-[340px]"
              : "max-h-0 opacity-0 md:max-h-[420px] md:max-w-0"
          }`}
        >
          <div
            className={`flex flex-col items-center pb-8 transition-transform duration-1000 md:pb-0 md:pr-12 ${ease} ${
              aligned ? "translate-x-0" : "-translate-x-10"
            }`}
          >
            <Image
              src={LOGO_SRC}
              alt="BSI Kitemark, BIM Design and Construction"
              width={220}
              height={220}
              className="h-auto w-[220px]"
            />

            <button
              type="button"
              onClick={() => setShowCert(true)}
              aria-hidden={stage < 3}
              tabIndex={stage >= 3 ? 0 : -1}
              className={`mt-3 rounded-full px-3.5 py-1 text-xs font-medium text-sky-600 transition-all duration-700 hover:bg-sky-500 hover:text-white ${
                stage >= 3
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-3 opacity-0"
              }`}
            >
              View Certificate
            </button>
          </div>
        </div>

        {/* Text: pops out first, then slides right as the logo opens up */}
        <div
          className={`max-w-full transition-all duration-700 ease-out ${
            stage >= 1 ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        >
          <h2 className="text-3xl font-medium leading-tight text-black sm:text-4xl lg:text-[2.75rem]">
            <span className={`block ${line}`}>
              BSI Kitemark&trade; ISO 19650 Certified
            </span>
            <span className={`mt-2 block ${line}`}>
              First in the{" "}
              <span
                className="bg-clip-text font-semibold text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, #4cc2ec 0%, #1c6fb0 100%)",
                }}
              >
                Philippines
              </span>
            </span>
          </h2>

          <p
            className={`mt-3 text-sm italic text-zinc-800 sm:text-base ${line}`}
          >
            Setting the standard for BIM excellence.
          </p>
        </div>
      </div>

      {showCert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="BSI Kitemark ISO 19650 Certificate"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowCert(false)}
        >
          <div
            className="flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-2">
              <p className="text-sm font-medium text-zinc-800">
                BSI Kitemark ISO 19650 Certificate
              </p>
              <button
                type="button"
                onClick={() => setShowCert(false)}
                aria-label="Close certificate"
                className="grid size-8 place-items-center rounded-full text-zinc-600 hover:bg-zinc-100"
              >
                ✕
              </button>
            </div>
            <iframe
              src={CERTIFICATE_URL}
              title="BSI Kitemark ISO 19650 Certificate"
              className="w-full flex-1"
            />
          </div>
        </div>
      )}
    </section>
  );
}