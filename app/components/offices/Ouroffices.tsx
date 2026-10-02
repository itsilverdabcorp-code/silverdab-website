"use client";

import { useEffect, useId, useRef, useState } from "react";
import { geoCircle, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import worldData from "world-atlas/countries-110m.json";

// ---- Easy settings -------------------------------------------------------
const COLORS = {
  dark: "#c6c6c6", // all land
  light: "#e3e3e3", // countries with an office
};

// Animation timing (milliseconds)
const DARK_MS = 700; // dark map fades in
const LIGHT_AT = 700; // then the light countries fade in...
const LIGHT_MS = 700;
const OFFICES_AT = 1400; // ...then the offices start, one by one
const STEP = 400; // time between one office and the next
const LABEL_AFTER_PIN = 200; // details appear this long after their pin

// If you have the real Silverdab logo file, put its path here, e.g. "/images/silverdab-logo.png"
const LOGO_SRC: string | null = "/images/silverdab-logo-text.png";
// --------------------------------------------------------------------------

type Office = {
  id: string;
  lon: number;
  lat: number;
  dx: number; // where the details sit, relative to the pin tip
  dy: number;
  heading: string[];
  experts?: string;
  address?: string[];
  soon?: boolean;
};

// The order here is the order they animate in
const OFFICES: Office[] = [
  {
    id: "ph",
    lon: 121.0,
    lat: 14.6,
    dx: 32,
    dy: -19,
    heading: ["Metro Manila, Philippines"],
    experts: "70 BIM Experts",
    address: [
      "7F Unit 3, Hexagon Corporate",
      "Center, 1471 Quezon Avenue,",
      "Brgy. West Triangle, Quezon City",
      "Metro Manila Philippines 1104",
    ],
  },
  {
    id: "sg",
    lon: 103.82,
    lat: 1.35,
    dx: -175,
    dy: -22,
    heading: ["Singapore"],
    experts: "4 BIM Experts",
    address: ["Unit 2008 1 Fullerton Rd,", "#02-01 One Fullerton,", "Singapore 049213"],
  },
  {
    id: "jp",
    lon: 139.7,
    lat: 35.7,
    dx: 30,
    dy: -48,
    heading: ["Branch Office", "Shibuya Tokyo"],
    soon: true,
  },
  {
    id: "au",
    lon: 151.2,
    lat: -33.9,
    dx: -168,
    dy: -27,
    heading: ["Branch Office", "Sydney, Australia"],
    soon: true,
  },
];

const DESIGN_W = 1049;
const DESIGN_H = 665;

// ---- Map (built once) ------------------------------------------------------
const topology = worldData as unknown as Topology<{ countries: GeometryCollection }>;
const allCountries = (
  feature(topology, topology.objects.countries) as FeatureCollection<Geometry>
).features;

const projection = geoOrthographic()
  .rotate([-108.96, 6.85])
  .scale(299.5)
  .translate([648.9, 359.6])
  .clipAngle(90)
  .precision(0.5);
const path = geoPath(projection);

const LIGHT_NAMES = new Set(["Philippines", "Japan", "Australia"]);
const darkD =
  path({
    type: "FeatureCollection",
    features: allCountries.filter(
      (c) => (c.properties as { name?: string } | null)?.name !== "Antarctica"
    ),
  }) ?? "";
const lightD =
  path({
    type: "FeatureCollection",
    features: allCountries.filter((c) =>
      LIGHT_NAMES.has((c.properties as { name?: string } | null)?.name ?? "")
    ),
  }) ?? "";
// Singapore is too small for this map file, so it gets a small light patch
const singaporeD = path(geoCircle().center([103.82, 1.35]).radius(0.8)()) ?? "";

const pins = OFFICES.map((o) => {
  const [x, y] = projection([o.lon, o.lat]) ?? [0, 0];
  return { ...o, x, y };
});

// ---- Timing helpers --------------------------------------------------------
const pinDelay = (i: number) => OFFICES_AT + i * STEP;
const labelDelay = (i: number) => pinDelay(i) + LABEL_AFTER_PIN;
const delay = (ms: number, dur?: number) =>
  ({ "--d": `${ms}ms`, ...(dur ? { "--t": `${dur}ms` } : {}) }) as React.CSSProperties;

const CSS = `
  .of-fade { opacity: 0; transition: opacity var(--t, 700ms) ease var(--d, 0ms); }
  .of-shown .of-fade { opacity: 1; }
  .of-pin {
    opacity: 0;
    transform: translateY(-16px) scale(0.6);
    transform-origin: 0 0;
    transition: opacity 300ms ease var(--d, 0ms),
                transform 520ms cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0ms);
  }
  .of-shown .of-pin { opacity: 1; transform: none; }
  .of-label {
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 450ms ease var(--d, 0ms),
                transform 450ms cubic-bezier(0.2, 0.8, 0.2, 1) var(--d, 0ms);
  }
  .of-shown .of-label { opacity: 1; transform: none; }
  @media (prefers-reduced-motion: reduce) {
    .of-fade, .of-pin, .of-label { transition: none; }
  }
`;

// ---- Pieces ----------------------------------------------------------------
function SilverdabLogo() {
  if (LOGO_SRC) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={LOGO_SRC} alt="Silverdab" className="h-9 w-auto" />;
  }
  const n = 14;
  return (
    <span className="flex items-center gap-2">
      <svg width="37" height="37" viewBox="-20 -20 40 40" aria-hidden="true">
        {Array.from({ length: n }).map((_, i) => {
          const t = i / (n - 1);
          const a = (-60 + t * 300) * (Math.PI / 180);
          const r = 3.3 - t * 1.7;
          // dark grey at the start, blue at the end
          const c = (from: number, to: number) => Math.round(from + (to - from) * t);
          return (
            <circle
              key={i}
              cx={Math.cos(a) * 15}
              cy={Math.sin(a) * 15}
              r={r}
              fill={`rgb(${c(70, 58)}, ${c(70, 166)}, ${c(70, 216)})`}
            />
          );
        })}
      </svg>
      <span className="text-[22px] font-light tracking-tight text-zinc-800">
        Silver<span className="text-zinc-500">dab</span>
      </span>
    </span>
  );
}

