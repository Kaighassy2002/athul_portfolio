export function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

export function smoothstep(edge0, edge1, x) {
  const t = clamp01((x - edge0) / (edge1 - edge0 || 1));
  return t * t * (3 - 2 * t);
}

export function smootherstep(edge0, edge1, x) {
  const t = clamp01((x - edge0) / (edge1 - edge0 || 1));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function lerpVec(a, b, t) {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export function latLonToVec(lat, lon, radius = 1.62) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

const INTRO = {
  modelPos: [0, 0.12, 0],
  modelRot: [0.06, 0.32, 0.02],
  modelScale: 0.96,
  camPos: [0, 0.16, 8.15],
  camLook: [0, 0.12, 0],
  camFov: 38,
};

const ESTABLISH = {
  modelPos: [0, 0.16, 0],
  modelRot: [0.08, 0.38, 0.02],
  modelScale: 1.08,
  camPos: [0, 0.08, 7.15],
  camLook: [0, 0.16, 0],
  camFov: 36,
};

const TERRITORY = {
  modelPos: [-1.28, 0.1, 0.08],
  modelRot: [0.1, 1.18, 0.02],
  modelScale: 0.98,
  camPos: [0.52, 0.08, 6.7],
  camLook: [-0.82, 0.08, 0],
  camFov: 34,
};

const FIELDS_SHOT = {
  modelPos: [1.08, 0.08, 0.14],
  modelRot: [0.16, 1.72, -0.04],
  modelScale: 1.06,
  camPos: [-0.4, 0.06, 6.25],
  camLook: [0.56, 0.06, 0],
  camFov: 34,
};

const INSPECT = {
  modelPos: [0.04, 0.42, 1.12],
  modelRot: [0.38, 2.42, 0.08],
  modelScale: 1.18,
  camPos: [0.02, -0.12, 4.55],
  camLook: [0.04, 0.32, 0.36],
  camFov: 30,
};

const UNFOLD = {
  modelPos: [0.06, 0.22, -0.88],
  modelRot: [0.18, 2.95, 0],
  modelScale: 0.5,
  camPos: [0, 0.48, 8.35],
  camLook: [0, 0.06, 0],
  camFov: 40,
};

const EXIT = {
  modelPos: [0, -1.72, -2.05],
  modelRot: [0.1, 3.35, 0],
  modelScale: 0.18,
  camPos: [0, 1.48, 10.15],
  camLook: [0, -1.18, 0],
  camFov: 46,
};

const COMPACT_ESTABLISH = {
  modelPos: [0, 0.38, 0],
  modelRot: [0.1, 0.38, 0.02],
  modelScale: 0.96,
  camPos: [0, -0.04, 7.65],
  camLook: [0, 0.32, 0],
  camFov: 38,
};

const COMPACT_TERRITORY = {
  modelPos: [0, 0.42, 0.08],
  modelRot: [0.12, 1.18, 0.02],
  modelScale: 0.94,
  camPos: [0.04, -0.08, 7.25],
  camLook: [0, 0.36, 0],
  camFov: 36,
};

const COMPACT_FIELDS = {
  modelPos: [0, 0.42, 0.1],
  modelRot: [0.14, 1.72, -0.04],
  modelScale: 0.94,
  camPos: [-0.04, -0.08, 7.15],
  camLook: [0, 0.36, 0],
  camFov: 36,
};

const COMPACT_INSPECT = {
  modelPos: [0.02, 0.52, 0.85],
  modelRot: [0.32, 2.42, 0.08],
  modelScale: 1.02,
  camPos: [0, -0.18, 5.15],
  camLook: [0.02, 0.4, 0.18],
  camFov: 32,
};

const COMPACT_UNFOLD = {
  modelPos: [0.04, 0.42, -0.7],
  modelRot: [0.16, 2.95, 0],
  modelScale: 0.46,
  camPos: [0, 0.22, 8.6],
  camLook: [0, 0.18, 0],
  camFov: 42,
};

const COMPACT_EXIT = {
  modelPos: [0, -1.4, -1.85],
  modelRot: [0.1, 3.35, 0],
  modelScale: 0.16,
  camPos: [0, 1.2, 10.4],
  camLook: [0, -0.95, 0],
  camFov: 46,
};

export const SHOTS = [
  { t: 0, ...INTRO },
  { t: 0.06, ...ESTABLISH },
  { t: 0.18, ...ESTABLISH },
  { t: 0.28, ...TERRITORY },
  { t: 0.46, ...TERRITORY },
  { t: 0.56, ...FIELDS_SHOT },
  { t: 0.74, ...FIELDS_SHOT },
  { t: 0.84, ...INSPECT },
  { t: 0.92, ...INSPECT },
  { t: 0.96, ...UNFOLD },
  { t: 1, ...EXIT },
];

export const SHOTS_COMPACT = [
  { t: 0, ...COMPACT_ESTABLISH },
  { t: 0.18, ...COMPACT_ESTABLISH },
  { t: 0.28, ...COMPACT_TERRITORY },
  { t: 0.46, ...COMPACT_TERRITORY },
  { t: 0.56, ...COMPACT_FIELDS },
  { t: 0.74, ...COMPACT_FIELDS },
  { t: 0.84, ...COMPACT_INSPECT },
  { t: 0.92, ...COMPACT_INSPECT },
  { t: 0.96, ...COMPACT_UNFOLD },
  { t: 1, ...COMPACT_EXIT },
];

export const BEATS = [
  { id: "hero", in: 0, peak: 0, hold: 0.16, out: 0.22 },
  { id: "person", in: 0.26, peak: 0.32, hold: 0.44, out: 0.48 },
  { id: "fields", in: 0.54, peak: 0.6, hold: 0.72, out: 0.76 },
  { id: "inspect", in: 0.82, peak: 0.87, hold: 0.92, out: 0.95 },
  { id: "unfold", in: 0.93, peak: 0.96, hold: 0.985, out: 1 },
];

export const HOLD_POINTS = {
  hero: 0,
  person: 0.38,
  fields: 0.66,
  inspect: 0.9,
  unfold: 0.97,
};

export const SNAP_POINTS = [
  HOLD_POINTS.hero,
  HOLD_POINTS.person,
  HOLD_POINTS.fields,
  HOLD_POINTS.inspect,
  HOLD_POINTS.unfold,
];

export const CHAPTERS = [
  { id: "atlas", code: "01", label: "Atlas", pinAt: HOLD_POINTS.hero, href: "#atlas-stage" },
  { id: "person", code: "02", label: "Person", pinAt: HOLD_POINTS.person, href: "#atlas-person" },
  { id: "expertise", code: "03", label: "Expertise", pinAt: HOLD_POINTS.fields, href: "#atlas-craft" },
  { id: "path", code: "04", label: "Path", pinAt: null, href: "#atlas-path" },
  { id: "work", code: "05", label: "Work", pinAt: null, href: "#projects" },
];

export const NODES = [
  {
    id: "home",
    label: "Thrissur",
    lat: 10.53,
    lon: 76.21,
    kind: "place",
    highlight: ["person"],
  },
  {
    id: "coimbatore",
    label: "Coimbatore",
    lat: 11.02,
    lon: 76.96,
    kind: "place",
    highlight: ["person", "unfold"],
  },
  {
    id: "trivandrum",
    label: "Trivandrum",
    lat: 8.52,
    lon: 76.94,
    kind: "place",
    highlight: ["unfold"],
  },
  {
    id: "sharjah",
    label: "Sharjah",
    lat: 25.35,
    lon: 55.42,
    kind: "place",
    highlight: ["inspect", "unfold"],
  },
  {
    id: "chennai",
    label: "Chennai",
    lat: 13.08,
    lon: 80.27,
    kind: "place",
    highlight: ["unfold"],
  },
  {
    id: "video",
    label: "Video analytics",
    lat: 24.1,
    lon: 54.2,
    kind: "field",
    highlight: ["fields", "inspect"],
  },
  {
    id: "nlp",
    label: "NLP & agents",
    lat: 12.4,
    lon: 78.1,
    kind: "field",
    highlight: ["fields"],
  },
  {
    id: "sensors",
    label: "Sensor intelligence",
    lat: 7.4,
    lon: 77.6,
    kind: "field",
    highlight: ["fields"],
  },
  {
    id: "production",
    label: "Production ML",
    lat: 26.8,
    lon: 56.8,
    kind: "field",
    highlight: ["fields"],
  },
];

export const PATH_EDGES = [
  ["home", "coimbatore"],
  ["coimbatore", "trivandrum"],
  ["trivandrum", "sharjah"],
  ["sharjah", "chennai"],
];

export const FIELDS = [
  {
    code: "01",
    id: "video",
    title: "Video analytics",
    copy: "Real-time insight from crowded spaces and retail floors.",
    disciplines: ["Computer Vision", "Modelling", "Data Visualization"],
  },
  {
    code: "02",
    id: "nlp",
    title: "NLP & AI agents",
    copy: "Systems that answer questions and turn data into reports.",
    disciplines: ["Natural Language Processing", "Prompt Engineering", "AI agents"],
  },
  {
    code: "03",
    id: "sensors",
    title: "Sensor intelligence",
    copy: "High-fidelity pipelines that keep messy signals usable.",
    disciplines: ["Data Science", "Machine Learning", "Debugging"],
  },
  {
    code: "04",
    id: "production",
    title: "Production ML",
    copy: "Architecture that stays interpretable when it ships.",
    disciplines: ["DevOps", "Data Structures", "Modelling"],
  },
];

const PAPER = {
  forest: 0,
  ink: "#1e3a2f",
  muted: "#5a6b60",
  paper: "#f4efe4",
  bgA: "#f8f4ea",
  bgB: "#f4efe4",
  bgC: "#e8efe6",
  glow: "#1e3a2f",
  glowAlpha: 0.14,
  fog: "#eef2e6",
  grid: "#1e3a2f",
  gridAlpha: 0.045,
  ctaBg: "#1e3a2f",
  ctaFg: "#f7f5ee",
  shadow: "rgba(244, 239, 228, 0.9)",
};

const LAND = {
  ...PAPER,
  bgA: "#f4f7f0",
  bgB: "#eaf2e8",
  bgC: "#dce8da",
  glow: "#2d8a62",
  glowAlpha: 0.18,
  fog: "#e4ecdc",
  forest: 0.35,
};

const CHART = {
  ...PAPER,
  bgA: "#eef4ec",
  bgB: "#e4eee4",
  bgC: "#d5e6d6",
  glow: "#1f6b4a",
  glowAlpha: 0.22,
  fog: "#dce8d8",
  forest: 0.7,
};

const CLOSE = {
  ...PAPER,
  bgA: "#e7eee4",
  bgB: "#dce8dc",
  bgC: "#cfe0d0",
  glow: "#3d9b6e",
  glowAlpha: 0.26,
  fog: "#d4e2d4",
  forest: 1,
};

const PAPER_DARK = {
  forest: 0,
  ink: "#f4f1e8",
  muted: "#c5d4c8",
  paper: "#122018",
  bgA: "#101c16",
  bgB: "#0e1a14",
  bgC: "#0c1812",
  glow: "#8fbfa4",
  glowAlpha: 0.2,
  fog: "#0e1a14",
  grid: "#f4f1e8",
  gridAlpha: 0.045,
  ctaBg: "#f4f1e8",
  ctaFg: "#0e1a14",
  shadow: "rgba(14, 26, 20, 0.88)",
};

const LAND_DARK = {
  ...PAPER_DARK,
  bgA: "#122018",
  bgB: "#101c16",
  bgC: "#0e1a14",
  glow: "#8fbfa4",
  glowAlpha: 0.24,
  fog: "#101c16",
  forest: 0.35,
};

const CHART_DARK = {
  ...PAPER_DARK,
  bgA: "#14241c",
  bgB: "#122018",
  bgC: "#101c16",
  glow: "#7fb89a",
  glowAlpha: 0.28,
  fog: "#122018",
  forest: 0.7,
};

const CLOSE_DARK = {
  ...PAPER_DARK,
  bgA: "#163026",
  bgB: "#14241c",
  bgC: "#122018",
  glow: "#9fd4b4",
  glowAlpha: 0.32,
  fog: "#14241c",
  forest: 1,
};

export const PALETTES = [
  { t: 0, ...PAPER },
  { t: 0.16, ...PAPER },
  { t: 0.32, ...LAND },
  { t: 0.62, ...CHART },
  { t: 0.86, ...CLOSE },
  { t: 0.95, ...LAND },
  { t: 1, ...PAPER },
];

export const PALETTES_DARK = [
  { t: 0, ...PAPER_DARK },
  { t: 0.16, ...PAPER_DARK },
  { t: 0.32, ...LAND_DARK },
  { t: 0.62, ...CHART_DARK },
  { t: 0.86, ...CLOSE_DARK },
  { t: 0.95, ...LAND_DARK },
  { t: 1, ...PAPER_DARK },
];

function currentTheme() {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

function rgbToHex(rgb) {
  return `#${rgb
    .map((channel) => Math.round(channel).toString(16).padStart(2, "0"))
    .join("")}`;
}

function lerpHex(a, b, t) {
  const from = hexToRgb(a);
  const to = hexToRgb(b);
  return rgbToHex([
    lerp(from[0], to[0], t),
    lerp(from[1], to[1], t),
    lerp(from[2], to[2], t),
  ]);
}

function rgbaFromHex(hex, alpha) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function sampleStops(stops, progress, ease = smoothstep) {
  const p = clamp01(progress);
  let index = 0;
  while (index < stops.length - 1 && stops[index + 1].t < p) index += 1;
  const a = stops[index];
  const b = stops[Math.min(index + 1, stops.length - 1)];
  const t = ease(0, 1, (p - a.t) / (b.t - a.t || 1));
  return { a, b, t };
}

export function samplePalette(progress, theme = currentTheme()) {
  const { a, b, t } = sampleStops(theme === "dark" ? PALETTES_DARK : PALETTES, progress);
  const glow = lerpHex(a.glow, b.glow, t);
  const grid = lerpHex(a.grid, b.grid, t);
  const glowAlpha = lerp(a.glowAlpha, b.glowAlpha, t);
  const gridAlpha = lerp(a.gridAlpha, b.gridAlpha, t);

  return {
    forest: lerp(a.forest, b.forest, t),
    ink: lerpHex(a.ink, b.ink, t),
    muted: lerpHex(a.muted, b.muted, t),
    paper: lerpHex(a.paper, b.paper, t),
    bgA: lerpHex(a.bgA, b.bgA, t),
    bgB: lerpHex(a.bgB, b.bgB, t),
    bgC: lerpHex(a.bgC, b.bgC, t),
    fog: lerpHex(a.fog, b.fog, t),
    ctaBg: lerpHex(a.ctaBg, b.ctaBg, t),
    ctaFg: lerpHex(a.ctaFg, b.ctaFg, t),
    shadow: t < 0.5 ? a.shadow : b.shadow,
    glow: rgbaFromHex(glow, glowAlpha),
    grid: rgbaFromHex(grid, gridAlpha),
    line: rgbaFromHex(lerpHex(a.ink, b.ink, t), lerp(0.12, 0.16, t)),
    accent: glow,
  };
}

export function sampleShots(progress, compact = false) {
  const { a, b, t } = sampleStops(compact ? SHOTS_COMPACT : SHOTS, progress, smootherstep);

  return {
    modelPos: lerpVec(a.modelPos, b.modelPos, t),
    modelRot: lerpVec(a.modelRot, b.modelRot, t),
    modelScale: lerp(a.modelScale, b.modelScale, t),
    camPos: lerpVec(a.camPos, b.camPos, t),
    camLook: lerpVec(a.camLook, b.camLook, t),
    camFov: lerp(a.camFov, b.camFov, t),
  };
}

export function beatOpacity(progress, beat) {
  if (progress < beat.in || progress > beat.out) return 0;
  if (progress <= beat.peak) {
    if (beat.peak <= beat.in) return 1;
    return smootherstep(beat.in, beat.peak, progress);
  }
  if (progress < beat.hold) return 1;
  return 1 - smootherstep(beat.hold, beat.out, progress);
}

export function beatTranslate(progress, beat) {
  const opacity = beatOpacity(progress, beat);
  const entering = progress <= beat.peak;
  const travel = 1 - opacity;
  const y = entering ? travel * 22 : travel * -12;
  let x = 0;
  if (beat.id === "person") x = entering ? travel * 32 : travel * 10;
  if (beat.id === "fields") x = entering ? travel * -32 : travel * -10;
  return { x, y };
}

export function holdStrength(progress) {
  let best = 0;
  for (const beat of BEATS) {
    if (progress >= beat.peak && progress <= beat.hold) return 1;
    if (progress >= beat.in && progress < beat.peak) {
      const opacity = beatOpacity(progress, beat);
      best = Math.max(best, smootherstep(0.28, 0.94, opacity));
    } else if (progress > beat.hold && progress <= beat.out) {
      const opacity = beatOpacity(progress, beat);
      best = Math.max(best, smootherstep(0.1, 0.88, opacity));
    }
  }
  return best;
}

export function sceneRest(progress) {
  const hold = holdStrength(progress);
  const chapter = storyChapter(progress);
  if (chapter === "hero") return hold * 0.12;
  if (chapter === "unfold") return hold * 0.28;
  return hold * 0.7;
}

export function scrimStrength(progress) {
  let best = 0;
  for (const beat of BEATS) {
    const opacity = beatOpacity(progress, beat);
    if (opacity <= 0) continue;
    const weight =
      beat.id === "hero" ? 0.18 : beat.id === "unfold" ? 0.5 : 0.92;
    best = Math.max(best, opacity * weight);
  }
  return best;
}

export function storyChapter(progress) {
  if (progress < 0.22) return "hero";
  if (progress < 0.5) return "person";
  if (progress < 0.78) return "fields";
  if (progress < 0.93) return "inspect";
  return "unfold";
}

export function railChapterIndex(pinProgress, catalogId) {
  if (catalogId === "work") return 4;
  if (catalogId === "path") return 3;
  if (catalogId === "expertise") return 2;
  if (pinProgress < 0.22) return 0;
  if (pinProgress < 0.52) return 1;
  return 2;
}

export function nodeEmphasis(node, chapterId) {
  if (node.highlight.includes(chapterId)) return 1;
  if (chapterId === "hero") return 0.2;
  if (chapterId === "person" && node.kind === "place") return 0.42;
  if (chapterId === "fields" && node.kind === "field") return 0.92;
  if (chapterId === "inspect") {
    if (node.id === "video" || node.id === "sharjah") return 1;
    return 0.1;
  }
  if (chapterId === "unfold") return node.kind === "place" ? 0.62 : 0.16;
  return 0.1;
}

export function createScrollState() {
  return {
    progress: 0,
    smoothed: 0,
    velocity: 0,
    velSmoothed: 0,
    pointerX: 0,
    pointerY: 0,
    pointerSX: 0,
    pointerSY: 0,
    reduced: false,
    compact: false,
    hold: 1,
    rest: 0,
    scrim: 0,
    chapter: "hero",
    forest: 0,
    fog: "#eef2e6",
    entry: 1,
  };
}
