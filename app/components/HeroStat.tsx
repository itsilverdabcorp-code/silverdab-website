"use client";

import { useEffect, useState, type ReactNode } from "react";

const DELAY_MS = 1200; // wait for the buttons to finish, then start
const DURATION_MS = 1800; // how long the count-up / scramble takes
const SCRAMBLE_CHARS = "0123456789";

const randomChar = () =>
  SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];

type Props = {
  /** Number to count up to. Leave out for text like "1st". */
  value?: number;
  suffix?: string;
  /** Text that scrambles through random characters before settling. */
  staticText?: string;
  label: ReactNode;
};

export default function HeroStat({ value, suffix = "", staticText, label }: Props) {
  const [n, setN] = useState(0);
  const [text, setText] = useState(staticText ?? "");

  // Count-up for numbers
  useEffect(() => {
    if (value === undefined) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(value);
      return;
    }

    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / DURATION_MS, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3)))); // ease-out
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const timer = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, DELAY_MS);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [value]);

  // Random-character scramble for text
  useEffect(() => {
    if (staticText === undefined) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let start = 0;
    let last = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / DURATION_MS, 1);
      // change the random characters every ~60ms so they don't blur together
      if (t - last > 60 || p === 1) {
        last = t;
        setText(
          staticText
            .split("")
            .map((c, i) =>
              p >= (i + 1) / staticText.length ? c : randomChar()
            )
            .join("")
        );
      }
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const timer = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, DELAY_MS);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [staticText]);

  return (
    <div className="hero-stat-pop text-left">
      <p className="text-5xl font-medium tabular-nums sm:text-7xl">
        {staticText !== undefined ? (
          // invisible copy reserves the final width so the layout doesn't jump
          <span className="relative inline-block whitespace-nowrap">
            <span className="invisible">{staticText}</span>
            <span className="absolute left-0 top-0">{text}</span>
          </span>
        ) : (
          `${n}${suffix}`
        )}
      </p>
      <p className="mt-1 text-2xl text-zinc-200">{label}</p>
    </div>
  );
}