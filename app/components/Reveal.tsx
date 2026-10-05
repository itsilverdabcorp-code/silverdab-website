"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number; // seconds
  autoPlayVideo?: boolean; // play the <video> inside once the animation ends
};

export default function Reveal({
  children,
  className = "",
  delay = 0,
  autoPlayVideo = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // animate only once
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
      onTransitionEnd={(e) => {
        if (
          autoPlayVideo &&
          visible &&
          e.target === e.currentTarget &&
          e.propertyName === "opacity"
        ) {
          ref.current?.querySelector("video")?.play().catch(() => {});
        }
      }}
    >
      {children}
    </div>
  );
}