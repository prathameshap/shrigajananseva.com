/**
 * Checks the palette's text-on-background pairs against WCAG 2.2.
 *
 * The colours are chosen for how they look, which is exactly why they need
 * measuring: "elegant" and "legible" are not the same constraint, and the one
 * that matters to a devotee reading an aarti time on a phone in daylight is the
 * second one.
 *
 *   node scripts/check-contrast.mjs
 */

/** Relative luminance, WCAG 2.x definition. */
function luminance(hex) {
  const [r, g, b] = hex
    .replace("#", "")
    .match(/../g)
    .map((pair) => {
      const channel = parseInt(pair, 16) / 255;
      return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

const light = {
  canvas: "#fffcf6",
  surface: "#ffffff",
  raised: "#fdf1e0",
  tint: "#eff9f8",
};

const dark = {
  canvas: "#14101f",
  surface: "#1e1830",
  night: "#140f2c",
};

/** [label, foreground, background, minimum] — 4.5 for body text, 3.0 for large. */
const pairs = [
  ["body on canvas", "#3a3036", light.canvas, 4.5],
  ["body on surface", "#3a3036", light.surface, 4.5],
  ["body on raised", "#3a3036", light.raised, 4.5],
  ["body on tint", "#3a3036", light.tint, 4.5],
  ["heading on canvas", "#8a1938", light.canvas, 4.5],
  ["heading on tint", "#8a1938", light.tint, 4.5],
  ["heading on raised", "#8a1938", light.raised, 4.5],
  ["accent on canvas", "#0b737d", light.canvas, 4.5],
  ["accent on surface", "#0b737d", light.surface, 4.5],
  ["accent on tint", "#0c5c66", light.tint, 4.5],
  ["saffron on night", "#dc4d04", dark.night, 3.0],
  ["gold on night", "#f0c98a", dark.night, 4.5],
  ["ivory on night", "#fffcf6", dark.night, 4.5],
  ["body on dark canvas", "#e6e0ee", dark.canvas, 4.5],
  ["gold on dark surface", "#f0c98a", dark.surface, 4.5],
];

let failures = 0;

for (const [label, fg, bg, minimum] of pairs) {
  const value = ratio(fg, bg);
  const pass = value >= minimum;
  if (!pass) failures += 1;
  console.log(
    `${pass ? "  ok" : "FAIL"}  ${value.toFixed(2).padStart(5)}:1  (needs ${minimum.toFixed(1)})  ${label}`,
  );
}

console.log(
  failures ? `\n${failures} pair(s) below the threshold.` : "\nEvery pair meets WCAG 2.2 AA.",
);
process.exit(failures ? 1 : 0);
