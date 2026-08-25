export const ROLE =
  "Senior Engineer – AI | Python Enthusiast | Building Intelligent Systems";

export const MAP = { w: 1000, h: 720 };

export const DESTINATIONS = [
  {
    id: "atlas",
    code: "01",
    title: "Atlas",
    path: "/atlas",
    copy: "My journey, skills, projects & experience",
    x: 300,
    y: 230,
    jx: 368,
    jy: 244,
    cam: { cx: 16, cy: 10 },
    pin: { left: "4%", top: "8%" },
  },
  {
    id: "blog",
    code: "02",
    title: "Blog",
    path: "/blog",
    copy: "Field notes, essays & lessons learned",
    x: 700,
    y: 215,
    jx: 640,
    jy: 226,
    cam: { cx: -16, cy: 10 },
    pin: { left: "74%", top: "6%" },
  },
  {
    id: "scribble",
    code: "03",
    title: "Scribble",
    path: "/scribble",
    copy: "Sketches, experiments & unfinished ideas",
    x: 280,
    y: 500,
    jx: 372,
    jy: 458,
    cam: { cx: 16, cy: -12 },
    pin: { left: "3%", top: "48%" },
  },
  {
    id: "contact",
    code: "04",
    title: "Contact",
    path: "/contact",
    copy: "Let's connect & build together",
    x: 740,
    y: 520,
    jx: 670,
    jy: 534,
    cam: { cx: -18, cy: -12 },
    pin: { left: "auto", right: "1%", top: "48%" },
  },
];

export const JUNCTIONS = [
  { id: "atlas-out", dest: "atlas", x: 368, y: 244 },
  { id: "blog-in", dest: "blog", x: 640, y: 226 },
  { id: "blog-out", dest: "blog", x: 655, y: 268 },
  { id: "scribble-in", dest: "scribble", x: 372, y: 458 },
  { id: "scribble-out", dest: "scribble", x: 386, y: 528 },
  { id: "contact-in", dest: "contact", x: 670, y: 534 },
];

export const ROUTES = [
  "M 368 244 C 478 148, 548 140, 640 226",
  "M 655 268 C 575 348, 470 372, 372 458",
  "M 386 528 C 498 622, 562 608, 670 534",
];

export const TRAVEL_D =
  "M 368 244 C 478 148, 548 140, 640 226 L 655 268 C 575 348, 470 372, 372 458 L 386 528 C 498 622, 562 608, 670 534";
