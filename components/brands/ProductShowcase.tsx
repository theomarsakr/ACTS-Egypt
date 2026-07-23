"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RotateCcw } from "lucide-react";

/**
 * ProductShowcase — scroll-driven 3D product viewer, one flagship per brand.
 *
 * Phase A (0–55% of the track): the product does a full turntable revolution
 * while spec callouts (real catalog figures from lib/brandHub.ts) anchor to
 * the part they describe. Phase B: the "real world" docks in — process piping
 * for the valves, an exchanger tubesheet for the EST plug — and the camera
 * pulls back to show the product in service.
 *
 * Each brand supplies procedural geometry + copy via CONFIGS; the engine
 * (scroll scrub, projection, docking, lifecycle) is shared. Rendering is
 * client-only, DPR-clamped, paused off-screen, disposed on unmount;
 * prefers-reduced-motion gets the static installed view.
 */

const PHASE_SPLIT = 0.55;
const smoothstep = (t: number) => t * t * (3 - 2 * t);

type Callout = {
  anchor: [number, number, number];
  band: [number, number];
  title: string;
  text: string;
};

type ShowcaseConfig = {
  eyebrow: string;
  title: string;
  caption: string;
  install: { label: string; text: string };
  /** Resting Y rotation — context is built in this frame so docking aligns. */
  restAngle: number;
  camA: [number, number, number];
  camB: [number, number, number];
  lookA: [number, number, number];
  lookB: [number, number, number];
  /** Where the context starts relative to its docked position. */
  contextFrom: [number, number, number];
  /** How far the ground drops in phase B. */
  groundDrop: number;
  callouts: Callout[];
  build: () => THREE.Group;
  buildContext: () => THREE.Group;
};

/* ── Shared material + helper kit ─────────────────────────────────────── */

const mat = {
  paint: (color: number) =>
    new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.42,
      metalness: 0.2,
      clearcoat: 0.35,
      clearcoatRoughness: 0.4,
    }),
  steel: () =>
    new THREE.MeshStandardMaterial({ color: 0xb6bcc4, roughness: 0.35, metalness: 0.9 }),
  darkSteel: () =>
    new THREE.MeshStandardMaterial({ color: 0x5a616b, roughness: 0.5, metalness: 0.8 }),
  pipe: () =>
    new THREE.MeshStandardMaterial({ color: 0x97a0aa, roughness: 0.48, metalness: 0.72 }),
  navy: () =>
    new THREE.MeshStandardMaterial({ color: 0x33465c, roughness: 0.6, metalness: 0.4 }),
  brass: () =>
    new THREE.MeshStandardMaterial({ color: 0xb9975b, roughness: 0.32, metalness: 0.85 }),
};

function shadowed(mesh: THREE.Mesh): THREE.Mesh {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function hexBoltRing(
  count: number,
  radius: number,
  boltR: number,
  boltH: number,
  material: THREE.Material
): THREE.Group {
  const ring = new THREE.Group();
  const geo = new THREE.CylinderGeometry(boltR, boltR, boltH, 6);
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const bolt = shadowed(new THREE.Mesh(geo, material));
    bolt.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius);
    ring.add(bolt);
  }
  return ring;
}

/** Cylinder along the X axis (rotated once here so call-sites stay terse). */
function xCyl(r1: number, r2: number, len: number, m: THREE.Material): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, len, 48), m);
  mesh.rotation.z = Math.PI / 2;
  return mesh;
}

/* ── Farris 2600 — safety relief valve ────────────────────────────────── */

