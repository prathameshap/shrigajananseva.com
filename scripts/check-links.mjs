/**
 * Cross-checks every internal link the site advertises against the routes the
 * build actually produced.
 *
 * A 404 reachable from the header, the footer or a legacy 301 is invisible in a
 * green build: the build knows about pages that exist, not about links pointing
 * at pages that do not. Run this after `next build`.
 *
 *   node scripts/check-links.mjs
 *
 * Matching is done against the route table rather than the list of prerendered
 * URLs, because a page that reads searchParams is rendered on demand and so
 * never appears in the prerender manifest. That means a path is checked down to
 * its route pattern, not its slug — /library/nonsense counts as reaching
 * /library/[slug]. Slug coverage is a separate question, answered by
 * generateStaticParams.
 */
import { readFileSync } from "node:fs";

const routes = Object.values(
  JSON.parse(readFileSync(".next/app-path-routes-manifest.json", "utf8")),
);

/** /[locale]/library/[slug] -> ^/[^/]+/library/[^/]+$ */
const patterns = routes
  .filter((route) => typeof route === "string" && route.startsWith("/[locale]"))
  .map(
    (route) =>
      new RegExp(`^${route.replace(/\[\[?\.\.\.[^\]]+\]\]?/g, ".+").replace(/\[[^\]]+\]/g, "[^/]+")}$`),
  );

const resolves = (path) => patterns.some((pattern) => pattern.test(`/en${path === "/" ? "" : path}`));

const read = (file) => readFileSync(file, "utf8");

/** Paths declared in lib/nav.ts. */
const navPaths = [...read("lib/nav.ts").matchAll(/href:\s*"([^"]+)"/g)]
  .map((match) => match[1])
  .filter((href) => href.startsWith("/"));

/** Paths declared in app/sitemap.ts. */
const sitemapPaths = [...read("app/sitemap.ts").matchAll(/"(\/[a-z0-9/-]*)"/g)]
  .map((match) => match[1])
  .filter((path) => !path.startsWith("/api"));

/** 301 destinations in next.config.ts — a redirect into a 404 is worse than none. */
const redirectTargets = [...read("next.config.ts").matchAll(/destination:\s*"([^"]+)"/g)]
  .map((match) => match[1].replace(/^\/(en|mr)/, ""))
  .filter((target) => target.startsWith("/"));

/**
 * The portal is defined in lib/nav.ts but not rendered anywhere, because it
 * depends on auth and a database this repository does not contain. Reported, so
 * the gap stays visible, but not failed.
 */
const isPending = (path) => path === "/portal" || path.startsWith("/portal/");

let failures = 0;
let pending = 0;

for (const [source, paths] of [
  ["lib/nav.ts", navPaths],
  ["app/sitemap.ts", sitemapPaths],
  ["next.config.ts redirects", redirectTargets],
]) {
  const unique = [...new Set(paths)].filter((path) => {
    if (!isPending(path)) return true;
    pending += 1;
    return false;
  });
  const missing = unique.filter((path) => !resolves(path));
  failures += missing.length;

  console.log(`${source}: ${unique.length} paths, ${missing.length} unreachable`);
  for (const path of missing) console.log(`  MISSING  ${path}`);
}

if (pending > 0) {
  console.log(`\n${pending} portal path(s) skipped — defined in nav, not rendered, not built yet.`);
}

if (failures > 0) {
  console.error(`\n${failures} link(s) point at a route that does not exist.`);
  process.exit(1);
}
console.log("\nEvery advertised path resolves to a route.");
