"use client";

import { useEffect, useRef, useState } from "react";
import { CATEGORIES, PROJECT_LIST, type Category, type ListItem } from "../../data/projects";

type Filter = "All" | Category;
const FILTERS: Filter[] = ["All", ...CATEGORIES];

type Media = { type: "video" | "image"; src: string };

const IMAGE_FILES = ["image.jpg", "image.jpeg", "image.png", "image.webp"];
const mediaCache = new Map<string, Media | null>();

async function fileExists(url: string, mimePrefix: string) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok && (res.headers.get("content-type") ?? "").startsWith(mimePrefix);
  } catch {
    return false;
  }
}

// video.mp4 first, then image.jpg / .jpeg / .png / .webp in the same folder
async function findMedia(videoPath?: string): Promise<Media | null> {
  if (!videoPath) return null;
  const cached = mediaCache.get(videoPath);
  if (cached !== undefined) return cached;

  const folder = videoPath.replace(/\/[^/]*$/, "");
  let result: Media | null = null;
  if (await fileExists(videoPath, "video/")) {
    result = { type: "video", src: videoPath };
  } else {
    for (const file of IMAGE_FILES) {
      if (await fileExists(`${folder}/${file}`, "image/")) {
        result = { type: "image", src: `${folder}/${file}` };
        break;
      }
    }
  }
  mediaCache.set(videoPath, result);
  return result;
}

function CardMedia({ video }: { video?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [media, setMedia] = useState<Media | null>(null);

  useEffect(() => {
    let cancelled = false;
    findMedia(video).then((m) => {
      if (!cancelled) setMedia(m);
    });
    return () => {
      cancelled = true;
    };
  }, [video]);

  // Only play a video while the card is on screen
  useEffect(() => {
    const v = ref.current;
    if (!v || media?.type !== "video") return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.4 }
    );
    observer.observe(v);
    return () => observer.disconnect();
  }, [media]);

  if (!media) return <div className="aspect-[1.65] w-full rounded-lg bg-zinc-300" />;

  if (media.type === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={media.src}
        alt=""
        className="aspect-[1.65] w-full rounded-lg object-cover"
      />
    );
  }

  return (
    <video
      ref={ref}
      src={`${media.src}#t=0.1`}
      muted
      loop
      playsInline
      preload="metadata"
      className="aspect-[1.65] w-full rounded-lg object-cover"
    />
  );
}


function Card({ item }: { item: ListItem }) {
  return (
    <article className="flex w-[260px] shrink-0 snap-start flex-col sm:w-[300px]">
      <CardMedia video={item.video} />
      <div className="flex flex-1 flex-col items-center px-2 pt-6 text-center">
        <h3 className="text-[17px] font-medium leading-snug text-zinc-900">{item.name}</h3>
        {item.place && (
          <p className="mt-1 text-[13px] font-semibold text-zinc-900">{item.place}</p>
        )}
        {item.description && (
          <p className="mt-5 text-[13px] leading-snug text-zinc-700">{item.description}</p>
        )}
        {item.logos && item.logos.length > 0 && (
          <div className="mt-auto flex items-center justify-center gap-2 pt-6">
            {item.logos.map((l) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={l} src={l} alt="" className="h-9 w-auto max-w-[110px] object-contain" />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function ProjectsShowcase() {
  const [filter, setFilter] = useState<Filter>("All");
  const trackRef = useRef<HTMLDivElement>(null);

  // Which projects actually have a video or image file (checked once on mount)
  const [hasMedia, setHasMedia] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    PROJECT_LIST.forEach((p) => {
      findMedia(p.video).then((m) => {
        if (!cancelled) setHasMedia((prev) => ({ ...prev, [p.name]: !!m }));
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Only show a project if it has a description AND a video/image
  const items = PROJECT_LIST.filter(
    (p) =>
      (filter === "All" || p.category === filter) &&
      !!p.description?.trim() &&
      hasMedia[p.name]
  );

  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
  }, [filter]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-[#f5f6f8] py-14">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-medium text-zinc-900">Projects</h2>

        <div
          role="tablist"
          aria-label="Filter projects by category"
          className="mt-5 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-zinc-200 p-1"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors ${
                filter === f ? "bg-black text-white" : "text-zinc-900 hover:bg-zinc-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div
          ref={trackRef}
          className="mt-10 flex snap-x snap-mandatory gap-8 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <Card key={item.name} item={item} />
          ))}
        </div>

        <div className="mt-2 flex gap-2">
          <button
            onClick={() => scrollByCard(-1)}
            aria-label="Scroll left"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-300 text-zinc-700 hover:bg-zinc-400"
          >
            ‹
          </button>
          <button
            onClick={() => scrollByCard(1)}
            aria-label="Scroll right"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-300 text-zinc-700 hover:bg-zinc-400"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}