function buildFarrisValve(): THREE.Group {
  const red = mat.paint(0xc1272d);
  const steel = mat.steel();
  const g = new THREE.Group();
  const add = (m: THREE.Mesh) => (shadowed(m), g.add(m), m);

  add(new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.09, 48), red)).position.y = 0.045;
  const inletBolts = hexBoltRing(8, 0.34, 0.032, 0.13, steel);
  inletBolts.position.y = 0.05;
  g.add(inletBolts);
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.34, 48), red)).position.y = 0.38;
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.42, 48), red)).position.y = 0.62;
  add(new THREE.Mesh(new THREE.SphereGeometry(0.285, 48, 32), red)).position.y = 0.66;
  const outletPipe = add(xCyl(0.21, 0.21, 0.42, red));
  outletPipe.position.set(0.32, 0.66, 0);
  const outletFlange = add(xCyl(0.36, 0.36, 0.08, red));
  outletFlange.position.set(0.56, 0.66, 0);
  const outletBolts = hexBoltRing(8, 0.29, 0.028, 0.12, steel);
  outletBolts.rotation.z = Math.PI / 2;
  outletBolts.position.set(0.56, 0.66, 0);
  g.add(outletBolts);
  const bore = add(xCyl(0.155, 0.155, 0.085, mat.darkSteel()));
  bore.position.set(0.565, 0.66, 0);
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.1, 48), red)).position.y = 0.9;
  const bonnetStuds = hexBoltRing(8, 0.27, 0.03, 0.17, steel);
  bonnetStuds.position.y = 0.9;
  g.add(bonnetStuds);
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.205, 0.52, 48), red)).position.y = 1.21;
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.09, 48), red)).position.y = 1.5;
  const cap = add(
    new THREE.Mesh(new THREE.SphereGeometry(0.125, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2), red)
  );
  cap.position.y = 1.54;
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.09, 6), steel)).position.y = 1.63;
  add(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.2), red)).position.set(0, 1.56, 0.12);
  const pin = add(xCyl(0.035, 0.035, 0.16, steel));
  pin.position.set(0, 1.58, 0.12);
  const leverCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 1.6, 0.14),
    new THREE.Vector3(0, 1.56, 0.34),
    new THREE.Vector3(0, 1.38, 0.47),
    new THREE.Vector3(0, 1.14, 0.52),
    new THREE.Vector3(0, 0.98, 0.5),
  ]);
  add(new THREE.Mesh(new THREE.TubeGeometry(leverCurve, 40, 0.042, 16), red));
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.14, 24), red)).position.set(0, 0.92, 0.5);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.11, 0.17), steel)).position.set(-0.27, 0.62, 0);
  return g;
}

function buildFarrisContext(): THREE.Group {
  const pipe = mat.pipe();
  const navy = mat.navy();
  const g = new THREE.Group();
  const add = (m: THREE.Mesh) => (shadowed(m), g.add(m), m);

  add(new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.09, 48), pipe)).position.y = -0.055;
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.62, 48), pipe)).position.y = -0.42;
  add(xCyl(0.34, 0.34, 4.4, pipe)).position.y = -0.95;
  add(new THREE.Mesh(new THREE.SphereGeometry(0.26, 32, 24), pipe)).position.y = -0.82;
  add(xCyl(0.36, 0.36, 0.07, pipe)).position.set(0.64, 0.66, 0);
  add(xCyl(0.21, 0.21, 0.5, pipe)).position.set(0.92, 0.66, 0);
  add(new THREE.Mesh(new THREE.SphereGeometry(0.24, 32, 24), pipe)).position.set(1.18, 0.66, 0);
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 1.7, 40), pipe)).position.set(1.18, 1.52, 0);
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.06, 40), pipe)).position.set(1.18, 2.38, 0);
  for (const x of [-1.6, 1.5]) {
    add(new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.62, 0.14), navy)).position.set(x, -1.48, 0);
    add(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.5), navy)).position.set(x, -1.76, 0);
  }
  add(xCyl(0.24, 0.24, 4.4, pipe)).position.set(0, -0.6, -1.5);
  add(new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 3.2, 48), navy)).position.set(-2.3, 0.2, -2.6);
  add(new THREE.Mesh(new THREE.SphereGeometry(1.15, 48, 24), navy)).position.set(-2.3, 1.8, -2.6);
  return g;
}

/* ── Dyna-Flo — sliding-stem globe control valve ──────────────────────── */

