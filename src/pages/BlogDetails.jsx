import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { blogByIdAPI, listAllBlogsAPI, recordBlogViewAPI, unwrapList } from "../service/allApi";
import BlogContentViewer from "../components/BlogContentViewer";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BlogInteractions from "../components/BlogInteractions";
import {
  estimateReadMinutes,
  excerptFrom,
  extractHeadings,
  formatShortDate,
  plateCoords,
} from "../utils/editorial";
import "../styles/article.css";

gsap.registerPlugin(ScrollTrigger);

const formatLongDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

function MapChart() {
  return (
    <svg className="plate-chart" viewBox="0 0 720 160" aria-hidden="true">
      {[28, 56, 84, 112, 140].map((y) => (
        <line key={y} x1="0" y1={y} x2="720" y2={y} />
      ))}
      {[80, 180, 280, 380, 480, 580, 680].map((x) => (
        <line key={x} x1={x} y1="12" x2={x} y2="148" />
      ))}
      <path
        className="plate-chart-route"
        d="M 36 118 C 160 96, 240 48, 360 72 S 560 132, 690 58"
      />
      <circle cx="36" cy="118" r="3.2" />
      <circle cx="360" cy="72" r="3.2" />
      <circle cx="690" cy="58" r="3.2" />
    </svg>
  );
}

function cleanIntro(title, intro) {
  if (!intro) return "";
  const heading = String(title || "").trim();
  let text = String(intro).trim();
  if (heading && text.toLowerCase().startsWith(heading.toLowerCase())) {
    text = text.slice(heading.length).replace(/^[\s:—–-]+/, "").trim();
  }
  return text;
}

