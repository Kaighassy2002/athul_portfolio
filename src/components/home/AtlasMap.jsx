import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { DESTINATIONS, JUNCTIONS, ROUTES, TRAVEL_D } from "./destinations";

const ATLAS_ISLE =
  "M-90 14 C-82 -38, -30 -62, 10 -52 C56 -42, 96 -6, 88 24 C80 54, 28 66, -12 60 C-56 54, -98 40, -90 14 Z";
const BLOG_ISLE =
  "M-76 12 C-70 -34, -24 -52, 14 -44 C58 -36, 86 -2, 78 24 C70 50, 24 60, -10 54 C-50 48, -82 34, -76 12 Z";
const SCRIBBLE_ISLE =
  "M-82 10 C-74 -36, -20 -54, 18 -46 C62 -38, 92 0, 84 26 C76 52, 26 62, -8 56 C-52 50, -90 34, -82 10 Z";
const CONTACT_ISLE =
  "M-88 16 C-80 -32, -22 -56, 20 -48 C66 -40, 100 2, 90 28 C82 56, 30 68, -10 62 C-54 56, -96 42, -88 16 Z";

function Pine({ x, y, s = 1, dark = false }) {
  const shade = dark ? "#3a5340" : "#4a6748";
  const mid = dark ? "#4a6a4c" : "#5d7e54";
  const hi = dark ? "#5b7d58" : "#73956a";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="1.2" cy="9" rx="7.2" ry="2.1" fill="#1e3a2f" opacity="0.16" />
      <rect x="-1.15" y="0" width="2.3" height="9" rx="0.7" fill="#6a4e36" />
      <path d="M0 -8.5 L8.6 8 H-8.6 Z" fill={shade} />
      <path d="M0 -8.5 L-8.6 8 L0 4.2 Z" fill={mid} />
      <path d="M0 -14 L6.8 -1.2 H-6.8 Z" fill={mid} />
      <path d="M0 -14 L-6.8 -1.2 L0 -4 Z" fill={hi} />
      <path d="M0 -19.2 L4.6 -8.4 H-4.6 Z" fill={hi} />
    </g>
  );
}

function Rock({ x, y, s = 1, rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx="1.4" cy="5.2" rx="8.4" ry="2.2" fill="#1e3a2f" opacity="0.14" />
      <path d="M-8.2 4.2 C-9.2 -1.6, -3.4 -6.6, 2.2 -5.8 C8.4 -4.8, 10.4 1.2, 7.2 5.2 C3.2 8.2, -6 8.2, -8.2 4.2 Z" fill="#8d7d68" />
      <path d="M-3.2 -3.8 C1.2 -6, 6.4 -1.8, 5.2 2.2 L-2 3 Z" fill="#b3a48e" opacity="0.72" />
    </g>
  );
}

function Isle({ d, grass, moss, cliff }) {
  return (
    <g>
      <path d={d} transform="translate(7 18)" fill="#1e3a2f" opacity="0.12" />
      <path d={d} transform="translate(4 12)" fill="#5c4a36" />
      <path d={d} transform="translate(2 6)" fill={cliff} />
      <path d={d} fill={grass} />
      <path d={d} fill={moss} opacity="0.32" transform="translate(-6 -8) scale(0.74)" />
    </g>
  );
}

function Peak({ x, y, w, h, snow = true }) {
  const left = `${x - w / 2},${y}`;
  const right = `${x + w / 2},${y}`;
  const top = `${x},${y - h}`;
  const ridgeTop = `${x + w * 0.05},${y - h * 0.12}`;
  const ridge = `${x + w * 0.07},${y}`;
  return (
    <g>
      <ellipse cx={x + 4} cy={y + 6} rx={w * 0.4} ry={h * 0.08} fill="#1e3a2f" opacity="0.1" />
      <polygon points={`${left} ${top} ${ridgeTop}`} fill="#c9c3b6" />
      <polygon points={`${right} ${top} ${ridgeTop} ${ridge}`} fill="#7a7468" />
      {snow && (
        <g>
          <polygon
            points={`${top} ${x - w * 0.16},${y - h * 0.62} ${x + w * 0.04},${y - h * 0.55} ${x + w * 0.13},${y - h * 0.68}`}
            fill="#f4f0e8"
          />
          <polygon
            points={`${top} ${x + w * 0.13},${y - h * 0.68} ${x + w * 0.04},${y - h * 0.55}`}
            fill="#d4cfc6"
          />
        </g>
      )}
    </g>
  );
}