function buildDynaValve(): THREE.Group {
  const blue = mat.paint(0x2b6ca3);
  const steel = mat.steel();
  const g = new THREE.Group();
  const add = (m: THREE.Mesh) => (shadowed(m), g.add(m), m);

  // Globe body in the line: flanges either side, spherical center
  for (const s of [-1, 1]) {
    const fl = add(xCyl(0.3, 0.3, 0.09, blue));
    fl.position.set(s * 0.58, 0.42, 0);
    const bolts = hexBoltRing(8, 0.24, 0.026, 0.12, steel);
    bolts.rotation.z = Math.PI / 2;
    bolts.position.set(s * 0.58, 0.42, 0);
    g.add(bolts);
    add(xCyl(0.19, 0.19, 0.3, blue)).position.set(s * 0.38, 0.42, 0);
  }
  add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 48, 32), blue)).position.y = 0.42;
  // Bonnet + flange
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.07, 48), blue)).position.y = 0.68;
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.19, 0.24, 48), blue)).position.y = 0.82;
  // Yoke legs + stem + travel plate
  for (const s of [-1, 1])
    add(new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.52, 0.12), blue)).position.set(s * 0.13, 1.18, 0);
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.55, 24), steel)).position.y = 1.16;
  add(new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.2, 0.09), steel)).position.set(-0.17, 1.14, 0.06);
  // Actuator: yoke boss, spring barrel, diaphragm case "mushroom"
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.08, 48), blue)).position.y = 1.44;
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.16, 48), blue)).position.y = 1.55;
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.11, 56), blue)).position.y = 1.68;
  const caseBolts = hexBoltRing(14, 0.47, 0.02, 0.13, steel);
  caseBolts.position.y = 1.68;
  g.add(caseBolts);
  const dome = add(new THREE.Mesh(new THREE.SphereGeometry(0.52, 56, 28, 0, Math.PI * 2, 0, Math.PI / 2), blue));
  dome.scale.y = 0.5;
  dome.position.y = 1.72;
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.1, 24), blue)).position.y = 2.0;
  // PS2 positioner on the yoke with gauge
  add(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.24, 0.2), mat.darkSteel())).position.set(-0.3, 1.18, 0);
  const gauge = add(xCyl(0.05, 0.05, 0.05, steel));
  gauge.position.set(-0.4, 1.28, 0);
  // Nameplate
  add(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.09, 0.015), steel)).position.set(0, 0.5, 0.29);
  return g;
}

function buildDynaContext(): THREE.Group {
  const pipe = mat.pipe();
  const navy = mat.navy();
  const g = new THREE.Group();
  const add = (m: THREE.Mesh) => (shadowed(m), g.add(m), m);

  // The line the valve throttles: mating flanges + long runs both sides
  for (const s of [-1, 1]) {
    add(xCyl(0.3, 0.3, 0.07, pipe)).position.set(s * 0.66, 0.42, 0);
    add(xCyl(0.2, 0.2, 1.9, pipe)).position.set(s * 1.66, 0.42, 0);
    add(new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.75, 0.13), navy)).position.set(s * 1.95, -0.06, 0);
    add(new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.08, 0.46), navy)).position.set(s * 1.95, -0.46, 0);
  }
  add(xCyl(0.22, 0.22, 4.6, pipe)).position.set(0, 0.1, -1.5);
  add(new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 3.0, 48), navy)).position.set(-2.4, 0.35, -2.6);
  add(new THREE.Mesh(new THREE.SphereGeometry(1.1, 48, 24), navy)).position.set(-2.4, 1.85, -2.6);
  return g;
}

/* ── EST — Pop-A-Plug P2 + exchanger tubesheet ────────────────────────── */

function buildEstPlug(): THREE.Group {
  const brass = mat.brass();
  const steel = mat.steel();
  const g = new THREE.Group();
  const add = (m: THREE.Mesh) => (shadowed(m), g.add(m), m);

  // Shell with serration rings (the seal), nose taper, breakaway hex end
  add(xCyl(0.15, 0.15, 0.66, brass)).position.set(-0.02, 0.8, 0);
  for (const x of [-0.24, -0.1, 0.04, 0.18]) {
    const rib = add(new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.024, 16, 48), brass));
    rib.rotation.y = Math.PI / 2;
    rib.position.set(x, 0.8, 0);
  }
  add(xCyl(0.1, 0.15, 0.16, brass)).position.set(0.39, 0.8, 0);
  add(xCyl(0.045, 0.095, 0.12, steel)).position.set(0.52, 0.8, 0);
  const hex = add(new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.12, 6), steel));
  hex.rotation.z = Math.PI / 2;
  hex.position.set(-0.41, 0.8, 0);
  add(xCyl(0.04, 0.04, 0.26, steel)).position.set(-0.58, 0.8, 0);
  return g;
}

