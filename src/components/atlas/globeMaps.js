import * as THREE from "three";

function project(lon, lat, width, height) {
  return [((lon + 180) / 360) * width, ((90 - lat) / 180) * height];
}

function hash(x, y) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

function noise(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  return (
    (1 - uy) * ((1 - ux) * hash(ix, iy) + ux * hash(ix + 1, iy)) +
    uy * ((1 - ux) * hash(ix, iy + 1) + ux * hash(ix + 1, iy + 1))
  );
}

function fbm(x, y) {
  return (
    noise(x, y) * 0.52 +
    noise(x * 2.1, y * 2.1) * 0.28 +
    noise(x * 4.3, y * 4.3) * 0.14 +
    noise(x * 8.1, y * 8.1) * 0.06
  );
}

function drawPoly(ctx, points, width, height) {
  ctx.beginPath();
  points.forEach(([lon, lat], index) => {
    const [x, y] = project(lon, lat, width, height);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();
}

function drawIsland(ctx, lon, lat, rx, ry, width, height) {
  const [x, y] = project(lon, lat, width, height);
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

const LAND = [
  // North America
  [
    [-168, 65.5], [-165, 64], [-161, 66], [-156, 71], [-141, 70], [-130, 69],
    [-117, 67], [-105, 68], [-94, 64], [-86, 66], [-82, 62], [-70, 58],
    [-64, 60], [-55, 53], [-61, 47], [-67, 48], [-70, 46], [-70, 43],
    [-74, 40], [-76, 36], [-81, 31], [-82.5, 24.5], [-80.5, 25.2],
    [-90, 29], [-97, 26], [-102, 29], [-106, 31], [-110, 24], [-114, 27],
    [-117, 32.5], [-124.5, 40], [-124.2, 48], [-127, 50], [-130, 54],
    [-136, 58], [-149, 60], [-154, 59], [-162, 55], [-166, 60], [-168, 65.5],
  ],
  // Alaska panhandle / Aleutians hint
  [
    [-153, 59], [-148, 60.5], [-141, 60], [-135, 57], [-132, 55],
    [-136, 56.5], [-146, 58], [-153, 59],
  ],
  // Mexico + Central America
  [
    [-117, 32.5], [-110, 24], [-105, 22], [-97, 22], [-90, 16], [-87, 13],
    [-83, 8.5], [-80, 8.2], [-77, 8], [-81, 8.5], [-84, 10], [-87, 14],
    [-91, 18], [-97, 16], [-105, 20], [-109, 23], [-114, 27], [-117, 32.5],
  ],
  // South America
  [
    [-81, 8.2], [-77, 8], [-72, 12], [-67, 11], [-60, 8], [-51, 4],
    [-44, -2], [-35, -5], [-35, -8], [-39, -15], [-40, -22], [-41, -23],
    [-48, -25], [-53, -34], [-58, -38], [-62, -40], [-65, -43],
    [-67, -50], [-68, -55], [-71, -54], [-74, -50], [-73, -42],
    [-71, -30], [-76, -15], [-79, -5], [-81, 2], [-81, 8.2],
  ],
  // Greenland
  [
    [-73, 78], [-60, 82], [-47, 82.5], [-26, 73], [-22, 70], [-30, 68],
    [-44, 60], [-50, 64], [-68, 76], [-73, 78],
  ],
  // Iceland
  [
    [-24.5, 66.5], [-13.5, 66.3], [-13.6, 63.4], [-24, 63.4], [-24.5, 66.5],
  ],
  // British Isles
  [
    [-5.5, 58.6], [-1.8, 57.6], [1.8, 52.8], [1.4, 51.1], [-5.2, 50.0],
    [-5.7, 51.7], [-4.8, 53.4], [-6.2, 55.2], [-5.5, 58.6],
  ],
  [
    [-10.4, 55.3], [-6.0, 55.2], [-5.5, 52.1], [-9.8, 51.4], [-10.4, 55.3],
  ],
  // Europe
  [
    [-9.5, 43.2], [-9.3, 38.7], [-5.6, 36.0], [-2.0, 36.8], [-1.0, 37.2],
    [0.2, 38.8], [3.1, 42.5], [7.5, 43.7], [9.6, 44.1], [12.4, 41.9],
    [15.6, 38.1], [18.3, 40.2], [16.2, 41.7], [13.5, 45.5], [14.0, 46.5],
    [16.5, 45.5], [18.5, 42.5], [20.0, 39.6], [23.7, 37.9], [26.5, 37.8],
    [27.3, 40.8], [29.0, 41.1], [29.0, 43.4], [32.0, 46.5], [30.0, 46.5],
    [29.5, 45.2], [28.8, 45.4], [32.5, 46.6], [36.6, 45.3], [40.0, 47.2],
    [39.0, 48.5], [35.0, 44.6], [32.0, 46.0], [30.5, 51.5], [28.0, 56.0],
    [24.0, 60.0], [22.0, 63.5], [16.5, 69.0], [12.0, 66.0], [8.0, 63.4],
    [5.3, 60.4], [4.8, 52.9], [1.8, 51.1], [-1.8, 48.6], [-4.5, 48.4],
    [-8.2, 43.4], [-9.5, 43.2],
  ],
  // Scandinavia north
  [
    [12.0, 66.0], [16.5, 69.0], [25.0, 71.1], [31.0, 70.2], [28.0, 68.0],
    [24.0, 65.0], [16.0, 63.5], [12.0, 66.0],
  ],
  // Africa
  [
    [-17.0, 21.5], [-16.5, 16.0], [-16.8, 12.4], [-13.5, 10.0], [-8.0, 4.8],
    [0.0, 5.5], [6.0, 4.2], [8.5, 4.6], [9.4, 1.0], [8.8, -0.7],
    [11.8, -5.0], [12.4, -6.2], [13.4, -8.2], [12.0, -17.2], [14.4, -22.0],
    [16.4, -28.6], [18.4, -34.8], [20.0, -34.8], [26.4, -33.8], [32.8, -28.5],
    [33.5, -26.0], [35.5, -23.8], [40.4, -14.4], [39.3, -10.0], [42.1, -2.0],
    [51.1, 11.6], [43.3, 12.6], [39.6, 15.8], [38.6, 18.0], [37.3, 20.7],
    [36.9, 22.0], [32.3, 29.8], [32.5, 31.2], [25.0, 31.6], [20.0, 32.3],
    [10.0, 37.0], [5.0, 36.8], [-2.0, 35.2], [-5.6, 35.8], [-9.8, 31.6],
    [-16.0, 24.0], [-17.0, 21.5],
  ],
  // Madagascar
  [
    [49.2, -12.0], [50.5, -15.3], [47.6, -25.0], [43.6, -23.4],
    [43.3, -17.0], [47.0, -13.0], [49.2, -12.0],
  ],
  // Arabia
  [
    [34.6, 31.2], [35.8, 33.6], [36.5, 32.0], [39.0, 32.2], [48.0, 30.0],
    [50.8, 26.0], [56.4, 26.4], [59.8, 25.4], [57.4, 22.6], [54.0, 16.9],
    [47.6, 13.9], [43.4, 12.6], [42.6, 16.0], [39.8, 21.4], [36.6, 24.5],
    [34.9, 27.8], [34.6, 31.2],
  ],
  // Anatolia / Levant
  [
    [26.5, 37.8], [27.4, 36.6], [32.0, 36.2], [36.2, 36.0], [36.3, 33.1],
    [35.0, 32.6], [34.6, 31.2], [32.5, 31.2], [29.0, 36.6], [27.2, 38.4],
    [26.5, 37.8],
  ],
  // Indian subcontinent
  [
    [61.0, 25.4], [66.6, 25.6], [68.2, 23.8], [69.6, 22.8], [72.6, 21.3],
    [72.9, 18.9], [73.1, 16.0], [74.4, 14.3], [74.8, 12.8], [76.2, 10.4],
    [77.5, 8.1], [80.3, 13.1], [80.2, 15.4], [82.3, 16.6], [84.9, 19.4],
    [87.0, 21.4], [88.4, 21.6], [88.9, 21.4], [88.1, 24.4], [88.8, 26.3],
    [86.0, 26.8], [83.0, 27.4], [80.2, 26.8], [78.0, 31.6], [77.1, 32.9],
    [75.8, 34.6], [74.6, 37.0], [71.6, 36.8], [69.2, 34.4], [66.0, 29.6],
    [61.6, 26.8], [61.0, 25.4],
  ],
  // Sri Lanka
  [
    [79.7, 9.8], [81.9, 8.5], [81.9, 6.1], [80.6, 5.9], [79.7, 8.0], [79.7, 9.8],
  ],
  // Eurasia (Russia, Central Asia, China, SE Asia)
  [
    [29.0, 60.0], [32.0, 70.0], [44.0, 68.0], [60.0, 70.0], [73.0, 73.0],
    [80.0, 76.0], [95.0, 76.0], [110.0, 74.0], [125.0, 73.0], [141.0, 73.0],
    [160.0, 70.0], [170.0, 70.0], [179.0, 68.0], [179.0, 62.0], [170.0, 60.0],
    [160.0, 59.0], [150.0, 59.0], [142.0, 53.0], [140.0, 48.0], [131.0, 43.0],
    [128.0, 38.0], [122.0, 37.0], [117.0, 38.5], [122.0, 40.0], [124.0, 40.0],
    [122.0, 32.0], [120.0, 26.0], [110.0, 20.0], [109.0, 13.0], [104.5, 8.6],
    [100.0, 6.5], [98.0, 8.0], [98.5, 12.5], [100.0, 13.5], [104.0, 14.5],
    [109.0, 21.5], [106.0, 22.0], [100.0, 21.5], [94.0, 19.0], [92.0, 21.5],
    [88.8, 21.6], [88.1, 24.4], [88.8, 26.3], [92.0, 26.8], [95.0, 27.5],
    [97.0, 28.0], [98.0, 28.2], [97.0, 36.0], [94.0, 29.6], [88.0, 28.0],
    [80.0, 30.5], [75.8, 34.6], [74.6, 37.0], [71.0, 39.4], [67.0, 37.2],
    [61.0, 36.8], [56.0, 37.5], [53.0, 37.0], [48.0, 38.5], [49.0, 41.0],
    [53.0, 42.0], [50.0, 41.3], [48.0, 38.5], [44.0, 40.0], [40.0, 43.4],
    [40.0, 47.2], [39.0, 48.5], [44.0, 48.5], [47.0, 50.0], [52.0, 51.7],
    [60.0, 54.0], [68.0, 56.0], [72.0, 61.0], [60.0, 60.0], [50.0, 58.0],
    [40.0, 56.0], [35.0, 54.0], [30.0, 56.0], [29.0, 60.0],
  ],
  // Kamchatka
  [
    [156.0, 61.0], [163.0, 60.0], [164.0, 56.0], [158.0, 51.0],
    [156.0, 57.0], [156.0, 61.0],
  ],
  // Japan
  [
    [140.0, 45.5], [145.8, 43.4], [141.4, 41.4], [140.9, 38.3],
    [140.0, 35.0], [138.0, 34.6], [131.0, 31.4], [130.4, 32.6],
    [132.8, 34.4], [135.8, 35.5], [139.8, 35.7], [140.0, 38.0],
    [141.0, 41.0], [140.0, 45.5],
  ],
  // Philippines
  [
    [120.0, 18.5], [122.2, 18.5], [126.0, 7.2], [124.0, 6.0],
    [119.8, 10.5], [120.0, 18.5],
  ],
  // Borneo
  [
    [109.0, 7.0], [117.0, 7.2], [119.0, 5.2], [116.5, -3.0],
    [109.5, -1.2], [108.8, 3.0], [109.0, 7.0],
  ],
  // Sumatra
  [
    [95.2, 5.6], [104.0, -2.0], [105.8, -6.0], [102.0, -4.0],
    [96.0, 2.0], [95.2, 5.6],
  ],
  // Sulawesi
  [
    [119.0, 1.5], [125.0, 1.4], [124.5, -4.5], [120.5, -5.5],
    [119.0, -2.0], [119.0, 1.5],
  ],
  // Java
  [
    [105.2, -5.9], [114.4, -7.7], [114.0, -8.7], [105.8, -6.8], [105.2, -5.9],
  ],
  // New Guinea
  [
    [131.0, -1.0], [141.0, -2.5], [150.8, -10.0], [147.0, -10.2],
    [137.0, -8.0], [131.5, -4.0], [131.0, -1.0],
  ],
  // Australia
  [
    [113.6, -22.0], [114.0, -27.0], [115.0, -34.0], [120.0, -34.5],
    [129.0, -32.0], [136.0, -35.0], [138.0, -36.0], [140.0, -38.0],
    [146.0, -39.0], [150.0, -37.5], [153.4, -28.0], [153.0, -25.0],
    [145.0, -15.0], [142.5, -11.0], [136.0, -12.2], [130.0, -12.4],
    [126.0, -14.0], [122.0, -17.0], [114.0, -21.5], [113.6, -22.0],
  ],
  // Tasmania
  [
    [144.6, -40.7], [148.3, -40.8], [148.0, -43.6], [145.0, -43.6], [144.6, -40.7],
  ],
  // New Zealand
  [
    [172.6, -34.4], [178.5, -37.6], [178.0, -41.4], [172.6, -40.5],
    [172.4, -35.2], [172.6, -34.4],
  ],
  [
    [166.4, -45.0], [174.0, -41.6], [170.8, -46.6], [166.5, -46.6], [166.4, -45.0],
  ],
  // Antarctica
  [
    [-180, -72], [-140, -75], [-90, -72], [-60, -63], [-45, -60],
    [0, -69], [40, -68], [80, -66], [120, -66], [160, -70],
    [180, -72], [180, -90], [-180, -90], [-180, -72],
  ],
];

const ISLANDS = [
  [-78.4, 21.5, 7, 3.2],
  [-66.1, 18.2, 3.2, 1.6],
  [12.5, 42.8, 2.4, 3.6],
  [9.0, 40.0, 2.2, 3.2],
  [15.0, 37.6, 2.6, 2.0],
  [25.0, 35.2, 4.2, 2.0],
  [33.8, 35.1, 2.4, 1.4],
  [45.0, -12.6, 2.0, 1.2],
  [57.6, -20.3, 2.2, 1.4],
  [55.5, -21.1, 1.6, 1.0],
  [73.5, 4.2, 1.4, 1.0],
  [80.0, 7.0, 1.2, 0.8],
  [121.6, 24.0, 3.2, 5.0],
  [127.8, 26.4, 2.0, 2.4],
  [129.0, 35.0, 2.4, 4.0],
  [144.8, 13.4, 1.6, 1.2],
  [171.8, -42.0, 1.4, 1.0],
  [-156.5, 20.5, 2.6, 1.6],
  [-61.5, 10.6, 1.8, 1.2],
  [47.5, -18.8, 1.4, 1.0],
];

function inBand(lon, lat, lon0, lon1, lat0, lat1) {
  return lon >= lon0 && lon <= lon1 && lat >= lat0 && lat <= lat1;
}

function biome(lon, lat, n) {
  if (lat > 72 || lat < -62) {
    return [214, 226, 220];
  }
  if (lat > 62 || lat < -52) {
    return [168, 186, 172];
  }

  const desert =
    inBand(lon, lat, -17, 36, 14, 32) ||
    inBand(lon, lat, 36, 60, 13, 32) ||
    inBand(lon, lat, 114, 146, -32, -18) ||
    inBand(lon, lat, 90, 118, 37, 50) ||
    inBand(lon, lat, -118, -102, 28, 38) ||
    inBand(lon, lat, 14, 28, -30, -20) ||
    inBand(lon, lat, 68, 76, 23, 30);

  const rain =
    inBand(lon, lat, -78, -50, -12, 6) ||
    inBand(lon, lat, 8, 30, -4, 6) ||
    inBand(lon, lat, 95, 140, -8, 6) ||
    inBand(lon, lat, 72.5, 77.2, 8, 16);

  const highland =
    inBand(lon, lat, 70, 96, 26, 36) ||
    inBand(lon, lat, -80, -66, -48, 10) ||
    inBand(lon, lat, -122, -104, 32, 60) ||
    inBand(lon, lat, 6, 16, 44, 48);

  if (desert) {
    const t = 0.72 + n * 0.28;
    return [Math.round(176 + t * 28), Math.round(142 + t * 18), Math.round(86 + t * 10)];
  }
  if (rain) {
    const t = 0.55 + n * 0.45;
    return [Math.round(28 + t * 22), Math.round(78 + t * 36), Math.round(48 + t * 18)];
  }
  if (highland) {
    return [96 + n * 28, 92 + n * 18, 72 + n * 12];
  }
  if (Math.abs(lat) < 12) {
    return [46 + n * 28, 102 + n * 30, 62 + n * 16];
  }
  if (Math.abs(lat) < 32) {
    return [78 + n * 36, 118 + n * 22, 64 + n * 14];
  }
  return [72 + n * 30, 108 + n * 24, 70 + n * 16];
}

function oceanColor(lat, n) {
  const pole = Math.min(1, Math.max(0, (Math.abs(lat) - 48) / 36));
  const tropic = 1 - Math.min(1, Math.abs(lat) / 38);
  const r = 6 + tropic * 8 + pole * 18 + n * 6;
  const g = 22 + tropic * 18 + pole * 16 + n * 8;
  const b = 20 + tropic * 10 + pole * 22 + n * 8;
  return [r, g, b];
}

function paintMaps(width, height) {
  const mask = document.createElement("canvas");
  mask.width = width;
  mask.height = height;
  const mctx = mask.getContext("2d", { willReadFrequently: true });
  mctx.fillStyle = "#000";
  mctx.fillRect(0, 0, width, height);
  mctx.fillStyle = "#fff";
  LAND.forEach((poly) => drawPoly(mctx, poly, width, height));
  ISLANDS.forEach(([lon, lat, rx, ry]) => {
    drawIsland(mctx, lon, lat, (rx * width) / 1024, (ry * height) / 512, width, height);
  });

  const albedo = document.createElement("canvas");
  albedo.width = width;
  albedo.height = height;
  const actx = albedo.getContext("2d");

  const rough = document.createElement("canvas");
  rough.width = width;
  rough.height = height;
  const rctx = rough.getContext("2d");

  const bump = document.createElement("canvas");
  bump.width = width;
  bump.height = height;
  const bctx = bump.getContext("2d");

  const maskData = mctx.getImageData(0, 0, width, height).data;
  const aImg = actx.createImageData(width, height);
  const rImg = rctx.createImageData(width, height);
  const bImg = bctx.createImageData(width, height);

  for (let y = 0; y < height; y += 1) {
    const lat = 90 - (y / height) * 180;
    for (let x = 0; x < width; x += 1) {
      const lon = (x / width) * 360 - 180;
      const i = (y * width + x) * 4;
      const land = maskData[i] > 40;
      const n = fbm(x * 0.018, y * 0.028);
      const n2 = fbm(x * 0.07 + 20, y * 0.09 + 8);

      let r;
      let g;
      let b;
      let roughness;
      let heightValue;

      if (land) {
        const color = biome(lon, lat, n);
        const grain = (n2 - 0.5) * 18;
        r = Math.min(255, Math.max(0, color[0] + grain));
        g = Math.min(255, Math.max(0, color[1] + grain));
        b = Math.min(255, Math.max(0, color[2] + grain * 0.6));
        roughness = 150 + n * 70;
        heightValue = 92 + n * 90 + n2 * 40;
        if (lat > 72 || lat < -62) {
          roughness = 88;
          heightValue = 70 + n * 30;
        }
        if (
          (lon > 70 && lon < 96 && lat > 26 && lat < 36) ||
          (lon > -80 && lon < -66 && lat > -48 && lat < 10)
        ) {
          heightValue = 170 + n * 80;
          roughness = 175;
        }
      } else {
        const color = oceanColor(lat, n);
        r = color[0];
        g = color[1];
        b = color[2];
        roughness = 18 + n * 22;
        heightValue = 12 + n * 16;
      }

      aImg.data[i] = r;
      aImg.data[i + 1] = g;
      aImg.data[i + 2] = b;
      aImg.data[i + 3] = 255;
      rImg.data[i] = roughness;
      rImg.data[i + 1] = roughness;
      rImg.data[i + 2] = roughness;
      rImg.data[i + 3] = 255;
      bImg.data[i] = heightValue;
      bImg.data[i + 1] = heightValue;
      bImg.data[i + 2] = heightValue;
      bImg.data[i + 3] = 255;
    }
  }

  actx.putImageData(aImg, 0, 0);
  rctx.putImageData(rImg, 0, 0);
  bctx.putImageData(bImg, 0, 0);

  actx.strokeStyle = "rgba(244, 240, 230, 0.055)";
  actx.lineWidth = 1;
  for (let i = 1; i < 12; i += 1) {
    const y = (i / 12) * height;
    actx.beginPath();
    actx.moveTo(0, y);
    actx.lineTo(width, y);
    actx.stroke();
  }
  for (let i = 0; i < 24; i += 1) {
    const x = (i / 24) * width;
    actx.beginPath();
    actx.moveTo(x, 0);
    actx.lineTo(x, height);
    actx.stroke();
  }
  actx.strokeStyle = "rgba(176, 138, 74, 0.38)";
  actx.lineWidth = 1.4;
  actx.beginPath();
  actx.moveTo(0, height / 2);
  actx.lineTo(width, height / 2);
  actx.stroke();

  return { albedo, rough, bump };
}

function paintClouds(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(width, height);

  for (let y = 0; y < height; y += 1) {
    const lat = 90 - (y / height) * 180;
    const band = Math.exp(-((Math.abs(lat) - 8) ** 2) / 220) * 0.55
      + Math.exp(-((Math.abs(lat) - 42) ** 2) / 280) * 0.42
      + Math.exp(-((Math.abs(lat) - 62) ** 2) / 180) * 0.18;
    for (let x = 0; x < width; x += 1) {
      const n = fbm(x * 0.03, y * 0.055);
      const n2 = fbm(x * 0.09 + 40, y * 0.12 + 12);
      const cover = Math.max(0, n * 0.72 + n2 * 0.28 - 0.46) * band * 2.4;
      const a = Math.min(210, cover * 255);
      const i = (y * width + x) * 4;
      img.data[i] = 236;
      img.data[i + 1] = 240;
      img.data[i + 2] = 232;
      img.data[i + 3] = a;
    }
  }

  ctx.putImageData(img, 0, 0);
  return canvas;
}

export function asTexture(image, srgb = false) {
  const texture =
    typeof HTMLCanvasElement !== "undefined" && image instanceof HTMLCanvasElement
      ? new THREE.CanvasTexture(image)
      : new THREE.Texture(image);
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

export function createGlobeMaps(mobile) {
  const width = mobile ? 1024 : 2048;
  const height = mobile ? 512 : 1024;
  const { albedo, rough, bump } = paintMaps(width, height);
  const clouds = paintClouds(mobile ? 512 : 1024, mobile ? 256 : 512);

  return {
    albedo: asTexture(albedo, true),
    roughness: asTexture(rough),
    bump: asTexture(bump),
    clouds: asTexture(clouds, true),
  };
}