function Cottage() {
  return (
    <g transform="translate(-6, 4)">
      <ellipse cx="8" cy="24" rx="28" ry="7" fill="#1e3a2f" opacity="0.1" />
      <path d="M-20 22 L-20 -2 L22 -2 L22 22 Z" fill="#efe6d2" />
      <path d="M22 -2 L38 8 L38 28 L22 22 Z" fill="#d4c8b0" />
      <path d="M-24 -2 L8 -28 L40 8 L22 -2 Z" fill="#8a4e36" />
      <path d="M8 -28 L40 8 L22 -2 Z" fill="#6d3c2a" />
      <rect x="24" y="-14" width="7" height="12" fill="#cfc4b0" />
      <rect x="-8" y="6" width="9" height="16" fill="#5c3a28" />
      <rect x="-16" y="2" width="8" height="8" fill="#7a97a8" />
      <rect x="4" y="2" width="8" height="8" fill="#7a97a8" />
    </g>
  );
}

function Windmill() {
  return (
    <g transform="translate(0, 2)">
      <ellipse cx="1" cy="30" rx="16" ry="5" fill="#1e3a2f" opacity="0.12" />
      <path d="M-11 30 L-8 -16 L8 -16 L11 30 Z" fill="#efe6d2" />
      <path d="M-8 -16 L8 -16 L6.2 30 L-6.2 30 Z" fill="#d8ccb4" />
      <path d="M-12 -16 L0 -36 L12 -16 Z" fill="#6d4a32" />
      <path d="M0 -36 L12 -16 L6 -16 Z" fill="#543824" />
      <rect x="-3.2" y="16" width="6.4" height="14" fill="#5c3a28" />
      <rect x="-8" y="2" width="6" height="7" fill="#7a97a8" />
      <g transform="translate(0 -8)">
        <g className="atlas-mill">
          <circle r="3.4" fill="#5c3a28" />
          <rect x="-3.1" y="-28" width="6.2" height="24" rx="1.2" fill="#c4b496" />
          <rect x="-3.1" y="4" width="6.2" height="24" rx="1.2" fill="#a89878" />
          <rect x="-28" y="-3.1" width="24" height="6.2" rx="1.2" fill="#c4b496" />
          <rect x="4" y="-3.1" width="24" height="6.2" rx="1.2" fill="#a89878" />
        </g>
      </g>
    </g>
  );
}

function Lighthouse() {
  return (
    <g>
      <g transform="translate(10, 4)">
        <ellipse cx="0" cy="28" rx="16" ry="5" fill="#1e3a2f" opacity="0.12" />
        <path d="M-11 28 L-7 -30 L7 -30 L11 28 Z" fill="#f3eee6" />
        <path d="M-7 -30 L7 -30 L5.4 28 L-5.4 28 Z" fill="#e4ddd0" />
        <path d="M-8.2 4 H8.2" stroke="#3d5a42" strokeWidth="7.2" />
        <rect x="-8" y="-38" width="16" height="9" fill="#f3eee6" />
        <rect x="-6.4" y="-36" width="12.8" height="5" fill="#5d7a58" />
        <path d="M-8.6 -38 L0 -50 L8.6 -38 Z" fill="#3d4a42" />
        <g className="atlas-beacon" opacity="0.2">
          <polygon points="0,-42 54,-20 54,-10 0,-36" fill="#f0d56a" />
          <polygon points="0,-42 -46,-24 -46,-14 0,-36" fill="#f0d56a" />
        </g>
      </g>
      <g transform="translate(-52, 16)">
        <ellipse cx="12" cy="16" rx="20" ry="5" fill="#1e3a2f" opacity="0.08" />
        <rect x="0" y="0" width="24" height="16" fill="#efe4cf" />
        <path d="M-3 0 L12 -14 L27 0 Z" fill="#6d4a32" />
        <rect x="9" y="8" width="6" height="8" fill="#5c3a28" />
      </g>
      <g transform="translate(48, 36)">
        <rect x="-34" y="0" width="68" height="4.5" rx="1" fill="#8a623c" />
        <rect x="-30" y="4.5" width="3.5" height="11" fill="#6a4a2c" />
        <rect x="26" y="4.5" width="3.5" height="11" fill="#6a4a2c" />
        <rect x="-4" y="4.5" width="3.5" height="9" fill="#6a4a2c" />
      </g>
    </g>
  );
}