function buildEstContext(): THREE.Group {
  const navy = mat.navy();
  const dark = mat.darkSteel();
  const brass = mat.brass();
  const g = new THREE.Group();
  const add = (m: THREE.Mesh) => (shadowed(m), g.add(m), m);

  // Exchanger channel: tubesheet disc facing the plug + shell behind
  add(xCyl(1.7, 1.7, 0.18, mat.pipe())).position.set(0.72, 0.8, 0);
  add(xCyl(1.82, 1.82, 0.14, navy)).position.set(0.87, 0.8, 0);
  add(xCyl(1.72, 1.72, 0.7, navy)).position.set(1.3, 0.8, 0);
  // Tube field: dark bores on a square grid; a few already-plugged neighbours
  const bore = new THREE.CylinderGeometry(0.14, 0.14, 0.1, 24);
  const plugged = new THREE.CylinderGeometry(0.1, 0.1, 0.08, 6);
  let n = 0;
  for (let iy = -3; iy <= 3; iy++) {
    for (let iz = -3; iz <= 3; iz++) {
      const y = 0.8 + iy * 0.42;
      const z = iz * 0.42;
      if (Math.hypot(y - 0.8, z) > 1.45) continue;
      if (iy === 0 && iz === 0) continue; // the plug's own tube
      const b = shadowed(new THREE.Mesh(bore, dark));
      b.rotation.z = Math.PI / 2;
      b.position.set(0.615, y, z);
      g.add(b);
      // Sprinkle a few completed repairs
      if (n % 9 === 4) {
        const p = shadowed(new THREE.Mesh(plugged, brass));
        p.rotation.z = Math.PI / 2;
        p.position.set(0.58, y, z);
        g.add(p);
      }
      n++;
    }
  }
  // The plug's own tube bore, dead ahead
  const own = add(xCyl(0.16, 0.16, 0.12, dark));
  own.position.set(0.615, 0.8, 0);
  return g;
}

/* ── Per-brand configuration ──────────────────────────────────────────── */

