// Genera public/og.png (1200x630) y public/apple-touch-icon.png (180x180).
// Corre en `prebuild` → nunca se desfasa. Reproducible, sin fetch en runtime (tema 07).
import sharp from "sharp";
import { mkdirSync } from "node:fs";

mkdirSync("./public", { recursive: true });

// --- OG 1200x630 ---
const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g" cx="50%" cy="0%" r="90%">
      <stop offset="0%" stop-color="#1a1420"/>
      <stop offset="100%" stop-color="#0d0b14"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <path d="M120 150 L150 150 L150 480 L120 480 Z" fill="#f5a623" opacity="0.15"/>
  <text x="600" y="300" text-anchor="middle" font-family="Georgia, serif" font-size="96" font-weight="800" fill="#f5f3ee">noche<tspan fill="#f5a623">de</tspan>peli</text>
  <text x="600" y="370" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" fill="#9b94a8">¿Qué vas a ver esta noche?</text>
  <text x="600" y="470" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="#f5a623">Reseñas y dónde ver cine legal en Colombia</text>
</svg>`;

await sharp(Buffer.from(og)).png().toFile("./public/og.png");

// --- Apple touch icon 180x180 (iOS no usa SVG) ---
const icon = `
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#0d0b14"/>
  <path d="M13 10.5 L22 16 L13 21.5 Z" fill="#f5a623"/>
</svg>`;

await sharp(Buffer.from(icon)).png().toFile("./public/apple-touch-icon.png");

console.log("✓ og.png + apple-touch-icon.png generados");
