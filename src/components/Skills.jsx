import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/skill.css";
import { getTeckStackAPI } from "../service/allApi";
import { SERVER_URL } from "../service/serverURL";
import { FIELDS } from "./atlas/story";

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
  const sectionRef = useRef(null);
  const [tools, setTools] = useState([]);
  const [toolsLoading, setToolsLoading] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 84%",
        onEnter: () => sectionRef.current?.classList.add("is-in"),
        onEnterBack: () => sectionRef.current?.classList.add("is-in"),
      });

      if (reduced) return;

      gsap.to(sectionRef.current, {
        backgroundPosition: "0px 96px",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.fromTo(
        ".skill-intro > *",
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".skill-rule",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.9,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".skill-fields",
            start: "top 86%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".skill-watermark",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.utils.toArray(".skill-field").forEach((field, index) => {
        gsap.fromTo(
          field,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: index * 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: field,
              start: "top 86%",
              toggleActions: "play none none reverse",
            },
          }
        );

        ScrollTrigger.create({
          trigger: field,
          start: "top 72%",
          onEnter: () => field.classList.add("is-plotted"),
        });

        ScrollTrigger.create({
          trigger: field,
          start: "top 62%",
          end: "bottom 48%",
          onToggle: (self) => field.classList.toggle("is-reading", self.isActive),
        });
      });

      gsap.fromTo(
        ".skill-icon",
        { y: 16, opacity: 0, scale: 0.84 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.035,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".skill-tools",
            start: "top 84%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [tools]);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const res = await getTeckStackAPI();
        if (res.status === 200) {
          const items = Array.isArray(res.data) ? res.data : [];
          setTools(items.filter((tool) => Boolean(tool.logo)));
        }
      } catch (err) {
        console.error("Error", err);
      } finally {
        setToolsLoading(false);
      }
    };
    fetchTools();
  }, []);

  return (
    <section id="atlas-craft" className="skill-section" ref={sectionRef}>
      <span className="skill-watermark" aria-hidden="true">
        03
      </span>
      <div className="skill-wrap">
        <div className="skill-intro">
          <p className="skill-kicker">03 — Expertise</p>
          <h2>The legend</h2>
          <p className="skill-lede">
            The same four fields plotted on the globe, opened as a working
            index — not a scorecard.
          </p>
        </div>

        <div className="skill-fields">
          <span className="skill-rule" aria-hidden="true" />
          {FIELDS.map((field) => (
            <article className="skill-field" key={field.id} id={`field-${field.id}`}>
              <span className="skill-field-code">
                <i className="skill-field-plot" aria-hidden="true" />
                {field.code}
              </span>
              <div className="skill-field-body">
                <h3>{field.title}</h3>
                <p>{field.copy}</p>
                <ul>
                  {field.disciplines.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="skill-tools">
        <div className="skill-tools-head">
          <p className="skill-kicker">Instruments</p>
          <h3>The working kit</h3>
        </div>

        <div className="skill-icon-container">
          {toolsLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <div className="skill-icon skill-icon--skeleton" key={index} />
              ))
            : tools.length === 0
              ? (
                <p className="skill-empty">Instruments will be plotted here.</p>
              )
            : tools.map((tool, index) => (
                <div className="skill-icon" key={tool._id || index}>
                  <img
                    src={`${SERVER_URL}${tool.logo}`}
                    alt={tool.name}
                    onError={(e) => {
                      e.target.src = "/fallback.png";
                    }}
                  />
                  <div className="tooltip">
                    <p className="tool-name">
                      {tool.name}
                      {tool.description ? (
                        <span className="tool-description">{tool.description}</span>
                      ) : null}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
