import { useEffect } from "react";

export const SITE_URL = "https://www.athulsuresh.me";
export const SITE_NAME = "Athul Suresh";
export const DEFAULT_DESCRIPTION =
  "Portfolio of Athul Suresh — AI and software engineering, field notes, experiments, and projects mapped from Thrissur.";

export function canonicalPath(path = "/") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean === "/" ? "/" : clean.replace(/\/$/, "")}`;
}

function upsertMeta(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([key, value]) => {
    if (value) el.setAttribute(key, value);
  });
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export const OG_IMAGE = `${SITE_URL}/og-image.png`;

export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  type = "website",
  image = OG_IMAGE,
  noIndex = false,
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Atlas of work`;
    const url = canonicalPath(path);
    document.title = fullTitle;
    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: noIndex ? "noindex, nofollow" : "index, follow",
    });
    upsertLink("canonical", url);
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: fullTitle });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: url });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: image });
    upsertMeta('meta[property="og:image:width"]', { property: "og:image:width", content: "1200" });
    upsertMeta('meta[property="og:image:height"]', { property: "og:image:height", content: "630" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: fullTitle });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  }, [title, description, path, type, image, noIndex]);

  return null;
}

export default Seo;