function AtlasIsle({ active }) {
  return (
    <g className={`atlas-isle${active ? " is-on" : ""}`}>
      <Isle d={ATLAS_ISLE} grass="#7d9458" moss="#93ad6e" cliff="#8d7354" />
      <Peak x={-34} y={18} w={72} h={54} snow={false} />
      <Peak x={8} y={14} w={88} h={88} />
      <Peak x={46} y={20} w={64} h={50} snow={false} />
      <Pine x={-62} y={10} s={0.84} dark />
      <Pine x={-46} y={22} s={0.62} />
      <Pine x={60} y={8} s={0.78} dark />
      <Pine x={74} y={-4} s={0.52} />
      <Rock x={-70} y={26} s={0.9} rot={-12} />
      <Rock x={52} y={28} s={0.7} rot={18} />
    </g>
  );
}

function BlogIsle({ active }) {
  return (
    <g className={`atlas-isle${active ? " is-on" : ""}`}>
      <Isle d={BLOG_ISLE} grass="#6f8f4c" moss="#88a862" cliff="#8a6f4c" />
      <Cottage />
      <Pine x={-54} y={8} s={0.9} dark />
      <Pine x={-38} y={20} s={0.66} />
      <Pine x={56} y={6} s={0.82} dark />
      <Pine x={68} y={-8} s={0.54} />
      <Pine x={-62} y={-10} s={0.48} />
      <Rock x={-16} y={30} s={0.75} />
    </g>
  );
}

function ScribbleIsle({ active }) {
  return (
    <g className={`atlas-isle${active ? " is-on" : ""}`}>
      <Isle d={SCRIBBLE_ISLE} grass="#7a944c" moss="#97b06c" cliff="#8c734c" />
      <Windmill />
      <Pine x={54} y={8} s={0.82} dark />
      <Pine x={40} y={22} s={0.58} />
      <Pine x={-64} y={12} s={0.72} />
      <Pine x={66} y={-10} s={0.5} />
      <Rock x={-52} y={26} s={0.85} rot={-8} />
    </g>
  );
}

function ContactIsle({ active }) {
  return (
    <g className={`atlas-isle${active ? " is-on" : ""}`}>
      <ellipse cx="18" cy="42" rx="118" ry="34" fill="#b9cbc7" opacity="0.45" />
      <ellipse cx="28" cy="48" rx="86" ry="22" fill="#c5d4d0" opacity="0.35" />
      <Isle d={CONTACT_ISLE} grass="#6e8f55" moss="#8aaa68" cliff="#c2b089" />
      <Lighthouse />
      <Pine x={-72} y={-2} s={0.7} dark />
      <Pine x={74} y={-6} s={0.54} />
      <Rock x={-60} y={28} s={0.8} />
    </g>
  );
}

const PLACE = {
  atlas: AtlasIsle,
  blog: BlogIsle,
  scribble: ScribbleIsle,
  contact: ContactIsle,
};

function nearestProgress(path, x, y) {
  const total = path.getTotalLength();
  if (!total) return 0;

  let bestT = 0;
  let bestD = Infinity;
  const coarse = 320;
  for (let i = 0; i <= coarse; i += 1) {
    const t = i / coarse;
    const point = path.getPointAtLength(t * total);
    const dx = point.x - x;
    const dy = point.y - y;
    const dist = dx * dx + dy * dy;
    if (dist < bestD) {
      bestD = dist;
      bestT = t;
    }
  }

  const span = 1 / coarse;
  let low = Math.max(0, bestT - span);
  let high = Math.min(1, bestT + span);
  for (let i = 0; i < 18; i += 1) {
    const left = low + (high - low) / 3;
    const right = high - (high - low) / 3;
    const a = path.getPointAtLength(left * total);
    const b = path.getPointAtLength(right * total);
    const da = (a.x - x) ** 2 + (a.y - y) ** 2;
    const db = (b.x - x) ** 2 + (b.y - y) ** 2;
    if (da < db) high = right;
    else low = left;
  }

  return (low + high) / 2;
}

function placeOnPath(path, marker, t) {
  if (!path || !marker) return;
  const total = path.getTotalLength();
  const point = path.getPointAtLength(t * total);
  marker.setAttribute("transform", `translate(${point.x} ${point.y})`);
}

