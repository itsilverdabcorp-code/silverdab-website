// components/projects/ProjectGlobe.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  geoContains,
  geoDistance,
  geoGraticule,
  geoOrthographic,
  geoPath,
} from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import worldData from "world-atlas/countries-110m.json";
import { PROJECTS, type Project } from "../../data/projects";

type Props = {
  onSelect: (project: Project, position: { x: number; y: number }) => void;
  activeCode?: string | null; // countryCode of the open country
};

type Rotation = [number, number];

// ---- Easy settings -------------------------------------------------------
const INITIAL_ROTATION: Rotation = [-80, -8]; // [-longitude, -latitude] of the view centre
const GLOBE_SIZE = 0.92; // globe diameter as a share of the width
const DRAG_SPEED = 90; // higher = rotates faster while dragging
const FRICTION_MS = 325; // higher = glides longer after letting go, lower = stops sooner
const AUTO_SPEED = 0.01; // auto-rotation speed in degrees per millisecond (0.01 = 10° per second)
const AUTO_RESUME_MS = 5000; // how long to wait after dragging before auto-rotation resumes
const CARD_STOP_MS = 5000; // how long after a card opens before auto-rotation stops

const COLORS = {
  land: "#c9c9c9",
  projectLand: "#e4e4e4", // countries that have projects
  activeLand: "#a9dcf7", // the country whose card is open
  activeEdge: "#5cb3e6",
  graticule: "rgba(110, 110, 110, 0.28)",
  outline: "#d2d2d2",
};
// --------------------------------------------------------------------------

const topology = worldData as unknown as Topology<{
  countries: GeometryCollection;
}>;
const countries = (
  feature(topology, topology.objects.countries) as FeatureCollection<Geometry>
).features;

// [lng, lat] for d3 (your data is [lat, lng])
const coordOf = (p: Project): [number, number] => [p.location[1], p.location[0]];

