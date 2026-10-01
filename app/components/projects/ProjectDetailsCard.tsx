"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Project, ProjectItem } from "../../data/projects";

type Props = {
  project: Project;
  position: { x: number; y: number };
  onClose: () => void;
};

type Media = { type: "video" | "image"; src: string };

const CARD_W = 300;
const CARD_H = 470;
const PEEK = 60; // space on the right for the stacked cards behind
const MEDIA_H = 200;

// Flag files in public/images/flags/
const FLAGS: Record<string, string> = {
  KH: "/images/flags/cambodia.jpg",
  VN: "/images/flags/vietnam.png",
  MN: "/images/flags/mongolia.jpg",
  KE: "/images/flags/kenya.png",
  JP: "/images/flags/japan.jpg",
  EG: "/images/flags/egypt.jpg",
  PH: "/images/flags/ph.jpg",
  SG: "/images/flags/singapore.jpg",
  TL: "/images/flags/timor.jpg",
  ID: "/images/flags/indonesia.png",
  AE: "/images/flags/dubai.png",
  BR: "/images/flags/brazil.jpg",
  SA: "/images/flags/saudi.png",
};

// ---- Find out which file each project has --------------------------------
// Looks for  <project folder>/video.mp4  first, then  <project folder>/image.jpg.
// The folder comes from the project's `video` path in data/projects.ts.
// A project with neither file gets no card.
const mediaCache = new Map<string, Media | null>();
const IMAGE_FILES = ["image.jpg", "image.jpeg", "image.png", "image.webp"];

async function fileExists(url: string, mimePrefix: string) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok && (res.headers.get("content-type") ?? "").startsWith(mimePrefix);
  } catch {
    return false;
  }
}

async function findMedia(item: ProjectItem): Promise<Media | null> {
  if (!item.video) return null;
  const cached = mediaCache.get(item.video);
  if (cached !== undefined) return cached;

  const folder = item.video.replace(/\/[^/]*$/, "");
  let result: Media | null = null;
  if (await fileExists(item.video, "video/")) {
    result = { type: "video", src: item.video };
  } else {
    for (const file of IMAGE_FILES) {
      if (await fileExists(`${folder}/${file}`, "image/")) {
        result = { type: "image", src: `${folder}/${file}` };
        break;
      }
    }
  }
  mediaCache.set(item.video, result);
  return result;
}

// ---- Pieces ---------------------------------------------------------------
function VideoThumb({ src, active }: { src: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) v.play().catch(() => {});
    else v.pause();
  }, [active]);
  return (
    <video
      ref={ref}
      src={`${src}#t=0.1`}
      muted
      loop
      playsInline
      preload="metadata"
      className="w-full object-cover"
      style={{ height: MEDIA_H }}
    />
  );
}

type CardData =
  | { kind: "flag" }
  | { kind: "project"; item: ProjectItem; media: Media };

