import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import Header from "../components/Header";
import AtlasMap from "../components/home/AtlasMap";
import { DESTINATIONS } from "../components/home/destinations";
import { warmAtlasAssets } from "../components/atlas/warmAtlas";
import "../styles/landing.css";

function CompassRose() {
  return (
    <svg className="landing-compass-rose" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.35" />
      <circle cx="60" cy="60" r="38" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.28" />
      <circle cx="60" cy="60" r="8" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      {[0, 45, 90, 135].map((deg) => (
        <line
          key={deg}
          x1="60"
          y1="10"
          x2="60"
          y2={deg % 90 === 0 ? 22 : 18}
          stroke="currentColor"
          strokeWidth={deg % 90 === 0 ? 1.6 : 0.8}
          transform={`rotate(${deg} 60 60)`}
        />
      ))}
      <polygon points="60,12 64,60 60,54 56,60" fill="currentColor" />
      <polygon points="60,108 56,60 60,66 64,60" fill="currentColor" opacity="0.4" />
      <text x="60" y="9" textAnchor="middle" fontSize="8" fill="currentColor">N</text>
      <text x="114" y="63" textAnchor="middle" fontSize="8" fill="currentColor">E</text>
      <text x="60" y="118" textAnchor="middle" fontSize="8" fill="currentColor">S</text>
      <text x="7" y="63" textAnchor="middle" fontSize="8" fill="currentColor">W</text>
    </svg>
  );
}

function Landing() {
  const pageRef = useRef(null);
  const mapRef = useRef(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const stage = mapRef.current;
    if (!stage) return undefined;

    const onMove = (event) => {
      const box = stage.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      stage.style.setProperty("--mx", x.toFixed(3));
      stage.style.setProperty("--my", y.toFixed(3));
    };
    const onLeave = () => {
      stage.style.setProperty("--mx", "0");
      stage.style.setProperty("--my", "0");
    };

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(
          ".site-header, .landing-kicker, .landing-title, .landing-lede, .landing-cta, .atlas-map, .atlas-isle, .atlas-marker, .atlas-node, .home-pin, .landing-coords, .landing-rail, .atlas-route-draw",
          { clearProps: "all", opacity: 1 }
        );
        gsap.set(".atlas-route-draw", { strokeDashoffset: 0 });
        return;
      }

      gsap.set(".site-header", { opacity: 0, y: -12 });
      gsap.set(".landing-kicker, .landing-title, .landing-lede, .landing-cta", {
        opacity: 0,
        y: 22,
      });
      gsap.set(".atlas-map", { opacity: 0, scale: 0.97, transformOrigin: "60% 50%" });
      gsap.set(".atlas-isle", { opacity: 0 });
      gsap.set(".atlas-marker, .atlas-node, .home-pin", { opacity: 0 });
      gsap.set(".landing-coords, .landing-rail", {
        opacity: 0,
        y: 12,
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".site-header", { opacity: 1, y: 0, duration: 0.7 }, 0.08)
        .to(".landing-kicker", { opacity: 1, y: 0, duration: 0.55 }, 0.18)
        .to(".landing-title", { opacity: 1, y: 0, duration: 0.7 }, 0.28)
        .to(".landing-lede", { opacity: 1, y: 0, duration: 0.6 }, 0.4)
        .to(".landing-cta", { opacity: 1, y: 0, duration: 0.55 }, 0.5)
        .to(".atlas-map", { opacity: 1, scale: 1, duration: 0.95 }, 0.22)
        .to(".atlas-isle", { opacity: 1, duration: 0.7, stagger: 0.12 }, 0.48)
        .to(".atlas-route-draw", { strokeDashoffset: 0, duration: 0.72, stagger: 0.26, ease: "power2.inOut" }, 0.72)
        .to(".atlas-node, .atlas-marker", { opacity: 1, duration: 0.45, stagger: 0.06 }, 1.05)
        .to(".home-pin", { opacity: 1, duration: 0.5, stagger: 0.08 }, 1.12)
        .to(".landing-coords", { opacity: 1, y: 0, duration: 0.55 }, 1.15)
        .to(".landing-rail", { opacity: 1, y: 0, duration: 0.55 }, 1.22);
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="landing-page" ref={pageRef}>
      <Header />

      <section className="landing-hero">
        <div className="landing-grid" aria-hidden="true" />
        <div className="landing-paper" aria-hidden="true" />

        <div className="landing-copy">
          <p className="landing-kicker">Welcome, Explorer</p>
          <h1 className="landing-title">
            Explore What
            <em>I've Built</em>
          </h1>
          <p className="landing-lede">
            A collection of projects, ideas, experiments, and experiences — mapped out one destination at a time.
          </p>
          <Link to="/atlas" className="landing-cta" onPointerEnter={warmAtlasAssets}>
            Start Exploring
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        <div className="landing-map" ref={mapRef}>
          <AtlasMap
            hovered={hovered}
            onHover={(id) => {
              setHovered(id);
              if (id === "atlas") warmAtlasAssets();
            }}
            onLeave={() => setHovered(null)}
          />

          <div className="landing-coords">
            <CompassRose />
            <p>
              10.5276° N
              <span>76.2144° E</span>
            </p>
          </div>
        </div>

        <nav className="landing-rail" aria-label="Destinations">
          {DESTINATIONS.map((dest) => (
            <Link
              key={dest.id}
              to={dest.path}
              className={hovered === dest.id ? "is-on" : ""}
              aria-label={dest.title}
              onMouseEnter={() => {
                setHovered(dest.id);
                if (dest.path === "/atlas") warmAtlasAssets();
              }}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </nav>
      </section>
    </div>
  );
}

export default Landing;