// The country a pin sits in. Coastal pins can fall just outside the simplified
// map outline, so if nothing matches we also try a few points around the pin.
function findCountry([lng, lat]: [number, number]) {
  const offsets = [0, 0.7, 1.5];
  for (const d of offsets) {
    for (const [dx, dy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) {
      if (d === 0 && (dx !== 0 || dy !== 0)) continue;
      const hit = countries.find((c) => geoContains(c, [lng + dx * d, lat + dy * d]));
      if (hit) return hit;
    }
  }
  return undefined;
}

// Countries that contain at least one project pin get a lighter fill
const projectCountries = new Set<Feature<Geometry>>();
const countryByCode = new Map<string, Feature<Geometry>>();
for (const p of PROJECTS) {
  const hit = findCountry(coordOf(p));
  if (hit) {
    projectCountries.add(hit);
    countryByCode.set(p.countryCode, hit);
  }
}
const landCollection: FeatureCollection<Geometry> = {
  type: "FeatureCollection",
  features: countries.filter((c) => !projectCountries.has(c)),
};
const projectLandCollection: FeatureCollection<Geometry> = {
  type: "FeatureCollection",
  features: countries.filter((c) => projectCountries.has(c)),
};

const graticule = geoGraticule().step([30, 30])();


const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

export default function ProjectGlobe({ onSelect, activeCode = null }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [rotation, setRotation] = useState<Rotation>(INITIAL_ROTATION);
  const [dragging, setDragging] = useState(false);

  const dragRef = useRef<{ x: number; y: number; rot: Rotation } | null>(null);
  const hasDraggedRef = useRef(false);
  const radiusRef = useRef(1);
  const rotationRef = useRef<Rotation>(INITIAL_ROTATION);
  const lastMoveRef = useRef({ r0: 0, r1: 0, t: 0 });
  const velRef = useRef({ x: 0, y: 0 }); // degrees per millisecond
  const inertiaRef = useRef<number | null>(null);
  const lastInteractionRef = useRef(-Infinity); // when the user last touched the globe
  const autoStoppedRef = useRef(false); // true once a card has been open for CARD_STOP_MS

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return undefined;
    const update = () => setWidth(el.offsetWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Layout
  const R = (width * GLOBE_SIZE) / 2;
  const pad = width * 0.05;
  const cx = width / 2;
  const cy = R + pad;
  const height = R * 2 + pad * 2;
  radiusRef.current = R || 1;
  rotationRef.current = rotation;

  useEffect(() => {
    return () => {
      if (inertiaRef.current !== null) cancelAnimationFrame(inertiaRef.current);
    };
  }, []);

  // Stop auto-rotation CARD_STOP_MS after a project card opens,
  // and let it run again as soon as the card is closed.
  useEffect(() => {
    autoStoppedRef.current = false;
    if (!activeCode) return undefined;
    const t = setTimeout(() => {
      autoStoppedRef.current = true;
    }, CARD_STOP_MS);
    return () => clearTimeout(t);
  }, [activeCode]);

  // Automatic rotation (right to left). Pauses while dragging or gliding,
  // and resumes AUTO_RESUME_MS after the last interaction.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - prev, 50);
      prev = now;
      const idle =
        dragRef.current === null &&
        inertiaRef.current === null &&
        !autoStoppedRef.current &&
        now - lastInteractionRef.current >= AUTO_RESUME_MS;
      if (idle) {
        const [a, b] = rotationRef.current;
        setRotation([a - AUTO_SPEED * dt, b]);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Everything that depends on the current rotation
  const view = useMemo(() => {
    if (width === 0) return null;

    const projection = geoOrthographic()
      .translate([cx, cy])
      .scale(R)
      .rotate([rotation[0], rotation[1]])
      .clipAngle(90)
      .precision(0.5);
    const path = geoPath(projection);
    const center: [number, number] = [-rotation[0], -rotation[1]];

    const pins = PROJECTS.map((project) => {
      const coord = coordOf(project);
      const point = projection(coord);
      const dist = geoDistance(coord, center);
      return { project, point, dist };
    })
      .filter((p) => p.point && p.dist < 1.55)
      .map((p) => ({
        project: p.project,
        x: p.point![0],
        y: p.point![1],
        opacity: clamp((1.55 - p.dist) / 0.12, 0, 1),
      }))
      .sort((a, b) => a.y - b.y); // lower pins draw on top

    return {
      landD: path(landCollection) ?? "",
      projectLandD: path(projectLandCollection) ?? "",
      activeD: activeCode
        ? path(countryByCode.get(activeCode) ?? { type: "Sphere" }) ?? ""
        : "",
      graticuleD: path(graticule) ?? "",
      pins,
    };
  }, [width, cx, cy, R, rotation, activeCode]);

  // Drag to rotate (listeners live on the window so the drag never gets stuck)
  useEffect(() => {
    if (!dragging) return undefined;

    const onMove = (e: PointerEvent) => {
      const start = dragRef.current;
      if (!start) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDraggedRef.current = true;
      const k = DRAG_SPEED / radiusRef.current;
      const r0 = start.rot[0] + dx * k;
      const r1 = clamp(start.rot[1] - dy * k, -75, 30);

      const now = performance.now();
      const last = lastMoveRef.current;
      const dt = now - last.t;
      if (dt > 0) {
        velRef.current = {
          x: 0.7 * ((r0 - last.r0) / dt) + 0.3 * velRef.current.x,
          y: 0.7 * ((r1 - last.r1) / dt) + 0.3 * velRef.current.y,
        };
      }
      lastMoveRef.current = { r0, r1, t: now };

      setRotation([r0, r1]);
    };
    const onUp = () => {
      dragRef.current = null;
      lastInteractionRef.current = performance.now();
      setDragging(false);

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const idle = performance.now() - lastMoveRef.current.t;
      const MAX_V = 1.5; // top speed, degrees per millisecond
      let vx = clamp(velRef.current.x, -MAX_V, MAX_V);
      let vy = clamp(velRef.current.y, -MAX_V, MAX_V);

      // Stopped moving before letting go, or barely moving: no glide
      if (reduceMotion || idle > 80 || Math.hypot(vx, vy) < 0.01) return;

      let prev = performance.now();
      const step = (now: number) => {
        const dt = Math.min(now - prev, 50);
        prev = now;
        const decay = Math.exp(-dt / FRICTION_MS);
        vx *= decay;
        vy *= decay;

        const [a, b] = rotationRef.current;
        const nb = clamp(b + vy * dt, -75, 30);
        if (nb !== b + vy * dt) vy = 0; // hit the top or bottom limit
        setRotation([a + vx * dt, nb]);

        if (Math.hypot(vx, vy) > 0.003) {
          inertiaRef.current = requestAnimationFrame(step);
        } else {
          inertiaRef.current = null;
          lastInteractionRef.current = performance.now();
        }
      };
      inertiaRef.current = requestAnimationFrame(step);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging]);

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (inertiaRef.current !== null) {
      cancelAnimationFrame(inertiaRef.current);
      inertiaRef.current = null;
    }
    velRef.current = { x: 0, y: 0 };
    lastInteractionRef.current = performance.now();
    lastMoveRef.current = {
      r0: rotationRef.current[0],
      r1: rotationRef.current[1],
      t: performance.now(),
    };
    dragRef.current = { x: e.clientX, y: e.clientY, rot: rotationRef.current };
    hasDraggedRef.current = false;
    setDragging(true);
  };

  const select = (project: Project, x: number, y: number) => {
    if (hasDraggedRef.current) return; // that was a drag, not a click
    onSelect(project, { x, y });
  };

  return (
    <div ref={wrapperRef} className="relative mx-auto w-full max-w-250">
      <style>{`
        @keyframes gl-ring-spin { to { stroke-dashoffset: -12; } }
        .gl-ring { animation: gl-ring-spin 0.9s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .gl-ring { animation: none; } }
        @keyframes gl-land-in { from { opacity: 0; } to { opacity: 1; } }
        .gl-active-land { animation: gl-land-in 0.3s ease; pointer-events: none; }
        .gl-pin { cursor: pointer; outline: none; }
        .gl-pin-body {
          transform-origin: 0 0;
          transition: transform 0.2s ease;
          filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.28));
        }
        .gl-pin:hover .gl-pin-body,
        .gl-pin:focus-visible .gl-pin-body { transform: scale(1.18); }
      `}</style>

      {view && (
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          onPointerDown={handlePointerDown}
          style={{
            display: "block",
            cursor: dragging ? "grabbing" : "grab",
            touchAction: "pan-y",
            userSelect: "none",
          }}
          role="img"
          aria-label="Interactive globe showing where Silverdab projects are located"
        >
          <defs>
            <radialGradient id="gl-sphere" cx="0.45" cy="0.42" r="0.66">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.6" stopColor="#f3f3f3" />
              <stop offset="1" stopColor="#dedede" />
            </radialGradient>
            <radialGradient id="gl-shade" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0.72" stopColor="#000000" stopOpacity="0" />
              <stop offset="1" stopColor="#000000" stopOpacity="0.06" />
            </radialGradient>
            <linearGradient id="gl-pin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8fe6fb" />
              <stop offset="1" stopColor="#5bbde6" />
            </linearGradient>
            <linearGradient id="gl-pin-main" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#5cc0ff" />
              <stop offset="1" stopColor="#1677e6" />
            </linearGradient>
          </defs>

          {/* Ocean / sphere */}
          <circle
            cx={cx}
            cy={cy}
            r={R}
            fill="url(#gl-sphere)"
            stroke={COLORS.outline}
            strokeWidth={1}
          />

          {/* Land */}
          <path d={view.landD} fill={COLORS.land} />
          <path d={view.projectLandD} fill={COLORS.projectLand} />
          {activeCode && countryByCode.has(activeCode) && (
            <path
              key={activeCode}
              className="gl-active-land"
              d={view.activeD}
              fill={COLORS.activeLand}
              stroke={COLORS.activeEdge}
              strokeWidth={0.8}
              strokeLinejoin="round"
            />
          )}

          {/* Latitude / longitude lines */}
          <path
            d={view.graticuleD}
            fill="none"
            stroke={COLORS.graticule}
            strokeWidth={0.6}
          />

          {/* Soft shading toward the edge */}
          <circle
            cx={cx}
            cy={cy}
            r={R}
            fill="url(#gl-shade)"
            pointerEvents="none"
          />

          {/* Pins */}
          {[...view.pins]
            .sort(
              (a, b) =>
                Number(a.project.countryCode === activeCode) -
                Number(b.project.countryCode === activeCode)
            ) // the open country's pin draws on top
            .map(({ project, x, y, opacity }) => {
            const main = project.countryCode === activeCode;
            const s = (width / 850) * (main ? 1.3 : 0.85);
            const label =
              (project as { country?: string }).country ?? "Project location";

            return (
              <g
                key={`${project.location[0]}-${project.location[1]}`}
                transform={`translate(${x} ${y})`}
                opacity={opacity}
                pointerEvents={opacity < 0.5 ? "none" : undefined}
              >
                <g
                  className="gl-pin"
                  role="button"
                  tabIndex={0}
                  aria-label={`${label}: view project details`}
                  onClick={() => select(project, x, y - 20 * s)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(project, { x, y: y - 20 * s });
                    }
                  }}
                >
                  {/* Dashed ring on the biggest location */}
                  <ellipse
                    className="gl-ring"
                    cx={0}
                    cy={0}
                    rx={16 * s}
                    ry={5.5 * s}
                    fill="none"
                    stroke="#2f8df0"
                    strokeWidth={1.2}
                    strokeDasharray="3 3"
                    style={{ opacity: main ? 1 : 0, transition: "opacity 0.25s ease" }}
                  />
                  <ellipse
                    cx={0}
                    cy={0}
                    rx={5 * s}
                    ry={2 * s}
                    fill="rgba(0,0,0,0.18)"
                  />

                  {/* Bigger invisible click area */}
                  <circle cx={0} cy={-16 * s} r={17 * s} fill="transparent" />

                  {/* The pin itself, tip at (0, 0) */}
                  <g className="gl-pin-body">
                    <g
                      style={{
                        transform: `scale(${s})`,
                        transformOrigin: "0 0",
                        transition: "transform 0.25s ease",
                      }}
                    >
                      <path
                        d="M0 0 C0 0 -11 -11 -11 -19 A11 11 0 1 1 11 -19 C11 -11 0 0 0 0 Z"
                        fill={main ? "url(#gl-pin-main)" : "url(#gl-pin)"}
                      />
                      <circle cx={0} cy={-19} r={5.2} fill="#dff7ff" />
                    </g>
                  </g>
                </g>
              </g>
            );
          })}
        </svg>
      )}

      <p className="mt-2 text-center text-sm text-zinc-800">
        Drag to rotate the globe. Click a marker to see project details.
      </p>
    </div>
  );
}