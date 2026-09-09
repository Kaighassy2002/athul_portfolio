import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import "../styles/Atlas.css";
import Header from "../components/Header";
import Skills from "../components/Skills";
import Experience from "../components/Experience";
import Project from "../components/Project";
import Footer from "../components/Footer";
import AtlasEntry from "../components/atlas/AtlasEntry";
import Seo from "../components/Seo";
import {
  BEATS,
  CHAPTERS,
  FIELDS,
  HOLD_POINTS,
  SNAP_POINTS,
  beatOpacity,
  beatTranslate,
  createScrollState,
  holdStrength,
  railChapterIndex,
  samplePalette,
  sceneRest,
  scrimStrength,
  storyChapter,
} from "../components/atlas/story";

const AtlasScene = lazy(() =>
  import("../components/atlas/AtlasScene").then((mod) => {
    mod.preloadAtlasAssets(
      typeof window !== "undefined" && window.innerWidth < 768
    );
    return mod;
  })
);

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const RESUME =
  "https://drive.google.com/file/d/1P4aRSAarN1EQOTn9JfeL1VMEozFnnu_D/view";

const CATALOG_IDS = ["atlas-craft", "atlas-path", "projects"];

function catalogOffset(el) {
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop);
  return Number.isFinite(margin) ? margin : 0;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function shouldPlayEntry(reduced) {
  if (reduced) return false;
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem("home-atlas-opened") !== "1";
  } catch {
    return true;
  }
}

