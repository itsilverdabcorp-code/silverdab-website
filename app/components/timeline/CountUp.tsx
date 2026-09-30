"use client";

import { useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

type CountUpProps = {
  /** The number to show. When it changes, the display counts to the new value. */
  value: number;
  /** Roughly how long the count takes, in seconds. */
  duration?: number;
  className?: string;
};

/**
 * Counter with a rolling-digit animation: when a digit changes, the old digit
 * scrolls up and out while the new one scrolls up into its place.
 * Counting down reverses the direction.
 */
export default function CountUp({
  value,
  duration = 1,
  className = "",
}: CountUpProps) {
  const [shown, setShown] = useState<{ n: number; dir: 1 | -1 }>({
    n: value,
    dir: 1,
  });

  const motionValue = useMotionValue(value);
  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);
  const springValue = useSpring(motionValue, { damping, stiffness });

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      const n = Math.round(latest);
      setShown((s) => (s.n === n ? s : { n, dir: n > s.n ? 1 : -1 }));
    });
    return () => unsubscribe();
  }, [springValue]);

  const digits = String(shown.n).split("");

  return (
    <span className={className}>
      <style>{`
        @keyframes cu-in-up   { from { transform: translateY(100%);  opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes cu-out-up  { from { transform: translateY(0);     opacity: 1; } to { transform: translateY(-100%); opacity: 0; } }
        @keyframes cu-in-down { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes cu-out-down{ from { transform: translateY(0);     opacity: 1; } to { transform: translateY(100%);  opacity: 0; } }
        .cu-in-up    { animation: cu-in-up    300ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        .cu-out-up   { animation: cu-out-up   300ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        .cu-in-down  { animation: cu-in-down  300ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        .cu-out-down { animation: cu-out-down 300ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .cu-in-up, .cu-in-down { animation: none; }
          .cu-out-up, .cu-out-down { display: none; }
        }
      `}</style>

      <span className="sr-only">{value}</span>
      <span aria-hidden="true">
        {digits.map((char, i) => (
          // Key by place value (counted from the right) so each column keeps its own state
          <Digit key={digits.length - i} char={char} dir={shown.dir} />
        ))}
      </span>
    </span>
  );
}

function Digit({ char, dir }: { char: string; dir: 1 | -1 }) {
  const [s, setS] = useState<{ cur: string; prev: string | null; n: number }>({
    cur: char,
    prev: null,
    n: 0,
  });

  // The digit changed: keep the old one around so it can scroll out
  if (s.cur !== char) {
    setS({ cur: char, prev: s.cur, n: s.n + 1 });
  }

  const way = dir === 1 ? "up" : "down";

  return (
    <span className="relative inline-block overflow-hidden">
      <span
        key={`in-${s.n}`}
        className={`inline-block ${s.n > 0 ? `cu-in-${way}` : ""}`}
      >
        {s.cur}
      </span>
      {s.prev !== null && (
        <span
          key={`out-${s.n}`}
          className={`absolute inset-0 cu-out-${way}`}
          onAnimationEnd={() => setS((x) => ({ ...x, prev: null }))}
        >
          {s.prev}
        </span>
      )}
    </span>
  );
}