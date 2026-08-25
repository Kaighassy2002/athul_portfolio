import React, { useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../styles/experience.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getAllcertificatesAPI } from "../service/allApi";

gsap.registerPlugin(ScrollTrigger);

const route = [
  {
    code: "01",
    place: "Kerala",
    region: "Thrissur · origin",
    years: "Aug 2019",
    node: "home",
    roles: [
      {
        title: "APJ Abdul Kalam Technological University",
        role: "B.Tech in Computer Science",
        date: "Aug 2019",
        points: [
          "Coursework: Music Genre Recognition using MFCCs",
          "Seminar: Effective Machine Learning with Cloud TPU",
        ],
      },
    ],
  },
  {
    code: "02",
    place: "Coimbatore",
    region: "Tamil Nadu, India",
    years: "2019 — 2022",
    node: "coimbatore",
    roles: [
      {
        title: "Katomaran Technologies",
        role: "Machine Learning Intern",
        date: "Dec 2019 — May 2020",
        points: [
          "Computer vision for security monitoring and safety surveillance.",
          "Statistical analysis of test results and literature reviews for solution strategy.",
        ],
      },
      {
        title: "Katomaran Technologies",
        role: "Junior Machine Learning Engineer",
        date: "June 2020 — July 2022",
        points: [
          "Computer vision for surveillance and safety monitoring with OpenCV, TensorFlow, and deep learning.",
          "Object detection with YOLO and CNN architectures, deployed for real-world monitoring.",
          "Inference sped up 1.3× through model optimization while holding production accuracy.",
          "End-to-end ML pipelines from data collection and training to deployment, testing, and reporting.",
        ],
      },
    ],
  },
  {
    code: "03",
    place: "Trivandrum",
    region: "Kerala, India",
    years: "2022 — 2025",
    node: "trivandrum",
    roles: [
      {
        title: "International Virtual Assistance",
        role: "Machine Learning Engineer",
        date: "July 2022 — Aug 2025",
        points: [
          "Real-time face recognition for security monitoring in high-footfall environments.",
          "Facial detection, feature extraction, and identity verification for live surveillance.",
          "ETL and one-click tools for sensor validation, anomaly detection, and trend-deviation alerts.",
          "Large-scale sensor datasets processed and synchronized for engine research and operations.",
        ],
      },
    ],
  },
  {
    code: "04",
    place: "Sharjah",
    region: "United Arab Emirates",
    years: "2024 — 2025",
    node: "sharjah",
    roles: [
      {
        title: "Zillion Tech",
        role: "Technology Officer",
        date: "Dec 2024 — Aug 2025",
        points: [
          "GPU-accelerated real-time video analytics with NVIDIA DeepStream, OpenCV, and TensorRT for retail intelligence.",
          "Multi-camera pipelines for people detection, tracking, and person re-identification.",
          "Occupancy, queue, customer-journey, and behavioral analytics from live video streams.",
          "Inference optimized with quantization and TensorRT for low-latency edge GPU deployment.",
          "Scalable video systems for concurrent camera streams and real-time event analytics in production.",
        ],
      },
    ],
  },
  {
    code: "05",
    place: "Chennai",
    region: "Tamil Nadu, India",
    years: "2025 — Present",
    node: "chennai",
    roles: [
      {
        title: "CBTS",
        role: "Senior Engineer – AI",
        date: "Sep 2025 — Present",
        points: [
          "Graph-first AI platform for data modernization — dependency discovery, risk assessment, migration-wave planning, and target-state recommendations, cutting assessment effort by ~60%.",
          "Conversational AI over Microsoft Fabric and enterprise data sources for self-service analytics.",
          "MCP-based SDLC automation for business documents, Jira artifacts, wireframes, and design-to-code, reducing project initiation effort by more than 70%.",
          "Multi-agent workflows with LangGraph, LangChain, RAG, and vector databases for knowledge discovery and modernization analysis.",
          "Partnered across teams to drive enterprise AI adoption through intelligent automation and decision support.",
        ],
      },
      {
        title: "CBTS",
        role: "1st Place — Enterprise Hackathon",
        date: "2026",
        points: [
          "Autonomous Retail Manager: Developed an AI-powered autonomous retail optimization platform capable of integrating with existing analytics engines through adapter-based architecture.",
          "The solution provided inventory optimization, dynamic pricing recommendations, retail resilience analysis, and simulation-driven decision support for operational planning.",
        ],
      },
    ],
  },
];

