import { SERVER_URL } from "../service/serverURL";

export function mediaUrl(src) {
  const value = String(src || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  const path = value.startsWith("/") ? value : `/${value}`;
  return `${SERVER_URL}${path}`;
}
