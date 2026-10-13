"use client";

import { useEffect, useState } from "react";

type Props = {
  value: number;
  suffix?: string;
  delay?: number; // ms before counting starts
  duration?: number; // ms the count takes
};

export default function CountNumber({
  value,
  suffix = "",
  delay = 100,
  duration = 1800,
}: Props) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(value);
      return;
    }

    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3)))); // ease-out
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const timer = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [value, delay, duration]);

  return (
    <>
      {n}
      {suffix}
    </>
  );
}