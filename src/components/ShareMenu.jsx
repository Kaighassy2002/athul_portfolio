import React, { useEffect, useRef, useState } from "react";

const CHANNELS = [
  { id: "copy", label: "Copy link", icon: "fa-link" },
  { id: "whatsapp", label: "WhatsApp", icon: "fa-whatsapp", brand: true },
  { id: "linkedin", label: "LinkedIn", icon: "fa-linkedin-in", brand: true },
  { id: "x", label: "X / Twitter", icon: "fa-x-twitter", brand: true },
  { id: "facebook", label: "Facebook", icon: "fa-facebook-f", brand: true },
];

function shareUrl(id, url, title) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(title);
  if (id === "whatsapp") {
    return `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
  }
  if (id === "linkedin") {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  }
  if (id === "x") {
    return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
  }
  if (id === "facebook") {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  }
  return "";
}

export default function ShareMenu({ open, onClose, url, title, anchorRef, onShared }) {
  const menuRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    setCopied(false);
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    const onPointer = (event) => {
      if (
        menuRef.current?.contains(event.target) ||
        anchorRef?.current?.contains(event.target)
      ) {
        return;
      }
      onClose();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  const onShare = async (id) => {
    if (id === "copy") {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      } catch {
        window.prompt("Copy this link", url);
      }
      onShared?.();
      return;
    }
    const href = shareUrl(id, url, title);
    if (href) window.open(href, "_blank", "noopener,noreferrer");
    onShared?.();
  };

  return (
    <div
      className="share-sheet"
      ref={menuRef}
      role="menu"
      aria-label="Share this field note"
    >
      <p className="share-sheet-kicker">Pass it on</p>
      {CHANNELS.map((channel) => (
        <button
          key={channel.id}
          type="button"
          className="share-sheet-item"
          role="menuitem"
          onClick={() => onShare(channel.id)}
        >
          <i className={`${channel.brand ? "fa-brands" : "fa-solid"} ${channel.icon}`}></i>
          <span>{channel.id === "copy" && copied ? "Copied" : channel.label}</span>
        </button>
      ))}
    </div>
  );
}