function RouteTraveler({ targetId }) {
  const pathRef = useRef(null);
  const markerRef = useRef(null);
  const progress = useRef({ t: 0 });
  const stops = useRef(null);
  const tween = useRef(null);

  useLayoutEffect(() => {
    const path = pathRef.current;
    const marker = markerRef.current;
    if (!path || !marker) return undefined;

    stops.current = Object.fromEntries(
      DESTINATIONS.map((dest) => [dest.id, nearestProgress(path, dest.jx, dest.jy)])
    );
    progress.current.t = stops.current.atlas ?? 0;
    placeOnPath(path, marker, progress.current.t);

    return () => tween.current?.kill();
  }, []);

  useEffect(() => {
    const path = pathRef.current;
    const marker = markerRef.current;
    const table = stops.current;
    if (!path || !marker || !table || !targetId) return undefined;

    const end = table[targetId];
    if (typeof end !== "number") return undefined;

    tween.current?.kill();

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      progress.current.t = end;
      placeOnPath(path, marker, end);
      return undefined;
    }

    const start = progress.current.t;
    const delta = Math.abs(end - start);
    if (delta < 0.001) {
      placeOnPath(path, marker, end);
      return undefined;
    }

    tween.current = gsap.to(progress.current, {
      t: end,
      duration: 0.28 + delta * 0.42,
      ease: "power2.inOut",
      onUpdate: () => placeOnPath(path, marker, progress.current.t),
    });

    return () => tween.current?.kill();
  }, [targetId]);

  return (
    <g className="atlas-markers">
      <path ref={pathRef} d={TRAVEL_D} fill="none" stroke="none" pointerEvents="none" />
      {JUNCTIONS.map((junc) => (
        <g
          key={junc.id}
          className={`atlas-node${targetId === junc.dest ? " is-on" : ""}`}
          transform={`translate(${junc.x} ${junc.y})`}
        >
          <circle r="8.2" className="atlas-junction-halo" />
          <circle r="6" className="atlas-junction-ring" strokeWidth="2.6" />
        </g>
      ))}
      <g ref={markerRef} className="atlas-marker atlas-traveler">
        <g className="atlas-marker-core">
          <circle r="8.6" className="atlas-junction-halo" />
          <circle r="6.2" className="atlas-junction-ring" strokeWidth="2.6" />
        </g>
      </g>
    </g>
  );
}

function Ripples({ x, y, rx, ry }) {
  return (
    <g className="atlas-ripples" transform={`translate(${x} ${y})`}>
      {[1, 0.78, 0.58, 0.4].map((scale) => (
        <ellipse key={scale} rx={rx * scale} ry={ry * scale} />
      ))}
    </g>
  );
}

function Cartography() {
  return (
    <g className="atlas-cartography" fill="none" stroke="#1e3a2f" opacity="0.1">
      {[120, 210, 310, 420, 540].map((r) => (
        <ellipse key={r} cx="500" cy="360" rx={r} ry={r * 0.64} />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`v-${i}`} x1={40 + i * 120} y1="20" x2={40 + i * 120} y2="700" />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <line key={`h-${i}`} x1="20" y1={40 + i * 120} x2="980" y2={40 + i * 120} />
      ))}
    </g>
  );
}

function GlobeMark() {
  return (
    <g className="atlas-globe" transform="translate(500 36)" aria-hidden="true">
      <circle r="30" fill="#1e3a2f" opacity="0.08" />
      <circle r="30" fill="none" stroke="#1e3a2f" strokeWidth="1.1" opacity="0.35" />
      <ellipse rx="12" ry="30" fill="none" stroke="#1e3a2f" strokeWidth="0.7" opacity="0.28" />
      <ellipse rx="30" ry="11" fill="none" stroke="#1e3a2f" strokeWidth="0.7" opacity="0.28" />
      <path
        d="M-16 -8 C-8 -18, 8 -16, 14 -6 C6 2, -4 6, -16 -8 Z"
        fill="#1e3a2f"
        opacity="0.16"
      />
    </g>
  );
}