const CONFIGS: Record<string, ShowcaseConfig> = {
  "farris-engineering": {
    eyebrow: "Interactive 360° — 2600 Series",
    title: "The workhorse of the Farris line",
    caption: "API 526 full-nozzle process relief valve — scroll to walk around it.",
    install: {
      label: "In service",
      text: "Bolted straight onto the line's API 526 mating flange, with the discharge piped to a safe location — one 2600 protects the entire vessel the moment pressure exceeds its set point.",
    },
    restAngle: -0.6,
    camA: [2.3, 1.7, 3.1],
    camB: [4.6, 2.2, 5.6],
    lookA: [0, 0.8, 0],
    lookB: [0.3, 0.6, 0],
    contextFrom: [0, -4.6, 0],
    groundDrop: 1.8,
    callouts: [
      { anchor: [0.42, 0.1, 0], band: [0.02, 0.27], title: "Full-nozzle inlet", text: "API 526 envelope, 1\"×2\" to 20\"×24\" — drop-in interchangeable." },
      { anchor: [0.62, 0.66, 0], band: [0.27, 0.52], title: "Integral cast flanges", text: "Flange classes 150#–2500#, carbon or stainless steel to Monel & Hastelloy C." },
      { anchor: [0.26, 1.22, 0], band: [0.52, 0.77], title: "Enclosed spring bonnet", text: "Set pressures 15–6000 psig, service from −320 to 1500 °F." },
      { anchor: [0, 1.32, 0.5], band: [0.77, 1.0], title: "Lifting lever", text: "Manual in-service testing — ASME/NB Section VIII & III certified." },
    ],
    build: buildFarrisValve,
    buildContext: buildFarrisContext,
  },
  "dyna-flo": {
    eyebrow: "Interactive 360° — Sliding-Stem Series",
    title: "Flow control, to the millimeter",
    caption: "Cage-guided globe control valve with spring & diaphragm actuator — scroll to walk around it.",
    install: {
      label: "In the loop",
      text: "Installed between mating flanges in the process line, the actuator strokes the plug against its seat to hold the loop's setpoint — modulating flow continuously, not just open/closed.",
    },
    restAngle: -0.35,
    camA: [2.4, 1.8, 3.2],
    camB: [4.6, 2.3, 5.6],
    lookA: [0, 1.0, 0],
    lookB: [0.2, 0.8, 0],
    contextFrom: [0, -4.6, 0],
    groundDrop: 0.8,
    callouts: [
      { anchor: [-0.62, 0.42, 0], band: [0.02, 0.27], title: "Globe body", text: "Series span 1\" to 16\" bodies, pressure classes 150–2500." },
      { anchor: [0.28, 0.5, 0], band: [0.27, 0.52], title: "Cage-guided trim", text: "Up to 320 AxFlo multi-stage axial-flow anti-cavitation trim." },
      { anchor: [0.44, 1.75, 0], band: [0.52, 0.77], title: "Spring & diaphragm actuator", text: "Fail-closed (DFC) or fail-open (DFO) on loss of air." },
      { anchor: [-0.38, 1.28, 0], band: [0.77, 1.0], title: "Digital positioner", text: "PS2 positioner drives linear plug travel from the 4–20 mA loop." },
    ],
    build: buildDynaValve,
    buildContext: buildDynaContext,
  },
  est: {
    eyebrow: "Interactive 360° — Pop-A-Plug® P2",
    title: "The weld-free tube repair",
    caption: "High-pressure mechanical tube plug — scroll to walk around it.",
    install: {
      label: "In the exchanger",
      text: "From the channel side, the P2 docks into the leaking tube and its rings swage against the tube wall — a helium leak-tight seal in minutes, no welding, and the exchanger goes back online.",
    },
    // Nose points away from camera so the tubesheet's channel-side face —
    // where the plug goes in — is what the pulled-back camera looks at.
    restAngle: 2.3,
    camA: [1.45, 1.2, 1.95],
    camB: [3.4, 2.1, 4.8],
    lookA: [0, 0.82, 0],
    lookB: [-0.3, 0.85, -0.3],
    contextFrom: [3.6, 0, 0],
    groundDrop: 1.1,
    callouts: [
      { anchor: [0, 0.97, 0], band: [0.02, 0.33], title: "Serrated sealing rings", text: "Permanent weld-free seal, rated 7,000 PsiG (483 BarG)." },
      { anchor: [0.54, 0.8, 0], band: [0.33, 0.66], title: "Ring-and-pin design", text: "Metallurgy-matched to the tube — resists ejection and thermal cycling." },
      { anchor: [-0.55, 0.8, 0], band: [0.66, 1.0], title: "Breakaway installation end", text: "Fits tube IDs 0.400\"–1.460\" — helium leak-tight, ISO 9001 manufactured." },
    ],
    build: buildEstPlug,
    buildContext: buildEstContext,
  },
};

/* ── Engine ───────────────────────────────────────────────────────────── */

