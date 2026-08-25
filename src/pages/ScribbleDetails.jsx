import React, { useEffect, useState } from "react";
import { scribbleByIdAPI } from "../service/allApi";
import { Link, useParams } from "react-router-dom";
import BlogContentViewer from "../components/BlogContentViewer";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/article.css";

const formatDateParts = (value) => {
  const date = new Date(value);
  return {
    day: date.toLocaleDateString("en-GB", { day: "2-digit" }),
    month: date.toLocaleDateString("en-GB", { month: "short" }),
    year: date.getFullYear(),
  };
};

function ScribbleDetails() {
  const { id } = useParams();
  const [scribble, setScribble] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    scribbleByIdAPI(id)
      .then((res) => {
        if (res?.status !== 200) {
          setError("Failed to load scribble content.");
          return;
        }
        const scribbleData = res.data?.data || res.data;
        if (!scribbleData || !scribbleData.content) {
          setError("No content available.");
          return;
        }
        if (!scribbleData.is_published) {
          setError("This post is not published.");
          return;
        }

        const parsedContent =
          typeof scribbleData.content === "string"
            ? JSON.parse(scribbleData.content)
            : scribbleData.content;

        setScribble({ ...scribbleData, content: parsedContent });
      })
      .catch((err) => {
        console.error("Failed to fetch scribble:", err);
        setError("Failed to load scribble content.");
      });
  }, [id]);

  if (error) {
    return (
      <div className="article-page article-page--scribble">
        <Header />
        <div className="article-status is-error">
          <p>{error}</p>
          <Link to="/scribble" className="article-end-link">
            Back to scribbles
          </Link>
        </div>
      </div>
    );
  }

  if (!scribble) {
    return (
      <div className="article-page article-page--scribble">
        <Header />
        <div className="scribble-sheet scribble-sheet--loading">
          <div className="article-skeleton-title" />
          <div className="article-skeleton-block" />
        </div>
      </div>
    );
  }

  const hasContent = scribble.content?.root?.children?.length > 0;
  const cover = scribble.coverImageUrl || scribble.coverImage;
  const { day, month, year } = formatDateParts(scribble.createdAt);

  return (
    <div className="article-page article-page--scribble">
      <Header />

      <div className="scribble-sheet">
        <aside className="scribble-gutter">
          <time className="scribble-stamp" dateTime={scribble.createdAt}>
            <span className="scribble-stamp-day">{day}</span>
            <span className="scribble-stamp-month">{month}</span>
            <span className="scribble-stamp-year">{year}</span>
          </time>
          <span className="scribble-punch" aria-hidden="true" />
          <span className="scribble-punch" aria-hidden="true" />
          <span className="scribble-punch" aria-hidden="true" />
        </aside>

        <article className="scribble-note">
          <Link to="/scribble" className="article-back">
            <i className="fa-solid fa-arrow-left"></i>
            Margins
          </Link>
          <p className="scribble-label">{scribble.category || "Margin note"}</p>
          <h1 className="scribble-note-title">{scribble.title}</h1>
          <p className="scribble-author">{scribble.author || "Athul Suresh"}</p>

          {cover ? (
            <figure className="scribble-polaroid">
              <img src={cover} alt={scribble.title} loading="lazy" />
            </figure>
          ) : null}

          {hasContent ? (
            <div className="article-body scribble-body">
              <BlogContentViewer content={scribble.content} />
            </div>
          ) : (
            <p className="article-empty">No content available.</p>
          )}

          <p className="scribble-signoff">— that’s the note.</p>
          <Link to="/scribble" className="scribble-back-link">
            More scribbles
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </article>
      </div>
      <Footer />
    </div>
  );
}

export default ScribbleDetails;