function OfficeDetails({ office, indent }: { office: Office; indent: boolean }) {
  return (
    <div className="w-max">
      <SilverdabLogo />
      <div className={`mt-0.5 ${indent ? "pl-[45px]" : ""}`}>
        {office.heading.map((h) => (
          <p key={h} className="whitespace-nowrap text-[14px] font-semibold leading-[1.3] text-zinc-900">
            {h}
          </p>
        ))}
        {office.soon && (
          <p className="mt-2 whitespace-nowrap text-[12px] font-medium text-zinc-900">Coming Soon</p>
        )}
        {office.experts && (
          <p className="mt-2 whitespace-nowrap text-[12px] font-semibold text-zinc-900">
            {office.experts}
          </p>
        )}
        {office.address && (
          <p className="whitespace-nowrap text-[12px] leading-[1.35] text-zinc-700">
            {office.address.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}

function AboutText() {
  return (
    <>
      <h3 className="text-xl font-medium text-zinc-900">Growing Across Asia-Pacific</h3>
      <p className="mt-3 text-[14.5px] leading-[1.35] text-zinc-800">
        Silverdab Corporation started in 2019 with its central office in Manila, Philippines. We
        have nearly 125 BIM Experts specializing in Digital Engineering services that serve some of
        the region&apos;s most innovative infrastructure projects. We will expand to Japan and
        Australia due to demand of Digitalization Services.
      </p>
      <p className="mt-5 text-[14.5px] leading-[1.35] text-zinc-800">
        Our BIM Experts are licensed Architects, Civil, Structural, Mechanical, Electrical,
        Plumbing, and Sanitary Engineer.
      </p>
    </>
  );
}

function MapSvg({ viewBox, className }: { viewBox: string; className?: string }) {
  // unique ids, because this component can be on the page twice (desktop + mobile)
  const uid = useId().replace(/:/g, "");
  const pinId = `of-pin-${uid}`;
  const maskId = `of-mask-${uid}`;
  const blurId = `of-blur-${uid}`;

  return (
    <svg
      viewBox={viewBox}
      className={className}
      role="img"
      aria-label="Map of Silverdab offices in the Philippines, Singapore, Tokyo and Sydney"
    >
      <defs>
        <linearGradient id={pinId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fe6fb" />
          <stop offset="1" stopColor="#4fb4e0" />
        </linearGradient>
        <filter id={blurId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
        {/* soft fade on the left and top, where the map is cropped */}
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={DESIGN_W} height={DESIGN_H}>
          <rect x="0" y="0" width={DESIGN_W} height={DESIGN_H} fill="black" />
          <rect x="420" y="-300" width="700" height="1200" fill="white" filter={`url(#${blurId})`} />
        </mask>
      </defs>

      <g mask={`url(#${maskId})`}>
        {/* 1. everything dark grey */}
        <g className="of-fade" style={delay(0, DARK_MS)}>
          <path d={darkD} fill={COLORS.dark} />
        </g>
        {/* 2. office countries fade to light grey */}
        <g className="of-fade" style={delay(LIGHT_AT, LIGHT_MS)}>
          <path d={lightD} fill={COLORS.light} />
          <path d={singaporeD} fill={COLORS.light} />
        </g>
      </g>

      {/* 3. pins, one by one */}
      {pins.map((o, i) => (
        <g key={o.id} transform={`translate(${o.x} ${o.y})`}>
          <g className="of-pin" style={delay(pinDelay(i))}>
            <ellipse cx="0" cy="0" rx="6" ry="2.2" fill="rgba(0,0,0,0.14)" />
            <path
              d="M0 0 C0 0 -11 -11 -11 -19 A11 11 0 1 1 11 -19 C11 -11 0 0 0 0 Z"
              fill={`url(#${pinId})`}
            />
            <circle cx="0" cy="-19" r="5.2" fill="#e8fbff" />
          </g>
        </g>
      ))}
    </svg>
  );
}

// ---- Section ---------------------------------------------------------------
export default function OurOffices() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [scale, setScale] = useState(0.9);

  // Start the animation when the section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
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
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Desktop: scale the whole design to the available width
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const update = () => {
      if (el.offsetWidth > 0) setScale(el.offsetWidth / DESIGN_W);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`w-full bg-[#f5f6f8] ${shown ? "of-shown" : ""}`}
      aria-label="Our Offices"
    >
      <style>{CSS}</style>

      {/* Desktop / tablet */}
      <div className="mx-auto hidden w-full max-w-[1200px] md:block">
        <div ref={wrapRef} className="relative w-full" style={{ height: DESIGN_H * scale }}>
          <div
            className="absolute left-0 top-0"
            style={{
              width: DESIGN_W,
              height: DESIGN_H,
              transform: `scale(${scale})`,
              transformOrigin: "0 0",
            }}
          >
            <MapSvg viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`} className="absolute inset-0 h-full w-full" />

            <h2
              className="of-fade absolute left-[80px] top-[58px] text-[36px] font-medium leading-none text-zinc-900"
              style={delay(0, DARK_MS)}
            >
              Our Offices
            </h2>

            <div
              className="of-fade absolute left-[80px] top-[393px] w-[335px]"
              style={delay(0, DARK_MS)}
            >
              <AboutText />
            </div>

            {pins.map((o, i) => (
              <div
                key={o.id}
                className="of-label absolute"
                style={{ left: o.x + o.dx, top: o.y + o.dy, ...delay(labelDelay(i)) }}
              >
                <OfficeDetails office={o} indent />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="px-6 py-12 md:hidden">
        <h2 className="of-fade text-[32px] font-medium leading-none text-zinc-900" style={delay(0, DARK_MS)}>
          Our Offices
        </h2>

        <MapSvg viewBox="400 50 649 570" className="mt-4 h-auto w-full" />

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {pins.map((o, i) => (
            <div key={o.id} className="of-label" style={delay(labelDelay(i))}>
              <OfficeDetails office={o} indent={false} />
            </div>
          ))}
        </div>

        <div className="of-fade mt-10" style={delay(0, DARK_MS)}>
          <AboutText />
        </div>
      </div>
    </section>
  );
}