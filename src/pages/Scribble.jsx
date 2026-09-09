import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { listAllScribblesAPI, unwrapList } from "../service/allApi";
import Seo from "../components/Seo";
import {
  excerptFrom,
  formatDateParts,
  plateCoords,
} from "../utils/editorial";
import "../styles/scribble.css";

const KINDS = [
  { id: "thought", label: "Short thought", stamp: "Note" },
  { id: "sketch", label: "Sketch", stamp: "Sketch" },
  { id: "ui", label: "UI experiment", stamp: "UI" },
  { id: "code", label: "Code experiment", stamp: "Code" },
  { id: "design", label: "Design exploration", stamp: "Look" },
  { id: "idea", label: "Project idea", stamp: "Idea" },
];

const MARGIN_NOTES = [
  "keep this loose",
  "try again later",
  "almost there",
  "see atlas →",
  "unfinished on purpose",
];

function resolveKind(item, index) {
  const cat = (item.category || "").toLowerCase();
  if (/sketch|draw|doodle/.test(cat)) return KINDS[1];
  if (/ui|interface|layout/.test(cat)) return KINDS[2];
  if (/code|dev|script/.test(cat)) return KINDS[3];
  if (/design|visual|explore/.test(cat)) return KINDS[4];
  if (/idea|project|build/.test(cat)) return KINDS[5];
  if (/thought|note|margin/.test(cat)) return KINDS[0];
  return KINDS[index % KINDS.length];
}

function NotebookChart() {
  return (
    <svg className="scribble-chart" viewBox="0 0 720 160" aria-hidden="true">
      {[36, 64, 92, 120].map((y) => (
        <line key={y} x1="0" y1={y} x2="720" y2={y} />
      ))}
      <line className="scribble-chart-margin" x1="72" y1="8" x2="72" y2="152" />
      <path
        className="scribble-chart-route"
        d="M 88 118 C 180 40, 310 132, 430 70 S 610 28, 700 96"
      />
    </svg>
  );
}

function Paperclip() {
  return (
    <svg className="scribble-clip" viewBox="0 0 24 40" aria-hidden="true">
      <path d="M8 12 v14 a4 4 0 0 0 8 0 V8 a6 6 0 0 0 -12 0 v16" />
    </svg>
  );
}

function Squiggle() {
  return (
    <svg className="scribble-squiggle" viewBox="0 0 160 70" aria-hidden="true">
      <path d="M 8 42 C 28 12, 48 58, 72 30 S 118 8, 152 38" />
      <circle cx="28" cy="22" r="8" />
      <rect x="96" y="18" width="22" height="16" rx="2" />
    </svg>
  );
}

function ScribbleLeaf({ item, index }) {
  const kind = resolveKind(item, index);
  const { day, month, year } = formatDateParts(item.createdAt);
  const coords = plateCoords(index + 8);
  const excerpt = excerptFrom(item, 120);
  const noteNo = String(index + 1).padStart(2, "0");
  const annotation = index % 3 === 2 ? MARGIN_NOTES[index % MARGIN_NOTES.length] : null;
  const cover = item.coverImageUrl || item.coverImage;

  return (
    <Link
      to={`/scribble/${item._id}`}
      className={`scribble-leaf scribble-leaf--${kind.id}`}
    >
      {index % 5 === 0 ? <Paperclip /> : null}
      {annotation ? (
        <span className="scribble-annotation">{annotation}</span>
      ) : null}

      <div className="scribble-leaf-head">
        <span className="scribble-note-no">No. {noteNo}</span>
        <span className="scribble-stamp">{kind.stamp}</span>
      </div>

      <p className="scribble-kind">{item.category || kind.label}</p>
      <h3>{item.title || "Untitled"}</h3>

      {kind.id === "sketch" && !cover ? <Squiggle /> : null}
      {cover ? (
        <figure className="scribble-polaroid">
          <img src={cover} alt="" loading="lazy" />
        </figure>
      ) : null}

      {excerpt ? <p className="scribble-excerpt">{excerpt}</p> : null}

      <div className="scribble-leaf-foot">
        <time dateTime={item.createdAt}>
          {day} {month} {year}
        </time>
        <span className="scribble-coord">
          {coords.lat} / {coords.lng}
        </span>
        <span className="scribble-arrow" aria-hidden="true">
          →
        </span>
      </div>
    </Link>
  );
}

