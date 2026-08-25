import React from "react";
import { initialsFrom } from "../utils/editorial";
import "../styles/auth.css";

export default function UserAvatar({ name, src, className = "" }) {
  if (src) {
    return <img className={`user-avatar ${className}`} src={src} alt="" />;
  }
  return (
    <span className={`user-avatar is-fallback ${className}`} aria-hidden="true">
      {initialsFrom(name)}
    </span>
  );
}
