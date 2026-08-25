export function warmAtlasAssets() {
  if (typeof window === "undefined") return;
  import("./atlasAssets").then((mod) => {
    mod.preloadAtlasAssets(window.innerWidth < 768);
  });
}
