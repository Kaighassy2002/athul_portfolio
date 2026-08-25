import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/project.css";
import { getProjectAPI } from "../service/allApi";
import { SERVER_URL } from "../service/serverURL";

gsap.registerPlugin(ScrollTrigger);

function Project() {
  const sectionRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllTechs, setShowAllTechs] = useState({});
  const [showFullDescriptions, setShowFullDescriptions] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjectAPI();
        setProjects(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 84%",
        onEnter: () => sectionRef.current?.classList.add("is-in"),
        onEnterBack: () => sectionRef.current?.classList.add("is-in"),
      });

      if (reduced || loading || !projects.length) return;

      gsap.to(sectionRef.current, {
        backgroundPosition: "0px 80px",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.fromTo(
        ".project-head > *",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.utils.toArray(".project-plate").forEach((plate) => {
        const media = plate.querySelector(".project-media img, .project-fallback");
        const crop = plate.querySelector(".project-crop");
        const body = plate.querySelectorAll(".project-body > *");
        const mark = plate.querySelector(".project-watermark");

        gsap.fromTo(
          plate,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: plate,
              start: "top 84%",
              toggleActions: "play none none reverse",
              onEnter: () => plate.classList.add("is-open"),
              onEnterBack: () => plate.classList.add("is-open"),
            },
          }
        );

        if (media) {
          gsap.fromTo(
            media,
            { clipPath: "inset(0 46% 0 46%)", scale: 1.08 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              scale: 1,
              duration: 1.15,
              ease: "power3.inOut",
              scrollTrigger: {
                trigger: plate,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        if (crop) {
          gsap.fromTo(
            crop,
            { opacity: 0, scale: 0.9 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.7,
              delay: 0.18,
              ease: "power2.out",
              scrollTrigger: {
                trigger: plate,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        if (mark) {
          gsap.fromTo(
            mark,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              delay: 0.22,
              ease: "power3.out",
              scrollTrigger: {
                trigger: plate,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        if (body.length) {
          gsap.fromTo(
            body,
            { y: 18, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.55,
              stagger: 0.06,
              delay: 0.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: plate,
                start: "top 78%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      const count = { n: 0 };
      const countEl = sectionRef.current?.querySelector(".project-count-num");
      if (countEl) {
        gsap.to(count, {
          n: projects.length,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
          onUpdate: () => {
            countEl.textContent = String(Math.round(count.n)).padStart(2, "0");
          },
        });
      }
    }, sectionRef);

    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(refresh);
      ctx.revert();
    };
  }, [loading, projects]);

  const toggleShowAllTechs = (index) => {
    setShowAllTechs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleDescription = (index) => {
    setShowFullDescriptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section className="project-container" id="projects" ref={sectionRef}>
      <div className="project-wrap">
        <div className="project-head">
          <div>
            <p className="project-kicker">05 — Work</p>
            <h2>Field plates</h2>
            <p className="project-lede">
              Case studies mapped from the same territories — experiments that
              left the notebook.
            </p>
          </div>
          <p className="project-count" aria-live="polite">
            <span className="project-count-num">{loading ? "—" : "00"}</span>
            <span>sheets in the catalog</span>
          </p>
        </div>

        {loading ? (
          <div className="project-catalog">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                className={`project-plate project-plate--skeleton${index % 2 ? " is-flip" : ""}`}
                key={index}
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <p className="project-empty">Projects will land here shortly.</p>
        ) : (
          <div className="project-catalog">
            {projects.map((project, index) => {
              const maxVisible = 4;
              const techs = project.tech_stack || [];
              const visibleTechs = techs.slice(0, maxVisible);
              const hiddenTechs = techs.slice(maxVisible);
              const showAll = showAllTechs[index];
              const showFullDesc = showFullDescriptions[index];
              const words = project.description?.split(" ") || [];
              const shouldTruncate = words.length > 42;
              const displayedDescription =
                showFullDesc || !shouldTruncate
                  ? project.description
                  : `${words.slice(0, 42).join(" ")}...`;
              const plateNo = String(index + 1).padStart(2, "0");

              return (
                <article
                  className={`project-plate${index % 2 ? " is-flip" : ""}`}
                  key={project._id || index}
                >
                  <div className="project-media">
                    <span className="project-crop" aria-hidden="true" />
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    ) : (
                      <div className="project-fallback">{plateNo}</div>
                    )}
                    <span className="project-watermark" aria-hidden="true">
                      {plateNo}
                    </span>
                  </div>

                  <div className="project-body">
                    <p className="project-plate-label">Sheet {plateNo}</p>
                    <h3>{project.title}</h3>

                    {techs.length > 0 ? (
                      <div className="tech-stack-list">
                        {(showAll ? techs : visibleTechs).map((tech, i) => (
                          <div key={`${tech.name}-${i}`} className="tech-item">
                            {tech.logo ? (
                              <img
                                src={`${SERVER_URL}${tech.logo}`}
                                alt=""
                                className="tech-logo"
                              />
                            ) : null}
                            <span className="tech-name">{tech.name}</span>
                          </div>
                        ))}
                        {!showAll && hiddenTechs.length > 0 && (
                          <button
                            type="button"
                            className="tech-item more-tech"
                            onClick={() => toggleShowAllTechs(index)}
                          >
                            +{hiddenTechs.length}
                          </button>
                        )}
                      </div>
                    ) : null}

                    {displayedDescription ? (
                      <p>
                        {displayedDescription}
                        {shouldTruncate && (
                          <button
                            type="button"
                            onClick={() => toggleDescription(index)}
                            className="read-more-toggle"
                          >
                            {showFullDesc ? " Show less" : " Read more"}
                          </button>
                        )}
                      </p>
                    ) : null}

                    {project.link ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        View project
                        <i className="fa-solid fa-arrow-up-right-from-square"></i>
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Project;