function HarborShip() {
  return (
    <g className="atlas-boat">
      <ellipse cx="8" cy="26" rx="34" ry="7" fill="#1e3a2f" opacity="0.14" />
      <path d="M-32 12 C-22 26, 34 26, 46 12 L38 12 C28 19, -14 19, -24 12 Z" fill="#5a3420" />
      <path d="M-26 12 C-16 20, 28 20, 38 12 Z" fill="#7a4a2c" />
      <path d="M-10 12 V-38" stroke="#5c3a28" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M12 12 V-30" stroke="#5c3a28" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M-8.6 -36 L16 8 L-8.6 8 Z"
        fill="#fff8ec"
        stroke="#6d4a32"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path
        d="M13.4 -28 L30 8 L13.4 8 Z"
        fill="#f3e6d0"
        stroke="#6d4a32"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M-30 12 L-38 6" stroke="#6a4a2c" strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}

function AtlasMap({ hovered, onHover, onLeave }) {
  const lastJunction = useRef("atlas");
  if (hovered) lastJunction.current = hovered;
  const travelerId = hovered || lastJunction.current;
  const cam = DESTINATIONS.find((item) => item.id === hovered)?.cam ?? { cx: 0, cy: 0 };

  return (
    <div
      className={`atlas-map${hovered ? ` is-focus is-focus--${hovered}` : ""}`}
      style={{ "--cx": `${cam.cx}px`, "--cy": `${cam.cy}px` }}
    >
      <div className="atlas-frame">
        <div className="atlas-layer atlas-layer--bg" aria-hidden="true">
          <svg viewBox="0 0 1000 720" className="atlas-svg" preserveAspectRatio="xMidYMid meet">
            <Cartography />
            <Ripples x={300} y={248} rx={132} ry={72} />
            <Ripples x={700} y={232} rx={118} ry={64} />
            <Ripples x={280} y={518} rx={124} ry={68} />
            <Ripples x={740} y={538} rx={140} ry={76} />
            <GlobeMark />
          </svg>
        </div>

        <div className="atlas-layer atlas-layer--art">
          <svg viewBox="0 0 1000 720" className="atlas-svg" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="isleSoft" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#1e3a2f" floodOpacity="0.14" />
              </filter>
              {ROUTES.map((d, i) => (
                <mask id={`routeMask${i}`} key={i}>
                  <path
                    className="atlas-route-draw"
                    d={d}
                    fill="none"
                    stroke="#fff"
                    strokeWidth="16"
                    strokeLinecap="round"
                    pathLength="1"
                    strokeDasharray="1"
                    strokeDashoffset="1"
                  />
                </mask>
              ))}
            </defs>
            <g filter="url(#isleSoft)" className="atlas-isles">
              {DESTINATIONS.map((dest) => {
                const Art = PLACE[dest.id];
                return (
                  <g
                    key={dest.id}
                    className={`atlas-region atlas-region--${dest.id}${hovered === dest.id ? " is-on" : ""}`}
                    transform={`translate(${dest.x} ${dest.y}) scale(0.88)`}
                  >
                    <Art active={hovered === dest.id} />
                  </g>
                );
              })}
            </g>
            <path className="atlas-route-glow" d={TRAVEL_D} fill="none" />
            {ROUTES.map((d, i) => (
              <path
                key={i}
                className="atlas-route"
                d={d}
                fill="none"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeDasharray="8 10"
                mask={`url(#routeMask${i})`}
              />
            ))}
            <RouteTraveler targetId={travelerId} />
          </svg>
        </div>

        <div className="atlas-layer atlas-layer--ui">
          <div className="atlas-ship-slot" aria-hidden="true">
            <svg className="atlas-ship-svg" viewBox="-42 -42 94 78">
              <HarborShip />
            </svg>
          </div>
          {DESTINATIONS.map((dest) => (
            <Link
              key={dest.id}
              to={dest.path}
              className={`home-pin home-pin--${dest.id}${hovered === dest.id ? " is-on" : ""}`}
              style={dest.pin}
              onMouseEnter={() => onHover(dest.id)}
              onMouseLeave={onLeave}
              onFocus={() => onHover(dest.id)}
              onBlur={onLeave}
            >
              <span className="home-pin-badge">{dest.code}</span>
              <span className="home-pin-body">
                <strong>{dest.title}</strong>
                <em>{dest.copy}</em>
              </span>
            </Link>
          ))}
          {DESTINATIONS.map((dest) => (
            <Link
              key={`${dest.id}-hit`}
              to={dest.path}
              className={`atlas-hit atlas-hit--${dest.id}${hovered === dest.id ? " is-on" : ""}`}
              aria-label={`${dest.title}: ${dest.copy}`}
              onMouseEnter={() => onHover(dest.id)}
              onMouseLeave={onLeave}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AtlasMap;
