// components/projects/ProjectGlobe.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { PROJECTS, type Project } from "../../data/projects";

type Props = {
  onSelect: (project: Project, position: { x: number; y: number }) => void;
};

const THETA = 0.3;

export default function ProjectGlobe({ onSelect }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const phiRef = useRef(0);
  const [width, setWidth] = useState(0);

  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const hasDraggedRef = useRef(false);

  useEffect(() => {
    const onResize = () => {
      if (wrapperRef.current) setWidth(wrapperRef.current.offsetWidth);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || width === 0) return;

    const config: COBEOptions = {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: THETA,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 60000,
      mapBrightness: 2.2,
      baseColor: [0.35, 0.35, 0.4],
      markerColor: [0.09, 0.78, 0.98],
      glowColor: [0.15, 0.2, 0.25],
      markers: PROJECTS.map((p) => ({
        location: p.location,
        size: Math.min(0.04 + p.projects.length * 0.01, 0.1),
      })),
    };

    const globe = createGlobe(canvasRef.current, config);

    let animationFrameId: number;
    const animate = () => {
      // No auto-rotation — phi only changes via drag (handlePointerMove).
      globe.update({
        phi: phiRef.current,
        width: width * 2,
        height: width * 2,
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      globe.destroy();
    };
  }, [width]);

  // Drag to rotate
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerInteracting.current = e.clientX;
    pointerInteractionMovement.current = phiRef.current;
    hasDraggedRef.current = false;
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
  };

  const handlePointerUp = () => {
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (pointerInteracting.current === null) return;
    const delta = e.clientX - pointerInteracting.current;
    if (Math.abs(delta) > 3) hasDraggedRef.current = true;
    phiRef.current = pointerInteractionMovement.current + delta * 0.005;
  };

  // Convert [lat, lng] to a 3D point on the unit sphere, using cobe's own convention
  // (ported from cobe's minified source, function U). Note the -PI longitude offset and
  // the specific axis assignment/signs — this must match exactly or hit-testing drifts.
  const latLngToVector3 = (lat: number, lng: number): [number, number, number] => {
    const r = (lat * Math.PI) / 180;
    const a = (lng * Math.PI) / 180 - Math.PI;
    const o = Math.cos(r);
    return [-o * Math.cos(a), Math.sin(r), o * Math.sin(a)];
  };

  // Forward-project a 3D sphere point to normalized (0..1) screen coords, given current
  // phi/theta. Ported from cobe's function O, assuming scale=1 and offset=[0,0] (cobe
  // defaults, matching our COBEOptions which doesn't set scale/offset).
  const projectToScreen = (
    point: [number, number, number],
    phi: number,
    theta: number,
    aspect: number
  ) => {
    const [px, py, pz] = point;
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);

    // c = a*t[0] + i*t[2]; s = i*o*t[0] + r*t[1] - a*o*t[2]
    // where r=cos(phi), o=sin(phi), a=cos(theta), i=sin(theta) in cobe's O()
    const c = cosTheta * px + sinTheta * pz;
    const s = sinTheta * sinPhi * px + cosPhi * py - cosTheta * sinPhi * pz;
    const depth = -sinTheta * cosPhi * px + sinPhi * py + cosTheta * cosPhi * pz;

    const screenX = (c / aspect + 1) / 2;
    const screenY = (-s + 1) / 2;

    const visible = depth >= 0 || c * c + s * s >= 0.64;
    if (!visible) return null;

    return { x: screenX, y: screenY };
  };

  // Click detection: forward-project every marker using cobe's exact math, then pick the
  // closest one to the click, in pixel space.
  const handleClick = (e: React.MouseEvent) => {
    if (hasDraggedRef.current) return; // ignore clicks that were actually drags
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const aspect = rect.width / rect.height;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    let closest: Project | null = null;
    let closestPixelDist = Infinity;

    for (const p of PROJECTS) {
      const [lat, lng] = p.location;
      const vec = latLngToVector3(lat, lng);
      const proj = projectToScreen(vec, phiRef.current, THETA, aspect);
      if (!proj) continue; // marker is on the far side, skip

      const markerScreenX = proj.x * rect.width;
      const markerScreenY = proj.y * rect.height;

      const dist = Math.hypot(markerScreenX - clickX, markerScreenY - clickY);
      if (dist < closestPixelDist) {
        closestPixelDist = dist;
        closest = p;
      }
    }

    // Require the click to land within ~28px of the marker's actual screen position
    if (closest && closestPixelDist < 28) {
      onSelect(closest, { x: clickX, y: clickY });
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative mx-auto aspect-square w-full max-w-[850px]"
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
        style={{ width: "100%", height: "100%", cursor: "grab" }}
      />
    </div>
  );
}