export default function ProjectDetailsCard({ project, position, onClose }: Props) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startXRef = useRef(0);
  const [media, setMedia] = useState<Record<string, Media | null>>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const closingRef = useRef(false);
  const timerRef = useRef<number | undefined>(undefined);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ANIM_MS = reduceMotion ? 0 : 220;

  // Enter: start hidden, then fade/scale in
  useEffect(() => {
    let id2 = 0;
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => setShown(true));
    });
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
      window.clearTimeout(timerRef.current);
    };
  }, []);

  // Exit: fade/scale out, then tell the page to remove the card
  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setShown(false);
    timerRef.current = window.setTimeout(() => onCloseRef.current(), ANIM_MS);
  }, [ANIM_MS]);

  // Close when clicking outside the card, or pressing Esc
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) requestClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [requestClose]);

  const items: ProjectItem[] = useMemo(
    () => project.projects.map((p) => (typeof p === "string" ? { name: p } : p)),
    [project]
  );

  useEffect(() => {
    let cancelled = false;
    Promise.all(items.map(async (it) => [it.name, await findMedia(it)] as const)).then(
      (entries) => {
        if (!cancelled) setMedia(Object.fromEntries(entries));
      }
    );
    return () => {
      cancelled = true;
    };
  }, [items]);

  // Card 1 = flag + list of every project. Then one card per project that has a video or image.
  const cards: CardData[] = [{ kind: "flag" }];
  for (const item of items) {
    const m = media[item.name];
    if (m) cards.push({ kind: "project", item, media: m });
  }

  const SWIPE = 50; // how far (px) you must drag to change card

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (cards.length < 2) return;
    startXRef.current = e.clientX;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    let dx = e.clientX - startXRef.current;
    // pull back a little when there is no card in that direction
    if ((index === 0 && dx > 0) || (index === cards.length - 1 && dx < 0)) dx *= 0.25;
    setDragX(dx);
  };

  const onUp = () => {
    if (!dragging) return;
    if (dragX < -SWIPE) setIndex((i) => Math.min(i + 1, cards.length - 1));
    else if (dragX > SWIPE) setIndex((i) => Math.max(i - 1, 0));
    setDragging(false);
    setDragX(0);
  };

  const totalW = CARD_W + PEEK;
  const offset = 20;
  const wouldOverflowRight =
    typeof window !== "undefined" &&
    position.x + offset + totalW > window.innerWidth - 24;

  const style: React.CSSProperties = {
    width: totalW,
    top: Math.max(position.y, CARD_H / 2 + 8),
    transform: shown
      ? "translateY(-50%)"
      : `translateY(-50%) translateX(${wouldOverflowRight ? 16 : -16}px) scale(0.92)`,
    transformOrigin: wouldOverflowRight ? "right center" : "left center",
    opacity: shown ? 1 : 0,
    transition: `opacity ${ANIM_MS}ms ease, transform ${ANIM_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
    pointerEvents: shown ? undefined : "none",
    ...(wouldOverflowRight
      ? { right: `calc(100% - ${position.x - offset}px)` }
      : { left: position.x + offset }),
  };

  const flagSrc = FLAGS[project.countryCode] ?? "/images/flags/flag.png";

  return (
    <div ref={rootRef} style={style} className="absolute z-20">
      <button
        onClick={requestClose}
        className="absolute -top-3 right-0 z-50 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-sm text-white shadow hover:bg-zinc-700"
        aria-label="Close"
      >
        ×
      </button>

      {/* Stack */}
      <div
        className="relative select-none"
        style={{
          height: CARD_H,
          width: totalW,
          cursor: dragging ? "grabbing" : "grab",
          touchAction: "pan-y",
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onDragStart={(e) => e.preventDefault()}
      >
        {cards.map((card, i) => {
          const rel = i - index;
          const hidden = rel < 0 || rel > 2;
          return (
            <div
              key={card.kind === "flag" ? "flag" : card.item.name}
              aria-hidden={rel !== 0}
              style={{
                width: CARD_W,
                height: CARD_H,
                zIndex: 10 - Math.abs(rel),
                opacity: hidden ? 0 : 1,
                pointerEvents: rel === 0 ? "auto" : "none",
                transform: hidden
                  ? `translateX(${rel < 0 ? -30 : 60}px) scale(0.9)`
                  : `translateX(${rel * 28 + (rel === 0 ? dragX : 0)}px) scale(${1 - rel * 0.05})`,
                transition: dragging ? "none" : undefined,
                transformOrigin: "left center",
                filter: rel > 0 ? `brightness(${1 - rel * 0.12})` : undefined,
              }}
              className="absolute left-0 top-0 flex flex-col overflow-hidden rounded-3xl bg-[#f3f4f6] shadow-2xl transition-all duration-300 ease-out"
            >
              {card.kind === "flag" ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={flagSrc}
                    alt={`${project.country} flag`}
                    className="w-full object-cover"
                    style={{ height: MEDIA_H }}
                  />
                  <div className="flex min-h-0 flex-1 flex-col p-5">
                    <h3 className="text-xl font-medium leading-tight text-zinc-900">
                      {project.country}
                    </h3>
                    <p className="text-base font-medium text-zinc-900">
                      {items.length} {items.length === 1 ? "Project" : "Projects"}
                    </p>
                    <ol className="mt-3 min-h-0 flex-1 space-y-0.5 overflow-y-auto text-[13px] leading-snug text-zinc-800">
                      {items.map((it, n) => (
                        <li key={it.name}>
                          {String(n + 1).padStart(2, "0")} {it.name}
                        </li>
                      ))}
                    </ol>
                  </div>
                </>
              ) : (
                <>
                  {card.media.type === "video" ? (
                    <VideoThumb src={card.media.src} active={rel === 0} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={card.media.src}
                      alt={card.item.name}
                      className="w-full object-cover"
                      style={{ height: MEDIA_H }}
                    />
                  )}

                  <div className="min-h-0 flex-1 overflow-hidden p-5">
                    <h3 className="text-lg font-semibold leading-tight text-zinc-900">
                      {card.item.name}
                    </h3>
                    {card.item.place && (
                      <p className="mt-1 text-sm text-zinc-500">{card.item.place}</p>
                    )}

                    {card.item.stats && (
                      <ul className="mt-3 text-sm text-zinc-800">
                        {card.item.stats.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    )}

                    {card.item.description && (
                      <p className="mt-3 line-clamp-5 text-[13px] leading-snug text-zinc-700">
                        {card.item.description}
                      </p>
                    )}

                    {card.item.logos && (
                      <div className="mt-3 flex items-center gap-3">
                        {card.item.logos.map((l) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={l} src={l} alt="" className="h-9 w-auto object-contain" />
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Arrows */}
      {cards.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3" style={{ width: CARD_W }}>
          <button
            onClick={() => setIndex((i) => Math.max(i - 1, 0))}
            disabled={index === 0}
            aria-label="Previous card"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-zinc-700 disabled:opacity-40"
          >
            ‹
          </button>
          <span className="text-xs text-zinc-500">
            {index + 1} / {cards.length}
          </span>
          <button
            onClick={() => setIndex((i) => Math.min(i + 1, cards.length - 1))}
            disabled={index === cards.length - 1}
            aria-label="Next card"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white disabled:opacity-40"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}