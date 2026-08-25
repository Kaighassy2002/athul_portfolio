export function lexicalPlainText(content) {
  const parse = (value) => {
    if (!value) return null;
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }
    return value;
  };

  const walk = (node) => {
    if (!node) return "";
    if (typeof node.text === "string") return node.text;
    if (Array.isArray(node.children)) return node.children.map(walk).join(" ");
    return "";
  };

  const parsed = parse(content);
  return walk(parsed?.root || parsed).replace(/\s+/g, " ").trim();
}

export function estimateReadMinutes(content, excerpt = "") {
  const text = lexicalPlainText(content) || excerpt || "";
  const words = text.split(/\s+/).filter(Boolean).length;
  if (!words) return 3;
  return Math.max(1, Math.round(words / 220));
}

export function excerptFrom(item, max = 160) {
  if (item?.excerpt) return item.excerpt;
  const text = lexicalPlainText(item?.content);
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

export function plateCoords(index = 0) {
  const lat = 10.5276 + ((index * 0.0173) % 0.42);
  const lng = 76.2144 + ((index * 0.0231) % 0.38);
  return {
    lat: `${lat.toFixed(4)}° N`,
    lng: `${lng.toFixed(4)}° E`,
  };
}

export function formatShortDate(value) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatRelativeTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const diff = Date.now() - date.getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatShortDate(value);
}

export function initialsFrom(name = "") {
  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "R";
  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function formatDateParts(value) {
  const date = new Date(value);
  return {
    day: date.toLocaleDateString("en-GB", { day: "2-digit" }),
    month: date.toLocaleDateString("en-GB", { month: "short" }),
    year: date.getFullYear(),
  };
}

export function slugifyHeading(text) {
  const slug = String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
  return slug || "section";
}

export function extractHeadings(content) {
  const parse = (value) => {
    if (!value) return null;
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }
    return value;
  };

  const textOf = (node) => {
    if (!node) return "";
    if (typeof node.text === "string") return node.text;
    if (Array.isArray(node.children)) return node.children.map(textOf).join(" ");
    return "";
  };

  const headings = [];
  const used = new Map();
  const walk = (node) => {
    if (!node) return;
    if (node.type === "heading" && node.tag) {
      const text = textOf(node).replace(/\s+/g, " ").trim();
      if (text) {
        const base = slugifyHeading(text);
        const count = (used.get(base) || 0) + 1;
        used.set(base, count);
        headings.push({
          id: count > 1 ? `${base}-${count}` : base,
          text,
          tag: node.tag,
          level: Number(String(node.tag).replace("h", "")) || 2,
        });
      }
    }
    if (Array.isArray(node.children)) node.children.forEach(walk);
  };

  const parsed = parse(content);
  walk(parsed?.root || parsed);
  return headings;
}