function Atlas() {
  const pageRef = useRef(null);
  const stageRef = useRef(null);
  const viewRef = useRef(null);
  const triggerRef = useRef(null);
  const scroll = useRef(createScrollState());
  const panelRefs = useRef([]);
  const tickRefs = useRef([]);
  const fillRef = useRef(null);
  const glowRef = useRef(null);
  const gridRef = useRef(null);
  const catalogId = useRef(null);
  const lastChapter = useRef(0);
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [compact, setCompact] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );
  const [entering, setEntering] = useState(() => shouldPlayEntry(reduced));
  const [prologue] = useState(entering);
  const [activeChapter, setActiveChapter] = useState(0);

  scroll.current.reduced = reduced;
  scroll.current.compact = compact;
  scroll.current.entry = entering ? 0 : 1;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const onChange = () => setCompact(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!entering) return undefined;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [entering]);

  useEffect(() => {
    if (entering || !pageRef.current) return undefined;
    const nodes = pageRef.current.querySelectorAll(
      ".site-header, .atlas-rail, .atlas-panel--hero .atlas-caption, .atlas-canvas-layer"
    );
    gsap.set(nodes, { clearProps: "opacity,transform" });
    ScrollTrigger.refresh();
    return undefined;
  }, [entering]);

  const scrollToY = (top, duration = 1.05) => {
    if (prefersReducedMotion()) {
      window.scrollTo(0, top);
      return;
    }
    gsap.to(window, {
      scrollTo: { y: Math.max(0, top), autoKill: false },
      duration,
      ease: "power3.inOut",
      overwrite: true,
    });
  };

  const scrollToProgress = (progress) => {
    const trigger = triggerRef.current;
    if (!trigger) {
      const person = document.getElementById("atlas-person");
      if (person) scrollToY(person.getBoundingClientRect().top + window.scrollY);
      return;
    }
    scrollToY(trigger.start + (trigger.end - trigger.start) * progress, 0.95);
  };

  const scrollToCatalog = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - catalogOffset(el);
    const distance = Math.abs(top - window.scrollY);
    const duration = gsap.utils.clamp(0.85, 1.45, 0.72 + distance / 2800);
    scrollToY(top, duration);
  };

  const onChapterClick = (chapter) => {
    const pin = triggerRef.current;
    const inPin = pin && window.scrollY <= pin.end - 8;

    if (chapter.pinAt === null) {
      scrollToCatalog(chapter.href.replace("#", ""));
      return;
    }

    if (inPin || chapter.id === "atlas" || chapter.id === "person") {
      scrollToProgress(chapter.pinAt);
      return;
    }

    scrollToCatalog(chapter.href.replace("#", ""));
  };

  useEffect(() => {
    const state = scroll.current;
    state.reduced = reduced;
    state.compact = compact;

    const applyFrame = (progress) => {
      const palette = samplePalette(progress);
      const previous = state.progress;
      state.velocity = progress - previous;
      state.velSmoothed = state.velSmoothed * 0.82 + state.velocity * 0.18;
      state.progress = progress;
      state.smoothed = progress;
      state.hold = holdStrength(progress);
      state.rest = sceneRest(progress);
      state.scrim = scrimStrength(progress);
      state.chapter = storyChapter(progress);
      state.forest = palette.forest;
      state.fog = palette.fog;

      if (!state.reduced) {
        panelRefs.current.forEach((panel, index) => {
          if (!panel) return;
          const beat = BEATS[index];
          const opacity = beatOpacity(progress, beat);
          const shift = beatTranslate(progress, beat);
          const reading = opacity > 0.86 && state.hold > 0.62;
          panel.style.opacity = String(opacity);
          panel.style.transform = `translate3d(${shift.x}px, ${shift.y}px, 0)`;
          panel.style.visibility = opacity < 0.02 ? "hidden" : "visible";
          panel.style.setProperty("--atlas-beat", String(opacity));
          panel.style.setProperty("--atlas-scrim", String(opacity * (beat.id === "hero" ? 0.22 : 0.95)));
          panel.classList.toggle("is-live", opacity > 0.28);
          panel.classList.toggle("is-reading", reading);
        });
      }

      const activeIndex = railChapterIndex(progress, catalogId.current);
      if (activeIndex !== lastChapter.current) {
        lastChapter.current = activeIndex;
        setActiveChapter(activeIndex);
      }
      tickRefs.current.forEach((tick, index) => {
        if (!tick) return;
        tick.classList.toggle("is-on", index === activeIndex);
      });

      const view = viewRef.current;
      if (view) {
        view.style.setProperty("--atlas-ink", palette.ink);
        view.style.setProperty("--atlas-muted", palette.muted);
        view.style.setProperty("--atlas-paper", palette.paper);
        view.style.setProperty("--atlas-bg-a", palette.bgA);
        view.style.setProperty("--atlas-bg-b", palette.bgB);
        view.style.setProperty("--atlas-bg-c", palette.bgC);
        view.style.setProperty("--atlas-glow", palette.glow);
        view.style.setProperty("--atlas-grid", palette.grid);
        view.style.setProperty("--atlas-line", palette.line);
        view.style.setProperty("--atlas-cta-bg", palette.ctaBg);
        view.style.setProperty("--atlas-cta-fg", palette.ctaFg);
        view.style.setProperty("--atlas-shadow", palette.shadow);
        view.style.setProperty("--atlas-accent", palette.accent);
        const fade =
          progress > 0.96 ? Math.max(0, 1 - (progress - 0.96) / 0.04) : 1;
        view.style.setProperty("--atlas-fade", String(fade));
        view.style.setProperty("--atlas-ui-fade", "1");
        view.style.setProperty("--atlas-rest", String(state.rest));
        view.style.setProperty("--atlas-hold", String(state.hold));
      }

      if (stageRef.current) {
        stageRef.current.style.background = palette.bgB;
      }

      if (glowRef.current) {
        const energy = 1 - state.hold;
        const x = 50 + Math.sin(progress * Math.PI) * 10 * energy;
        const y = 42 + Math.cos(progress * Math.PI) * 6 * energy;
        glowRef.current.style.setProperty("--glow-x", `${x}%`);
        glowRef.current.style.setProperty("--glow-y", `${y}%`);
      }
      if (gridRef.current) {
        const drift = progress * -22 * (1 - state.hold * 0.88);
        gridRef.current.style.transform = `translate3d(0, ${drift}px, 0)`;
      }
    };

    const syncCatalog = () => {
      const markers = [
        { id: "work", el: document.getElementById("projects") },
        { id: "path", el: document.getElementById("atlas-path") },
        { id: "expertise", el: document.getElementById("atlas-craft") },
      ];
      const pinEnd = triggerRef.current?.end ?? 0;
      if (window.scrollY < pinEnd - 40) {
        catalogId.current = null;
      } else {
        const found = markers.find(
          (marker) => marker.el && marker.el.getBoundingClientRect().top < window.innerHeight * 0.45
        );
        catalogId.current = found?.id || "expertise";
      }

      const pin = triggerRef.current;
      const pinProgress = pin ? pin.progress : 0;
      const activeIndex = railChapterIndex(pinProgress, catalogId.current);
      if (activeIndex !== lastChapter.current) {
        lastChapter.current = activeIndex;
        setActiveChapter(activeIndex);
      }
      tickRefs.current.forEach((tick, index) => {
        if (!tick) return;
        tick.classList.toggle("is-on", index === activeIndex);
      });

      if (fillRef.current && pageRef.current) {
        const max = pageRef.current.scrollHeight - window.innerHeight;
        const pageProgress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        fillRef.current.style.transform = `scaleY(${pageProgress})`;
      }
    };

    if (reduced) {
      panelRefs.current.forEach((panel) => {
        if (!panel) return;
        panel.style.opacity = "1";
        panel.style.transform = "none";
        panel.style.visibility = "visible";
        panel.style.setProperty("--atlas-beat", "1");
        panel.style.setProperty("--atlas-scrim", "0.7");
        panel.classList.add("is-live", "is-reading");
      });
      applyFrame(0);
      syncCatalog();
      window.addEventListener("scroll", syncCatalog, { passive: true });
      const themeWatch = new MutationObserver(() => applyFrame(0));
      themeWatch.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
      return () => {
        themeWatch.disconnect();
        window.removeEventListener("scroll", syncCatalog);
      };
    }

    applyFrame(0);

    const onPointer = (event) => {
      if (state.hold > 0.45) return;
      state.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      state.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const ctx = gsap.context(() => {
      const proxy = { p: 0 };
      const tween = gsap.to(proxy, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          id: "atlas-story",
          trigger: stageRef.current,
          start: "top top",
          end: compact ? "+=210%" : "+=420%",
          pin: viewRef.current,
          pinSpacing: true,
          scrub: compact ? 0.42 : 0.58,
          snap: compact
            ? false
            : {
                snapTo: (value) => {
                  if (value >= 0.984) return 1;
                  return gsap.utils.snap(SNAP_POINTS, value);
                },
                duration: { min: 0.22, max: 0.62 },
                delay: 0.08,
                ease: "power3.inOut",
              },
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          applyFrame(proxy.p);
          syncCatalog();
        },
      });
      triggerRef.current = tween.scrollTrigger;

      if (!compact) {
        const catalogMarks = CATALOG_IDS.map((id) => document.getElementById(id))
          .filter(Boolean)
          .map((el) =>
            ScrollTrigger.create({
              trigger: el,
              start: "top 76px",
            })
          );

        if (catalogMarks.length > 1) {
          ScrollTrigger.create({
            id: "atlas-catalog",
            trigger: catalogMarks[0].trigger,
            start: () => catalogMarks[0].start,
            end: () => {
              const last = catalogMarks[catalogMarks.length - 1];
              const height = last.trigger?.offsetHeight || 0;
              return last.start + height;
            },
            invalidateOnRefresh: true,
            snap: {
              snapTo: (progress, self) => {
                const span = self.end - self.start;
                if (span <= 0) return progress;
                const y = self.start + progress * span;
                const points = catalogMarks.map((mark) => mark.start);
                const closest = gsap.utils.snap(points, y);
                const threshold = Math.min(window.innerHeight * 0.34, 280);
                if (Math.abs(closest - y) > threshold) return progress;
                return gsap.utils.clamp(0, 1, (closest - self.start) / span);
              },
              duration: { min: 0.42, max: 0.95 },
              delay: 0.05,
              ease: "power3.inOut",
            },
          });
        }
      }
    }, pageRef);

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", syncCatalog, { passive: true });
    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());
    const lateRefresh = window.setTimeout(() => ScrollTrigger.refresh(), 700);
    const themeWatch = new MutationObserver(() => applyFrame(scroll.current.progress));
    themeWatch.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      cancelAnimationFrame(refreshId);
      window.clearTimeout(lateRefresh);
      themeWatch.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", syncCatalog);
      triggerRef.current = null;
      ctx.revert();
    };
  }, [reduced, compact]);

  return (
    <div
      className={`atlas-page${entering ? " is-entering" : ""}${prologue ? " has-prologue" : ""}`}
      ref={pageRef}
    >
      <Seo
        title="Atlas"
        description="Athul Suresh's atlas — skills, experience, and projects mapped as a journey."
        path="/atlas"
      />
      {entering ? (
        <AtlasEntry
          pageRef={pageRef}
          scroll={scroll}
          reduced={reduced}
          onComplete={() => setEntering(false)}
        />
      ) : null}
      <Header />

      <nav className="atlas-rail" aria-label="Atlas chapters">
        <span className="atlas-rail-fill" ref={fillRef} />
        {CHAPTERS.map((chapter, index) => (
          <button
            type="button"
            className={`atlas-rail-tick${activeChapter === index ? " is-on" : ""}`}
            key={chapter.id}
            ref={(node) => {
              tickRefs.current[index] = node;
            }}
            onClick={() => onChapterClick(chapter)}
            aria-label={`${chapter.code} ${chapter.label}`}
            aria-current={activeChapter === index ? "true" : undefined}
          >
            <i />
            <span>
              {chapter.code} {chapter.label}
            </span>
          </button>
        ))}
      </nav>

      <div
        className={`atlas-stage${reduced ? " is-static" : ""}`}
        id="main-content"
        ref={stageRef}
      >
        <div className="atlas-stage-view" ref={viewRef}>
          <div className="atlas-atmosphere" ref={glowRef} aria-hidden="true" />
          <div className="atlas-grid" ref={gridRef} aria-hidden="true" />

          <div className="atlas-canvas-layer">
            <Suspense fallback={null}>
              <AtlasScene scroll={scroll} compact={compact} />
            </Suspense>
          </div>

          <div className="atlas-copy-layer">
            <section
              className="atlas-panel atlas-panel--hero"
              ref={(node) => {
                panelRefs.current[0] = node;
              }}
            >
              <div className="atlas-caption atlas-caption--cover">
                <p className="atlas-kicker">01 — The journey</p>
                <h1 className="atlas-title">
                  The Atlas
                  <em>of a working life</em>
                </h1>
                <p className="atlas-lede">
                  An instrument for reading the work — systems, places, and the
                  path between them.
                </p>
                <div className="atlas-hero-actions">
                  <button
                    type="button"
                    className="atlas-cta"
                    onClick={() => scrollToProgress(HOLD_POINTS.person)}
                  >
                    Begin the survey
                    <i className="fa-solid fa-arrow-down"></i>
                  </button>
                  <a
                    className="atlas-text-link"
                    href={RESUME}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Resume
                  </a>
                </div>
              </div>
            </section>

            <section
              className="atlas-panel atlas-panel--person"
              id="atlas-person"
              ref={(node) => {
                panelRefs.current[1] = node;
              }}
            >
              <div className="atlas-caption atlas-caption--east">
                <p className="atlas-kicker">02 — Person</p>
                <h2>Behind the algorithms</h2>
                <p className="atlas-lede">
                  From Thrissur. A senior AI engineer shaping systems
                  that connect data to decisions.
                </p>
                <p className="atlas-meta">Thrissur, Kerala · 5+ years</p>
              </div>
            </section>

            <section
              className="atlas-panel atlas-panel--fields"
              ref={(node) => {
                panelRefs.current[2] = node;
              }}
            >
              <div className="atlas-caption atlas-caption--west">
                <p className="atlas-kicker">03 — Expertise</p>
                <h2>Fields of work</h2>
                <p className="atlas-lede">
                  Four territories the globe is plotting.
                </p>
                <ol className="atlas-fields">
                  {FIELDS.map((field) => (
                    <li key={field.id}>
                      <span>{field.code}</span>
                      <strong>{field.title}</strong>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <section
              className="atlas-panel atlas-panel--inspect"
              ref={(node) => {
                panelRefs.current[3] = node;
              }}
            >
              <div className="atlas-caption atlas-caption--south">
                <p className="atlas-kicker">Field note · Sharjah</p>
                <h2>Close enough to touch</h2>
                <p className="atlas-lede">
                  A video analytics framework on NVIDIA Deepstream and
                  Kubernetes — live on retail floors.
                </p>
              </div>
            </section>

            <section
              className="atlas-panel atlas-panel--unfold"
              ref={(node) => {
                panelRefs.current[4] = node;
              }}
            >
              <div className="atlas-caption atlas-caption--south">
                <p className="atlas-kicker">The map opens</p>
                <h2>Continue the survey</h2>
                <p className="atlas-lede">
                  The legend, the route, and the plates — the rest of the atlas
                  is below.
                </p>
                <div className="atlas-hero-actions">
                  <button
                    type="button"
                    className="atlas-cta"
                    onClick={() => scrollToCatalog("atlas-craft")}
                  >
                    Open the legend
                    <i className="fa-solid fa-arrow-down"></i>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Skills />
      <Experience />
      <Project />
      <Footer />
    </div>
  );
}

export default Atlas;