const formatMarkDate = (value) => {
  if (!value) return "";
  const dmy = String(value).match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  const parsed = dmy
    ? new Date(`${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`)
    : new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Experience = () => {
  const sectionRef = useRef(null);
  const [certificate, setCertificate] = useState([]);
  const [certsLoading, setCertsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    organization: "",
  });

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

      gsap.fromTo(
        ".career-head > *",
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
        ".path-watermark",
        { y: 36, opacity: 0 },
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

      gsap.fromTo(
        ".path-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".path-route",
            start: "top 72%",
            end: "bottom 55%",
            scrub: 0.4,
          },
        }
      );

      gsap.fromTo(
        ".path-station",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".path-route",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.to(".path-traveler", {
        y: () => {
          const route = sectionRef.current?.querySelector(".path-route");
          return Math.max(0, (route?.offsetHeight || 0) - 42);
        },
        ease: "none",
        scrollTrigger: {
          trigger: ".path-route",
          start: "top 58%",
          end: "bottom 48%",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onEnter: () => {
            sectionRef.current
              ?.querySelector(".path-station")
              ?.classList.add("is-active");
          },
          onUpdate: (self) => {
            const stations = gsap.utils.toArray(".path-station");
            if (!stations.length) return;
            const idx = Math.min(
              stations.length - 1,
              Math.floor(self.progress * stations.length)
            );
            stations.forEach((station, index) => {
              station.classList.toggle("is-passed", index < idx);
              station.classList.toggle("is-active", index === idx);
            });
          },
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await getAllcertificatesAPI();
        if (response.status === 200) {
          const sortedData = response.data.data.sort(
            (a, b) => new Date(b.startDate) - new Date(a.startDate)
          );
          setCertificate(sortedData);
        }
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setCertsLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  useEffect(() => {
    if (certsLoading) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cert-head > *",
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".certificate-section",
            start: "top 84%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".cert-carousel-wrap",
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".certificate-container",
            start: "top 86%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [certsLoading, certificate]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredCertificates = useMemo(() => {
    return certificate
      .filter((cert) => {
        return (
          (filters.category === "" || cert.category === filters.category) &&
          (filters.organization === "" ||
            cert.organization === filters.organization)
        );
      })
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }, [filters, certificate]);

  const categories = useMemo(
    () => [...new Set(certificate.map((cert) => cert.category).filter(Boolean))],
    [certificate]
  );

  const organizations = useMemo(
    () =>
      [...new Set(certificate.map((cert) => cert.organization).filter(Boolean))],
    [certificate]
  );

  const clearFilters = () => {
    setFilters({ category: "", organization: "" });
  };

  const hasActiveFilters = filters.category || filters.organization;

  return (
    <section className="experience-container" id="atlas-path" ref={sectionRef}>
      <span className="path-watermark" aria-hidden="true">
        04
      </span>
      <div className="career-wrap">
        <div className="career-head">
          <p className="career-kicker">04 — Path</p>
          <h2>The route</h2>
          <p className="career-lede">
            Kerala to Chennai — the same places marked on the globe, read as a
            working life.
          </p>
        </div>

        <div className="path-route">
          <span className="path-line" aria-hidden="true" />
          <span className="path-fill" aria-hidden="true" />
          <span className="path-traveler" aria-hidden="true" />
          {route.map((station) => (
            <article className="path-station" key={station.node}>
              <div className="path-node">
                <span>{station.code}</span>
              </div>
              <div className="path-body">
                <div className="path-place">
                  <h3>{station.place}</h3>
                  <p>
                    {station.region}
                    <i />
                    {station.years}
                  </p>
                </div>
                {station.roles.map((item) => (
                  <div className="path-role" key={`${item.role}-${item.date}`}>
                    <p className="timeline-date">{item.date}</p>
                    <h4>{item.role}</h4>
                    <p className="timeline-org">{item.title}</p>
                    <ul>
                      {item.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="certificate-section">
        <div className="cert-head">
          <div>
            <p className="career-kicker">Field marks</p>
            <h3>Certificates</h3>
          </div>
          <div className="cert-toolbar">
            <select
              className="filter-input"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              className="filter-input"
              name="organization"
              value={filters.organization}
              onChange={handleFilterChange}
            >
              <option value="">All organizations</option>
              {organizations.map((organization) => (
                <option value={organization} key={organization}>
                  {organization}
                </option>
              ))}
            </select>
            {hasActiveFilters ? (
              <button type="button" className="clear-btn" onClick={clearFilters}>
                Clear
              </button>
            ) : null}
          </div>
        </div>

        <div className="certificate-container">
          {certsLoading ? (
            <div className="cert-carousel-wrap" aria-hidden="true">
              <div className="cert-grid">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div className="cert-card is-skeleton" key={index} />
                ))}
              </div>
            </div>
          ) : filteredCertificates.length === 0 ? (
            <p className="no-items">No certificates found for selected filters.</p>
          ) : (
            <div className="cert-carousel-wrap">
              <Swiper
                key={`${filters.category}-${filters.organization}-${filteredCertificates.length}`}
                className="cert-swiper"
                modules={[Navigation, A11y]}
                navigation
                rewind
                watchOverflow
                grabCursor
                spaceBetween={22}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  980: { slidesPerView: 3 },
                }}
              >
                {filteredCertificates.map((cert, index) => (
                  <SwiperSlide key={cert._id || index}>
                    <article className="cert-card">
                      <div className="cert-card-media">
                        <img
                          loading="lazy"
                          className="cert-card-image"
                          src={cert.image}
                          alt={`${cert.organization} — ${cert.category}`}
                        />
                        {cert.links ? (
                          <a
                            href={cert.links}
                            className="cert-card-peek"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View certificate
                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                          </a>
                        ) : null}
                      </div>
                      <div className="cert-card-body">
                        <span className="cert-tag">{cert.category}</span>
                        <h4>{cert.organization}</h4>
                        <p>{formatMarkDate(cert.startDate)}</p>
                      </div>
                    </article>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Experience;
