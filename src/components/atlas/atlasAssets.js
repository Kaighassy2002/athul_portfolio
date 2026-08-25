import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { asTexture, createGlobeMaps } from "./globeMaps";

THREE.Cache.enabled = true;

export const ATLAS_ASSET_VERSION = 1;

const DB_NAME = "atlas-3d-cache";
const STORE_NAME = "assets";
const HTTP_CACHE = "atlas-3d-cache";
const ENV_URL =
  "https://raw.githack.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/potsdamer_platz_1k.hdr";

const mapMemory = new Map();
const mapPromises = new Map();
let envTexture = null;
let envPromise = null;

function mapKey(mobile) {
  return `globe-v${ATLAS_ASSET_VERSION}-${mobile ? "mobile" : "desktop"}`;
}

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function idbGet(key) {
  const db = await openDb();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const request = tx.objectStore(STORE_NAME).get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}

async function idbSet(key, value) {
  const db = await openDb();
  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const request = tx.objectStore(STORE_NAME).put(value, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}

function sourceToBlob(image) {
  if (!image) return Promise.reject(new Error("Missing texture image"));
  if (typeof Blob !== "undefined" && image instanceof Blob) {
    return Promise.resolve(image);
  }
  if (typeof HTMLCanvasElement !== "undefined" && image instanceof HTMLCanvasElement) {
    return new Promise((resolve, reject) => {
      image.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
        "image/png"
      );
    });
  }
  if (typeof OffscreenCanvas !== "undefined" && image instanceof OffscreenCanvas) {
    return image.convertToBlob({ type: "image/png" });
  }
  return Promise.reject(new Error("Unsupported texture source"));
}

function schedulePersist(key, maps) {
  const run = () => {
    void persistGlobeMaps(key, maps);
  };
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(run, { timeout: 2500 });
    return;
  }
  setTimeout(run, 400);
}

async function persistGlobeMaps(key, maps) {
  try {
    const [albedo, roughness, bump, clouds] = await Promise.all([
      sourceToBlob(maps.albedo.image),
      sourceToBlob(maps.roughness.image),
      sourceToBlob(maps.bump.image),
      sourceToBlob(maps.clouds.image),
    ]);
    await idbSet(key, {
      version: ATLAS_ASSET_VERSION,
      albedo,
      roughness,
      bump,
      clouds,
    });
  } catch {
    /* private mode, quota, or missing canvas */
  }
}

async function toBitmap(blob) {
  try {
    return await createImageBitmap(blob, {
      imageOrientation: "none",
      premultiplyAlpha: "none",
    });
  } catch {
    return createImageBitmap(blob);
  }
}

async function mapsFromStored(record) {
  if (!record?.albedo || !record?.roughness || !record?.bump || !record?.clouds) {
    return null;
  }
  const [albedo, roughness, bump, clouds] = await Promise.all([
    toBitmap(record.albedo),
    toBitmap(record.roughness),
    toBitmap(record.bump),
    toBitmap(record.clouds),
  ]);
  return {
    albedo: asTexture(albedo, true),
    roughness: asTexture(roughness),
    bump: asTexture(bump),
    clouds: asTexture(clouds, true),
  };
}

async function loadGlobeMaps(mobile) {
  const key = mapKey(mobile);
  const hit = mapMemory.get(key);
  if (hit) return hit;

  try {
    const stored = await idbGet(key);
    if (stored?.version === ATLAS_ASSET_VERSION) {
      const restored = await mapsFromStored(stored);
      if (restored) {
        mapMemory.set(key, restored);
        return restored;
      }
    }
  } catch {
    /* IndexedDB unavailable */
  }

  const maps = createGlobeMaps(mobile);
  mapMemory.set(key, maps);
  schedulePersist(key, maps);
  return maps;
}

export function ensureGlobeMaps(mobile) {
  const key = mapKey(mobile);
  if (!mapPromises.has(key)) {
    mapPromises.set(
      key,
      loadGlobeMaps(Boolean(mobile)).catch((error) => {
        mapPromises.delete(key);
        mapMemory.delete(key);
        throw error;
      })
    );
  }
  return mapPromises.get(key);
}

function hdrFromBuffer(buffer) {
  const loader = new RGBELoader();
  const texData = loader.parse(buffer);
  const texture = new THREE.DataTexture(
    texData.data,
    texData.width,
    texData.height
  );
  if (texData.type !== undefined) texture.type = texData.type;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.flipY = true;
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.LinearSRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

async function readCachedBuffer(url) {
  if (typeof caches === "undefined") return null;
  const cache = await caches.open(HTTP_CACHE);
  const cached = await cache.match(url);
  if (!cached) return null;
  return cached.arrayBuffer();
}

async function writeCachedBuffer(url, buffer) {
  if (typeof caches === "undefined") return;
  try {
    const cache = await caches.open(HTTP_CACHE);
    await cache.put(url, new Response(buffer, {
      headers: { "Content-Type": "application/octet-stream" },
    }));
  } catch {
    /* quota or private mode */
  }
}

async function loadEnvironment() {
  if (envTexture) return envTexture;

  try {
    const cached = await readCachedBuffer(ENV_URL);
    if (cached) {
      envTexture = hdrFromBuffer(cached);
      return envTexture;
    }
  } catch {
    /* Cache Storage unavailable */
  }

  const response = await fetch(ENV_URL, { cache: "force-cache" });
  if (!response.ok) {
    throw new Error(`Failed to load atlas environment (${response.status})`);
  }
  const buffer = await response.arrayBuffer();
  void writeCachedBuffer(ENV_URL, buffer);
  envTexture = hdrFromBuffer(buffer);
  return envTexture;
}

export function ensureAtlasEnvironment() {
  if (!envPromise) {
    envPromise = loadEnvironment().catch((error) => {
      envPromise = null;
      throw error;
    });
  }
  return envPromise;
}

export function peekAtlasEnvironment() {
  return envTexture;
}

export function preloadAtlasAssets(mobile = false) {
  void ensureGlobeMaps(mobile);
  void ensureAtlasEnvironment();
}
