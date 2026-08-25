import React, { useEffect, useRef } from "react";
import gsap from "gsap";

function AtlasGlobeMark() {
  return (
    <svg
      className="atlas-entry-globe"
      viewBox="0 0 160 160"
      aria-hidden="true"
      fill="none"
    >
      <g className="atlas-entry-spin">
        <circle
          className="atlas-entry-stroke atlas-entry-orbit"
          cx="80"
          cy="80"
          r="68"
          pathLength="1"
        />
        <circle
          className="atlas-entry-stroke atlas-entry-sphere"
          cx="80"
          cy="80"
          r="44"
          pathLength="1"
        />
        <ellipse
          className="atlas-entry-stroke"
          cx="80"
          cy="80"
          rx="22"
          ry="44"
          pathLength="1"
        />
        <ellipse
          className="atlas-entry-stroke"
          cx="80"
          cy="80"
          rx="44"
          ry="16"
          pathLength="1"
        />
        <line
          className="atlas-entry-stroke"
          x1="80"
          y1="36"
          x2="80"
          y2="124"
          pathLength="1"
        />
        <line
          className="atlas-entry-stroke"
          x1="36"
          y1="80"
          x2="124"
          y2="80"
          pathLength="1"
        />
      </g>
      <circle className="atlas-entry-locus" cx="104" cy="68" r="2.4" />
    </svg>
  );
}

function AtlasEntry({ pageRef, scroll, reduced, onComplete }) {
  const overlayRef = useRef(null);
  const markRef = useRef(null);
  const copyRef = useRef(null);
  const finished = useRef(false);
  const doneRef = useRef(onComplete);
  doneRef.current = onComplete;

  useEffect(() => {
    const overlay = overlayRef.current;
    const page = pageRef.current;
    if (!overlay || !page) return undefined;

    const header = page.querySelector(".site-header");
    const rail = page.querySelector(".atlas-rail");
    const caption = page.querySelector(".atlas-panel--hero .atlas-caption");
    const canvas = page.querySelector(".atlas-canvas-layer");
    const strokes = overlay.querySelectorAll(".atlas-entry-stroke");
    const locus = overlay.querySelector(".atlas-entry-locus");
    const chrome = [header, rail, caption].filter(Boolean);
    const canvasTargets = canvas ? [canvas] : [];

    const settle = () => {
      if (finished.current) return;
      finished.current = true;
      if (scroll?.current) scroll.current.entry = 1;
      try {
        sessionStorage.setItem("home-atlas-opened", "1");
      } catch {
        /* ignore private mode */
      }
      doneRef.current?.();
    };

    if (reduced) {
      settle();
      return undefined;
    }

    gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(locus, { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" });
    gsap.set(markRef.current, { opacity: 0, scale: 0.92 });
    const skipHint = overlay.querySelector(".atlas-entry-skip");
    gsap.set(copyRef.current?.children || [], { opacity: 0, y: 10 });
    gsap.set(skipHint, { opacity: 0 });
    if (scroll?.current) scroll.current.entry = 0;

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: settle,
    });

    tl.to(
      strokes,
      {
        strokeDashoffset: 0,
        duration: 0.95,
        stagger: 0.07,
        ease: "power2.inOut",
      },
      0.05
    )
      .to(
        markRef.current,
        { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
        0.08
      )
      .to(
        locus,
        { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" },
        0.55
      )
      .to(
        copyRef.current?.children || [],
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.1 },
        0.38
      )
      .to(skipHint, { opacity: 1, duration: 0.45 }, 0.7)
      .to(
        copyRef.current,
        { opacity: 0, y: -8, duration: 0.42, ease: "power2.in" },
        1.62
      )
      .to(
        markRef.current,
        {
          scale: 1.22,
          opacity: 0,
          duration: 0.85,
          ease: "power3.inOut",
        },
        1.72
      )
      .to(
        overlay,
        { opacity: 0, duration: 0.7, ease: "power2.inOut" },
        1.82
      )
      .fromTo(
        canvasTargets,
        { opacity: 0 },
        { opacity: 1, duration: 0.9, ease: "power2.out", immediateRender: false },
        1.78
      )
      .fromTo(
        chrome,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: "power3.out",
          immediateRender: false,
        },
        2.02
      )
      .to(
        { entry: 0 },
        {
          entry: 1,
          duration: 0.85,
          ease: "power2.out",
          onUpdate() {
            if (scroll?.current) scroll.current.entry = this.targets()[0].entry;
          },
        },
        1.72
      );

    const skip = () => tl.progress(1);
    overlay.addEventListener("click", skip);
    const onKey = (event) => {
      if (event.key === "Escape" || event.key === "Enter") skip();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      overlay.removeEventListener("click", skip);
      window.removeEventListener("keydown", onKey);
      tl.kill();
    };
  }, [pageRef, reduced, scroll]);

  return (
    <div
      className="atlas-entry"
      ref={overlayRef}
      role="dialog"
      aria-label="Opening the atlas"
      aria-modal="true"
    >
      <div className="atlas-entry-atmosphere" />
      <div className="atlas-entry-grid" />
      <div className="atlas-entry-stage">
        <div className="atlas-entry-mark" ref={markRef}>
          <AtlasGlobeMark />
        </div>
        <div className="atlas-entry-copy" ref={copyRef}>
          <p className="atlas-entry-kicker">A quiet corner</p>
          <p className="atlas-entry-name">Athul</p>
        </div>
        <p className="atlas-entry-skip">Click to enter</p>
      </div>
    </div>
  );
}

export default AtlasEntry;