function PlateCorners() {
  return (
    <span className="plate-corners" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

function TocList({ headings, activeId, onJump }) {
  return (
    <nav aria-label="On this page">
      {headings.map((heading, index) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          className={`plate-toc-link ${heading.level > 2 ? "is-sub" : ""} ${
            activeId === heading.id ? "is-active" : ""
          }`}
          onClick={(event) => onJump(event, heading.id)}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          {heading.text}
        </a>
      ))}
    </nav>
  );
}

function NeighborCard({ blog, direction }) {
  if (!blog) {
    return <div className="plate-neighbor is-empty" aria-hidden="true" />;
  }

  const isPrevious = direction === "previous";

  return (
    <Link
      to={`/blog/${blog._id}`}
      className={`plate-neighbor plate-neighbor--${direction}`}
    >
      <span>
        {isPrevious ? (
          <>
            <i className="fa-solid fa-arrow-left"></i>
            Previous Note
          </>
        ) : (
          <>
            Next Note
            <i className="fa-solid fa-arrow-right"></i>
          </>
        )}
      </span>
      <strong>{blog.title}</strong>
    </Link>
  );
}

function BlogDetails() {
  const { id } = useParams();
  const pageRef = useRef(null);
  const [blog, setBlog] = useState(null);
  const [archive, setArchive] = useState([]);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState("");
  const [bodyReady, setBodyReady] = useState(false);

  const onBodyReady = useCallback(() => setBodyReady(true), []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setBlog(null);
    setError("");
    setProgress(0);
    setActiveId("");
    setBodyReady(false);

    blogByIdAPI(id)
      .then((res) => {
        if (res?.status !== 200) {
          setError("Failed to load this field note.");
          return;
        }
        const blogData = res.data?.data || res.data;
        if (!blogData || !blogData.content) {
          setError("No content available.");
          return;
        }
        if (!blogData.is_published) {
          setError("This note is not published.");
          return;
        }

        const parsedContent =
          typeof blogData.content === "string"
            ? JSON.parse(blogData.content)
            : blogData.content;

        setBlog({ ...blogData, content: parsedContent });
      })
      .catch((err) => {
        console.error("Failed to fetch blog:", err);
        setError("Failed to load this field note.");
      });
  }, [id]);

  useEffect(() => {
    listAllBlogsAPI()
      .then((res) => {
        if (res?.status !== 200) return;
        setArchive(
          unwrapList(res)
            .filter((item) => item.is_published && (item.type === "blog" || !item.type))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!blog?._id) return undefined;
    try {
      const key = "aqc-viewed-posts";
      const seen = new Set(JSON.parse(sessionStorage.getItem(key) || "[]"));
      if (seen.has(blog._id)) return undefined;
      seen.add(blog._id);
      sessionStorage.setItem(key, JSON.stringify([...seen]));
    } catch {
      /* still count once from this effect */
    }
    recordBlogViewAPI(blog._id);
    return undefined;
  }, [blog?._id]);

  useEffect(() => {
    if (!blog?.title) return undefined;
    const previous = document.title;
    document.title = `${blog.title} — Field notes`;
    return () => {
      document.title = previous;
    };
  }, [blog?.title]);

  const headings = useMemo(
    () => extractHeadings(blog?.content).filter((item) => item.level <= 3),
    [blog?.content]
  );

  useEffect(() => {
    const onScroll = () => {
      const root = document.documentElement;
      const height = root.scrollHeight - root.clientHeight;
      setProgress(height > 0 ? (root.scrollTop / height) * 100 : 0);

      if (!headings.length) return;
      const offset = 128;
      let current = headings[0].id;
      headings.forEach((heading) => {
        const el = document.getElementById(heading.id);
        if (el && el.getBoundingClientRect().top <= offset) {
          current = heading.id;
        }
      });
      setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [blog, headings, bodyReady]);

  useEffect(() => {
    if (!blog) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const intro = [
        ".plate-masthead",
        ".plate-rail",
        ".plate-toc",
        ".plate-article",
      ];

      if (reduced) {
        gsap.set([...intro, ".plate-end", ".plate-mark"], {
          clearProps: "all",
          opacity: 1,
        });
        return;
      }

      gsap.fromTo(
        intro,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: "power3.out" }
      );
      gsap.fromTo(
        ".plate-mark",
        { opacity: 0 },
        { opacity: 1, duration: 0.9, delay: 0.28, ease: "power2.out" }
      );
      gsap.fromTo(
        ".plate-chart",
        { opacity: 0 },
        { opacity: 0.16, duration: 1.1, delay: 0.22, ease: "power2.out" }
      );

      gsap.fromTo(
        ".plate-end",
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".plate-end",
            start: "top 92%",
            once: true,
          },
        }
      );
    }, pageRef);
    return () => ctx.revert();
  }, [blog]);

  useEffect(() => {
    if (!blog || !bodyReady) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;

    const ctx = gsap.context(() => {
      gsap.utils
        .toArray(
          ".article-page--blog .editor-heading-h2, .article-page--blog .editor-heading-h3, .article-page--blog .editor-quote, .article-page--blog .editor-code"
        )
        .forEach((el) => {
          gsap.fromTo(
            el,
            { y: 14, opacity: 0.08 },
            {
              y: 0,
              opacity: 1,
              duration: 0.55,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                once: true,
              },
            }
          );
        });
    }, pageRef);

    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(refresh);
      ctx.revert();
    };
  }, [blog, bodyReady]);

  const plateIndex = useMemo(() => {
    const found = archive.findIndex((item) => item._id === id);
    return found >= 0 ? found : 0;
  }, [archive, id]);

  const nextNote = plateIndex > 0 ? archive[plateIndex - 1] : null;
  const previousNote =
    plateIndex >= 0 && plateIndex < archive.length - 1
      ? archive[plateIndex + 1]
      : null;

  const jumpTo = (event, headingId) => {
    event.preventDefault();
    const target = document.getElementById(headingId);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(headingId);
  };

  const back = (
    <Link to="/blog" className="article-back">
      <i className="fa-solid fa-arrow-left"></i>
      Field notes
    </Link>
  );

  if (error) {
    return (
      <div className="article-page article-page--blog">
        <Header />
        <div className="article-status is-error">
          <p>{error}</p>
          <Link to="/blog" className="article-end-link">
            Back to the survey
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="article-page article-page--blog">
        <Header />
        <div className="article-skeleton plate-skeleton">
          <div className="article-skeleton-kicker" />
          <div className="article-skeleton-title" />
          <div className="article-skeleton-title is-short" />
          <div className="article-skeleton-meta" />
          <div className="article-skeleton-block" />
        </div>
      </div>
    );
  }

  const hasContent = blog.content?.root?.children?.length > 0;
  const cover = blog.coverImageUrl || blog.coverImage;
  const tags = blog.tags?.filter(Boolean) || [];
  const minutes = estimateReadMinutes(blog.content, blog.excerpt);
  const coords = plateCoords(plateIndex);
  const plate = String(plateIndex + 1).padStart(2, "0");
  const intro = cleanIntro(blog.title, blog.excerpt?.trim() || excerptFrom(blog, 220));

  return (
    <div className="article-page article-page--blog" ref={pageRef}>
      <div
        className="article-progress"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />
      <div className="article-grid" aria-hidden="true" />
      <div className="article-paper" aria-hidden="true" />
      <Header />

      <main className={`plate ${cover ? "has-cover" : ""}`}>
        <section className="plate-masthead">
          <span className="plate-mark plate-mark--tl">Plate {plate}</span>
          <span className="plate-mark plate-mark--tr">Thrissur, Kerala</span>
          <span className="plate-mark plate-mark--bl">{coords.lat}</span>
          <span className="plate-mark plate-mark--br">{coords.lng}</span>

          <div className="plate-nav">
            {back}
            <span className="plate-id">
              Field note
              <span aria-hidden="true"> · </span>
              {plate}
            </span>
          </div>

          <div className="plate-masthead-grid">
            <header className="plate-head">
              <p className="article-kicker">02 — {tags[0] || "Field note"}</p>
              <div className="plate-title-wrap">
                <MapChart />
                <h1 className="article-title">{blog.title}</h1>
              </div>
              <div className="plate-byline">
                <span>{blog.author || "Athul Suresh"}</span>
                <span className="plate-dot" aria-hidden="true" />
                <time dateTime={blog.createdAt}>{formatLongDate(blog.createdAt)}</time>
                <span className="plate-dot" aria-hidden="true" />
                <span>{minutes} min read</span>
              </div>
              {intro ? <p className="plate-intro">{intro}</p> : null}
              {tags.length > 0 && (
                <div className="plate-head-tags">
                  {tags.map((tag) => (
                    <Link
                      className="plate-tag"
                      key={tag}
                      to={`/blog?subject=${encodeURIComponent(tag)}#notes-index`}
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </header>

            {cover ? (
              <figure className="plate-cover">
                <div className="plate-cover-frame">
                  <PlateCorners />
                  <img src={cover} alt={blog.title} />
                </div>
                <figcaption>
                  <span>Plate {plate}</span>
                  <span>
                    {coords.lat} · {coords.lng}
                  </span>
                </figcaption>
              </figure>
            ) : (
              <div className="plate-cover plate-cover--fallback" aria-hidden="true">
                <span>Plate {plate}</span>
                <small>
                  {coords.lat}
                  <br />
                  {coords.lng}
                </small>
              </div>
            )}
          </div>
        </section>

        <div className={`plate-layout ${headings.length ? "has-toc" : ""}`}>
          <aside className="plate-rail">
            <p>
              <small>Logged</small>
              <strong>
                <time dateTime={blog.createdAt}>{formatShortDate(blog.createdAt)}</time>
              </strong>
            </p>
            <p>
              <small>Read</small>
              <strong>{minutes} min</strong>
            </p>
            <p>
              <small>Bearing</small>
              <strong>
                {coords.lat}
                <br />
                {coords.lng}
              </strong>
            </p>
            {tags.length > 0 && (
              <div className="plate-tags">
                <small>Subjects</small>
                {tags.map((tag) => (
                  <Link
                    className="plate-tag"
                    key={tag}
                    to={`/blog?subject=${encodeURIComponent(tag)}#notes-index`}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </aside>

          <article className="plate-article">
            {headings.length > 0 && (
              <details className="plate-toc-mobile">
                <summary>On this page</summary>
                <TocList headings={headings} activeId={activeId} onJump={jumpTo} />
              </details>
            )}
            {hasContent ? (
              <div className="article-body">
                <BlogContentViewer
                  content={blog.content}
                  headings={headings}
                  onReady={onBodyReady}
                />
              </div>
            ) : (
              <p className="article-empty">No content available.</p>
            )}
            <BlogInteractions postId={id} title={blog.title} />
          </article>

          {headings.length > 0 && (
            <aside className="plate-toc">
              <p className="plate-toc-label">On this page</p>
              <TocList headings={headings} activeId={activeId} onJump={jumpTo} />
            </aside>
          )}
        </div>

        <footer className="plate-end">
          <span className="article-end-mark">End of plate</span>
          {(previousNote || nextNote) && (
            <nav className="plate-neighbors" aria-label="Previous and next notes">
              <NeighborCard blog={previousNote} direction="previous" />
              <NeighborCard blog={nextNote} direction="next" />
            </nav>
          )}
          <Link to="/blog" className="notes-more-btn">
            Back to the survey
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </footer>
      </main>
      <Footer />
    </div>
  );
}

export default BlogDetails;
