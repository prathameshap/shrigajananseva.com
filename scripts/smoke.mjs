/**
 * Fetches every page in both locales against a running server and reports the
 * status, the rendered title and the byte size.
 *
 * A green build proves a page compiles. It does not prove the page renders: a
 * server component that reads a field which is null in the content files throws
 * at request time, not at build time. This catches that.
 *
 *   npm start -- -p 3199   (with SITE_PUBLIC=true)
 *   node scripts/smoke.mjs http://localhost:3199
 */
const base = process.argv[2] ?? "http://localhost:3199";

const paths = [
  "/",
  "/about",
  "/about/shri-gajanan-maharaj",
  "/about/trustees",
  "/about/transparency",
  "/visit",
  "/daily-seva",
  "/daily-seva/bhupali-aarti",
  "/daily-seva/nam-jaap",
  "/daily-seva/upasana",
  "/occasions",
  "/occasions?type=utsav",
  "/occasions/monthly-upasana-2026-10",
  "/occasions/pragat-din-2027",
  "/library",
  "/library/texts",
  "/library/audio",
  "/library/videos",
  "/library/newsletters",
  "/library/upasana-booklet",
  "/get-involved",
  "/get-involved/students",
  "/donate",
  "/donate?fund=annadan",
  "/connect",
  "/connect/newsletter",
  "/contact",
  "/legal/privacy",
  "/legal/terms",
  "/legal/accessibility",
  "/legal/privacy-choices",
];

const extras = ["/sitemap.xml", "/robots.txt", "/api/calendar"];

let failures = 0;

async function check(url) {
  try {
    const response = await fetch(url, { redirect: "manual" });
    const body = await response.text();
    const title = body.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] ?? "";
    const ok = response.status === 200;
    if (!ok) failures += 1;

    console.log(
      `${ok ? "  ok" : "FAIL"}  ${String(response.status).padEnd(3)}  ` +
        `${String(Math.round(body.length / 1024)).padStart(3)}kB  ${url.replace(base, "")}` +
        (title ? `  — ${title.slice(0, 60)}` : ""),
    );
  } catch (error) {
    failures += 1;
    console.log(`FAIL  ERR        ${url.replace(base, "")}  — ${error.message}`);
  }
}

for (const locale of ["en", "mr"]) {
  console.log(`\n── /${locale} ${"─".repeat(60)}`);
  for (const path of paths) {
    const [route, query] = path.split("?");
    await check(`${base}/${locale}${route === "/" ? "" : route}${query ? `?${query}` : ""}`);
  }
}

console.log(`\n── other ${"─".repeat(60)}`);
for (const path of extras) await check(`${base}${path}`);

console.log(failures ? `\n${failures} failure(s).` : "\nEvery page rendered.");
process.exit(failures ? 1 : 0);