function Scribble() {
  const pageRef = useRef(null);
  const [allScribles, setAllScribles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedKind, setSelectedKind] = useState(null);

  const scribbleItems = useMemo(
    () =>
      allScribles
        .filter(
          (scribble) =>
            scribble.is_published && (scribble.type === "scribble" || !scribble.type)
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [allScribles]
  );

  const typedItems = useMemo(
    () =>
      scribbleItems.map((item, index) => ({
        item,
        index,
        kind: resolveKind(item, index),
      })),
    [scribbleItems]
  );

  const visibleItems = selectedKind
    ? typedItems.filter((entry) => entry.kind.id === selectedKind)
    : typedItems;

  useEffect(() => {
    const fetchScribbles = async () => {
      try {
        const response = await listAllScribblesAPI();
        if (response?.status !== 200) {
          throw new Error(response?.message || "Failed to load scribbles");
        }
        setAllScribles(unwrapList(response));
      } catch (error) {
        console.error("Error fetching scribbles:", error);
        setAllScribles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchScribbles();
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(
          ".scribble-kicker, .scribble-title, .scribble-lede, .scribble-chart, .scribble-mark, .scribble-aside",
          { clearProps: "all", opacity: 1 }
        );
        return;
      }

      gsap.fromTo(
        ".scribble-kicker, .scribble-title, .scribble-lede, .scribble-aside",
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1 }
      );
      gsap.fromTo(
        ".scribble-chart, .scribble-mark",
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 0.22, ease: "power2.out" }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (loading) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.fromTo(
        ".scribble-leaf, .scribble-empty, .scribble-skeleton",
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" }
      );
    }, pageRef);
    return () => ctx.revert();
  }, [loading, selectedKind]);

  return (
    <div className="scribble-page" ref={pageRef}>
      <Seo
        title="Scribble"
        description="Sketches, UI experiments, coding thoughts, and unfinished concepts from Athul Suresh."
        path="/scribble"
      />
      <Header />

      <section className="scribble-hero" id="main-content">
        <div className="scribble-grid" aria-hidden="true" />
        <div className="scribble-paper" aria-hidden="true" />
        <span className="scribble-mark scribble-mark--tl">Plate 03</span>
        <span className="scribble-mark scribble-mark--tr">Field journal</span>
        <span className="scribble-mark scribble-mark--bl">WIP</span>
        <span className="scribble-mark scribble-mark--br">Unfinished welcome</span>

        <div className="scribble-hero-layout">
          <div className="scribble-hero-copy">
            <p className="scribble-kicker">03 — Scribble</p>
            <div className="scribble-title-wrap">
              <NotebookChart />
              <h1 className="scribble-title">
                Ideas in
                <em>Progress</em>
              </h1>
            </div>
            <p className="scribble-lede">
              Sketches, UI experiments, coding thoughts, visual explorations, and
              unfinished concepts — the notebook beside the atlas.
            </p>
          </div>

          <aside className="scribble-aside">
            <span className="scribble-tape" aria-hidden="true" />
            <p className="scribble-hand">not every idea needs a map yet</p>
            <ul>
              <li>01  short thoughts</li>
              <li>02  sketches</li>
              <li>03  UI experiments</li>
              <li>04  code & design</li>
            </ul>
            <p className="scribble-aside-coord">10.5276° N · 76.2144° E</p>
          </aside>
        </div>
      </section>

      <section className="scribble-journal" id="scribble-journal">
        <div className="scribble-journal-head">
          <p className="scribble-kicker">The notebook</p>
          <h2>Pages from the desk</h2>
          <div className="scribble-legend" role="group" aria-label="Notebook types">
            <button
              type="button"
              className={`scribble-legend-item ${selectedKind === null ? "is-active" : ""}`}
              onClick={() => setSelectedKind(null)}
            >
              <span className="scribble-legend-dot" />
              All pages
            </button>
            {KINDS.map((kind) => (
              <button
                type="button"
                key={kind.id}
                className={`scribble-legend-item ${selectedKind === kind.id ? "is-active" : ""}`}
                onClick={() => setSelectedKind(kind.id)}
              >
                <span className="scribble-legend-dot" />
                {kind.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="scribble-board">
            <div className="scribble-skeleton scribble-leaf--thought" />
            <div className="scribble-skeleton scribble-leaf--sketch" />
            <div className="scribble-skeleton scribble-leaf--idea" />
          </div>
        ) : visibleItems.length === 0 ? (
          <p className="scribble-empty">
            {scribbleItems.length === 0
              ? "The notebook is still blank. A first scribble is coming."
              : "Nothing on this page yet. Try another heading in the legend."}
          </p>
        ) : (
          <div className="scribble-board">
            {visibleItems.map(({ item, index }) => (
              <ScribbleLeaf key={item._id || index} item={item} index={index} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default Scribble;