export default function ProductShowcase({ slug }: { slug: string }) {
  const config = CONFIGS[slug];
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const installCapRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const host = canvasHostRef.current;
    const track = trackRef.current;
    if (!host || !track || !config) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 30);

    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(2.5, 4.5, 2.5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = key.shadow.camera.bottom = -3;
    key.shadow.camera.right = key.shadow.camera.top = 3;
    key.shadow.radius = 6;
    scene.add(key);
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 9),
      new THREE.ShadowMaterial({ opacity: 0.16 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const product = config.build();
    scene.add(product);

    const contextWrap = new THREE.Group();
    contextWrap.rotation.y = config.restAngle;
    const context = config.buildContext();
    contextWrap.add(context);
    scene.add(contextWrap);

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const anchor = new THREE.Vector3();
    const camA = new THREE.Vector3(...config.camA);
    const camB = new THREE.Vector3(...config.camB);
    const lookA = new THREE.Vector3(...config.lookA);
    const lookB = new THREE.Vector3(...config.lookB);
    const ctxFrom = new THREE.Vector3(...config.contextFrom);
    const lookAt = new THREE.Vector3();
    let progress = reduced ? 1 : 0;

    const readProgress = () => {
      const rect = track.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / scrollable));
    };

    const render = () => {
      if (!reduced) progress = readProgress();
      const pA = Math.min(1, progress / PHASE_SPLIT);
      const pB = smoothstep(
        Math.min(1, Math.max(0, (progress - PHASE_SPLIT) / (1 - PHASE_SPLIT)))
      );

      product.rotation.y = config.restAngle + pA * Math.PI * 2;
      product.updateMatrixWorld();

      context.visible = pB > 0.001;
      context.position.copy(ctxFrom).multiplyScalar(1 - pB);
      ground.position.y = -config.groundDrop * pB;

      camera.position.lerpVectors(camA, camB, pB);
      lookAt.lerpVectors(lookA, lookB, pB);
      camera.lookAt(lookAt);

      const w = host.clientWidth;
      const h = host.clientHeight;
      config.callouts.forEach((c, i) => {
        const el = labelRefs.current[i];
        if (!el) return;
        const inBand = pA >= c.band[0] && pA <= c.band[1] && pB === 0;
        const opacity = reduced || inBand ? 1 : 0;
        anchor.set(...c.anchor).applyMatrix4(product.matrixWorld);
        anchor.project(camera);
        el.style.opacity = String(opacity);
        el.style.transform = `translate(${((anchor.x * 0.5 + 0.5) * w).toFixed(1)}px, ${((-anchor.y * 0.5 + 0.5) * h).toFixed(1)}px)`;
      });

      const cap = installCapRef.current;
      if (cap) cap.style.opacity = String(reduced ? 1 : pB);
      const hint = hintRef.current;
      if (hint) hint.style.opacity = String(1 - pB);

      renderer.render(scene, camera);
    };

    let raf = 0;
    let visible = false;
    const loop = () => {
      render();
      if (visible) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    });
    io.observe(track);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
      pmrem.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, [reduced, config]);

  if (!config) return null;

  return (
    <div ref={trackRef} className={reduced ? "relative" : "relative h-[420vh]"}>
      <div
        className={`${
          reduced ? "relative" : "sticky top-0 h-screen"
        } flex flex-col items-center justify-center overflow-hidden`}
      >
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,42,67,0.07),_transparent_65%)]"
          aria-hidden
        />
        <div className="relative w-full max-w-3xl px-6 pt-10 text-center">
          <div className="flex items-center justify-center gap-2 text-[13px] font-bold uppercase tracking-widest text-brand">
            <RotateCcw size={15} /> {config.eyebrow}
          </div>
          <h2 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight text-navy">
            {config.title}
          </h2>
          <p className="mt-2 text-[15px] text-gray-500">{config.caption}</p>
        </div>

        {/* 3D stage + projected callouts — wide so the install scene has room */}
        <div className="relative mt-2 h-[52vh] w-full max-w-5xl sm:h-[60vh]">
          <div ref={canvasHostRef} className="absolute inset-0" />
          {config.callouts.map((c, i) => (
            <div
              key={c.title}
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              className="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-500 will-change-transform"
            >
              <span className="absolute -translate-x-1/2 -translate-y-1/2">
                <span className="block h-2.5 w-2.5 rounded-full border-2 border-white bg-brand shadow-md" />
              </span>
              <div className="absolute start-3 top-0 w-52 -translate-y-1/2 rounded-xl border border-gray-200 bg-white/95 p-3 text-start shadow-lg shadow-navy/10 backdrop-blur">
                <div className="text-[12.5px] font-bold text-navy">{c.title}</div>
                <p className="mt-0.5 text-[11.5px] leading-snug text-gray-500">{c.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Install-phase caption — fades in as the context docks */}
        <div
          ref={installCapRef}
          className="pointer-events-none absolute inset-x-0 bottom-28 flex justify-center opacity-0 transition-opacity duration-300"
        >
          <div className="mx-6 max-w-xl rounded-2xl border border-gray-200 bg-white/95 px-6 py-4 text-center shadow-xl shadow-navy/10 backdrop-blur">
            <div className="text-[13px] font-bold uppercase tracking-widest text-brand">
              {config.install.label}
            </div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-gray-600">
              {config.install.text}
            </p>
          </div>
        </div>

        {!reduced && (
          <p ref={hintRef} className="relative pb-6 text-[12.5px] font-medium text-gray-400">
            Keep scrolling — it turns with the page ↓
          </p>
        )}
      </div>
    </div>
  );
}
