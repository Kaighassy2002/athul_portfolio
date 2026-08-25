import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import gsap from "gsap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { listAllBlogsAPI, unwrapList } from "../service/allApi";
import {
  estimateReadMinutes,
  excerptFrom,
  formatDateParts,
  formatShortDate,
  plateCoords,
} from "../utils/editorial";
import "../styles/blog.css";

function MapChart() {
  return (
    <svg className="notes-chart" viewBox="0 0 720 160" aria-hidden="true">
      {[28, 56, 84, 112, 140].map((y) => (
        <line key={y} x1="0" y1={y} x2="720" y2={y} />
      ))}
      {[80, 180, 280, 380, 480, 580, 680].map((x) => (
        <line key={x} x1={x} y1="12" x2={x} y2="148" />
      ))}
      <path
        className="notes-chart-route"
        d="M 40 118 C 160 96, 240 48, 360 72 S 560 132, 690 58"
      />
      <circle cx="40" cy="118" r="3.2" />
      <circle cx="360" cy="72" r="3.2" />
      <circle cx="690" cy="58" r="3.2" />
    </svg>
  );
}

function PlateCorners() {
  return (
    <span className="notes-corners" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

function subjectOf(blog) {
  return (blog.tags || []).map((tag) => tag.trim()).filter(Boolean)[0] || "Field note";
}

function plateMeta(blog, index) {
  const cover = blog.coverImageUrl || blog.coverImage;
  const tags = (blog.tags || []).map((tag) => tag.trim()).filter(Boolean);
  const minutes = estimateReadMinutes(blog.content, blog.excerpt);
  const excerpt = excerptFrom(blog, 160);
  const coords = plateCoords(index);
  const plate = String(index + 1).padStart(2, "0");
  const date = formatDateParts(blog.createdAt);

  return { cover, tags, minutes, excerpt, coords, plate, date };
}

function LeadPlate({ blog, index, kicker = "Latest plate" }) {
  const { cover, tags, minutes, excerpt, coords, plate, date } = plateMeta(blog, index);
  const subject = tags[0] || "Field note";

  return (
    <Link to={`/blog/${blog._id}`} className="notes-lead">
      <figure className={`notes-lead-cover${cover ? "" : " is-fallback"}`}>
        <div className="notes-lead-frame">
          <PlateCorners />
          {cover ? (
            <img src={cover} alt="" />
          ) : (
            <div className="notes-lead-fallback" aria-hidden="true">
              <span>Plate {plate}</span>
              <small>
                {coords.lat}
                <br />
                {coords.lng}
              </small>
            </div>
          )}
        </div>
        <figcaption>
          <span>Plate {plate}</span>
          <span>
            {coords.lat} · {coords.lng}
          </span>
        </figcaption>
      </figure>

      <div className="notes-lead-copy">
        <p className="notes-kicker">
          {kicker}
          <span aria-hidden="true"> · </span>
          {subject}
        </p>
        <h2>{blog.title}</h2>
        {excerpt ? <p className="notes-lead-excerpt">{excerpt}</p> : null}
        <div className="notes-lead-byline">
          <time dateTime={blog.createdAt}>
            {date.day} {date.month} {date.year}
          </time>
          <span className="notes-dot" aria-hidden="true" />
          <span>{minutes} min read</span>
        </div>
        {tags.length > 0 && (
          <div className="notes-lead-tags">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}
        <span className="notes-lead-open">
          Open plate
          <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </span>
      </div>
    </Link>
  );
}

function FolioCard({ blog, index }) {
  const { cover, tags, minutes, excerpt, coords, plate, date } = plateMeta(blog, index);
  const subject = tags[0] || "Field note";

  return (
    <Link to={`/blog/${blog._id}`} className="notes-entry">
      <div className={`notes-entry-media${cover ? "" : " is-fallback"}`}>
        <PlateCorners />
        <span className="notes-entry-plate">Plate {plate}</span>
        {cover ? (
          <img loading="lazy" src={cover} alt="" />
        ) : (
          <span className="notes-entry-fallback">{subject}</span>
        )}
      </div>
      <div className="notes-entry-body">
        <p className="notes-entry-meta">
          {subject}
          <span aria-hidden="true"> · </span>
          <time dateTime={blog.createdAt}>
            {date.day} {date.month} {date.year}
          </time>
        </p>
        <h3>{blog.title}</h3>
        {excerpt ? <p className="notes-entry-excerpt">{excerpt}</p> : null}
        <div className="notes-entry-foot">
          <span>{minutes} min</span>
          <span className="notes-entry-coord">
            {coords.lat} / {coords.lng}
          </span>
          <span className="notes-entry-arrow" aria-hidden="true">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

function Blog() {
  const pageRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const subjectFromUrl = searchParams.get("subject");
  const [allBlogs, setBlogList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState(subjectFromUrl);
  const [query, setQuery] = useState("");

  const blogItems = useMemo(
    () =>
      allBlogs
        .filter((blog) => blog.is_published && (blog.type === "blog" || !blog.type))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [allBlogs]
  );

  const plateIndexOf = (blog) => {
    const found = blogItems.findIndex((item) => item._id === blog._id);
    return found >= 0 ? found : 0;
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await listAllBlogsAPI();
        if (response?.status !== 200) {
          throw new Error(response?.message || "Failed to load blogs");
        }
        setBlogList(unwrapList(response));
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const previous = document.title;
    document.title = "Field notes — Athul Suresh";
    return () => {
      document.title = previous;
    };
  }, []);

  useEffect(() => {
    setSelectedCategory(subjectFromUrl);
    setVisibleCount(6);
  }, [subjectFromUrl]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(
          ".notes-hero .notes-kicker, .notes-title, .notes-lede, .notes-hero-actions, .notes-index, .notes-chart, .notes-mark",
          { clearProps: "all", opacity: 1 }
        );
        return;
      }

      gsap.fromTo(
        ".notes-hero .notes-kicker, .notes-title, .notes-lede, .notes-hero-actions",
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1 }
      );
      gsap.fromTo(
        ".notes-index",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.16, ease: "power3.out" }
      );
      gsap.fromTo(
        ".notes-chart, .notes-mark",
        { opacity: 0 },
        { opacity: 1, duration: 1.1, delay: 0.18, ease: "power2.out" }
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
        ".notes-lead, .notes-entry, .notes-empty, .notes-skeleton",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.06, ease: "power2.out" }
      );
    }, pageRef);
    return () => ctx.revert();
  }, [loading, selectedCategory, query]);

  const uniqueCategories = useMemo(
    () => [
      ...new Set(
        blogItems.flatMap((blog) => blog.tags?.map((tag) => tag.trim()).filter(Boolean) || [])
      ),
    ],
    [blogItems]
  );

  const needle = query.trim().toLowerCase();

  const filteredBlogs = blogItems.filter((blog) => {
    const matchesCategory = !selectedCategory || blog.tags?.includes(selectedCategory);
    const matchesQuery =
      !needle ||
      blog.title?.toLowerCase().includes(needle) ||
      blog.excerpt?.toLowerCase().includes(needle) ||
      blog.tags?.some((tag) => tag.toLowerCase().includes(needle));
    return matchesCategory && matchesQuery;
  });

  const leadNote = filteredBlogs[0] || null;
  const boardSource = filteredBlogs.slice(1);
  const boardNotes = boardSource.slice(0, visibleCount);
  const latestPlates = blogItems.slice(0, 4);
  const resetPaging = () => setVisibleCount(6);
  const selectCategory = (tag) => {
    setSelectedCategory(tag);
    resetPaging();
    if (tag) {
      setSearchParams({ subject: tag }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  return (
    <div className="blog-page" ref={pageRef}>
      <Header />

      <section className="notes-hero">
        <div className="notes-grid" aria-hidden="true" />
        <div className="notes-paper" aria-hidden="true" />
        <span className="notes-mark notes-mark--tl">Plate 02</span>
        <span className="notes-mark notes-mark--tr">Thrissur, Kerala</span>
        <span className="notes-mark notes-mark--bl">10.5276° N</span>
        <span className="notes-mark notes-mark--br">76.2144° E</span>

        <div className="notes-hero-layout">
          <div className="notes-hero-copy">
            <p className="notes-kicker">02 — Field Notes</p>
            <div className="notes-title-wrap">
              <MapChart />
              <h1 className="notes-title">
                Ideas Worth
                <em>Exploring</em>
              </h1>
            </div>
            <p className="notes-lede">
              A quiet journal of AI, development, experiments, and the lessons that
              stay after the build is done — mapped one plate at a time.
            </p>
            <div className="notes-hero-actions">
              <a href="#notes-index" className="notes-more-btn">
                Open the survey
                <i className="fa-solid fa-arrow-down"></i>
              </a>
            </div>
          </div>

          <aside className="notes-index" aria-label="Latest plates">
            <p className="notes-index-label">Latest plates</p>
            {loading ? (
              <div className="notes-index-list">
                <div className="notes-index-skeleton" />
                <div className="notes-index-skeleton" />
                <div className="notes-index-skeleton" />
              </div>
            ) : latestPlates.length > 0 ? (
              <div className="notes-index-list">
                {latestPlates.map((blog, index) => (
                  <Link
                    key={blog._id}
                    to={`/blog/${blog._id}`}
                    className="notes-index-item"
                  >
                    <span className="notes-index-code">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <small>{subjectOf(blog)}</small>
                      <strong>{blog.title}</strong>
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="notes-index-empty">The first plate is still being drawn.</p>
            )}
            <div className="notes-index-stats">
              <p>
                <small>Notes</small>
                <strong>{loading ? "—" : String(blogItems.length).padStart(2, "0")}</strong>
              </p>
              <p>
                <small>Subjects</small>
                <strong>
                  {loading ? "—" : String(uniqueCategories.length).padStart(2, "0")}
                </strong>
              </p>
              <p>
                <small>Updated</small>
                <strong>
                  {blogItems[0] ? formatShortDate(blogItems[0].createdAt) : "Soon"}
                </strong>
              </p>
            </div>
          </aside>
        </div>
      </section>

      <main className="notes-main">
        <section className="notes-archive" id="notes-index">
          <div className="notes-archive-head">
            <div className="notes-archive-copy">
              <p className="notes-kicker">The survey</p>
              <h2>{selectedCategory || "Plates from the desk"}</h2>
              <p>
                {loading
                  ? "Unrolling the gazetteer."
                  : selectedCategory || needle
                    ? `${String(filteredBlogs.length).padStart(2, "0")} notes on this bearing.`
                    : `${String(blogItems.length).padStart(2, "0")} published field notes — newest plate first.`}
              </p>
            </div>

            <div className="notes-archive-tools">
              <label className="notes-search">
                <span>Find a plate</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    resetPaging();
                  }}
                  placeholder="Search titles, notes, subjects"
                  aria-label="Search field notes"
                />
              </label>
              {uniqueCategories.length > 0 && (
                <div className="notes-legend" role="tablist" aria-label="Subjects">
                  <button
                    type="button"
                    className={`notes-legend-item ${selectedCategory === null ? "is-active" : ""}`}
                    onClick={() => selectCategory(null)}
                  >
                    <span className="notes-legend-dot" />
                    All
                  </button>
                  {uniqueCategories.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      className={`notes-legend-item ${selectedCategory === tag ? "is-active" : ""}`}
                      onClick={() => selectCategory(tag)}
                    >
                      <span className="notes-legend-dot" />
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="notes-loading">
              <div className="notes-skeleton notes-skeleton--lead" />
              <div className="notes-folio">
                <div className="notes-skeleton" />
                <div className="notes-skeleton" />
                <div className="notes-skeleton" />
                <div className="notes-skeleton" />
              </div>
            </div>
          ) : blogItems.length === 0 ? (
            <div className="notes-empty">
              <p>No field notes yet. The next plate is still being drawn.</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <p className="notes-empty">No notes on this bearing yet.</p>
          ) : (
            <>
              {leadNote ? (
                <LeadPlate
                  blog={leadNote}
                  index={plateIndexOf(leadNote)}
                  kicker={selectedCategory || needle ? "On this bearing" : "Latest plate"}
                />
              ) : null}

              {boardNotes.length > 0 && (
                <div className="notes-folio">
                  {boardNotes.map((blog) => (
                    <FolioCard
                      key={blog._id}
                      blog={blog}
                      index={plateIndexOf(blog)}
                    />
                  ))}
                </div>
              )}

              {visibleCount < boardSource.length && (
                <div className="notes-more">
                  <button
                    type="button"
                    className="notes-more-btn"
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                  >
                    More notes
                    <i className="fa-solid fa-arrow-down"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Blog;
