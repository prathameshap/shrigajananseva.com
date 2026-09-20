# shrigajananseva.org

Rebuild of the Shri Gajanan Seva website — a 501(c)(3) non-profit in San Jose, California.

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · deployed on Vercel.

Feature specification: [`docs/FEATURES-WEBSITE.md`](docs/FEATURES-WEBSITE.md)
Editing guide for trustees: [`docs/CONTENT-EDITING.md`](docs/CONTENT-EDITING.md)

---

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

No environment variables are required. With none set, the site builds and runs
completely — the forms degrade to pre-filled `mailto:` links rather than
claiming to have sent something. See [`.env.example`](.env.example).

---

## How it is laid out

```
app/
  [locale]/            every public page, under /en or /mr
    portal/            devotee portal (per-devotee, noindex, never cached)
  api/                 contact · newsletter · privacy-request · calendar (.ics)
  sitemap.ts robots.ts
components/
  ui.tsx               design-system primitives (server components)
  icons.tsx            hand-rolled icon set, ~4 KB, no icon font
  site/ shared/ forms/ home/ portal/ occasions/ library/ donate/
content/
  data/*.json          structured content — trustees edit these
  pages/*.<locale>.md  long-form prose — trustees edit these
  ui/<locale>.json     interface strings
lib/
  content.ts           typed accessors + derived helpers over content/data
  i18n.ts              locales, dictionary merge, EN fallback
  datetime.ts          timezone maths via Intl, no date library
  schedule.ts          "what is happening right now"
  ics.ts seo.tsx nav.ts route.ts mailer.ts validate.ts pages.ts
  portal/              repository interface + demo adapter + session
middleware.ts          locale detection and redirect
next.config.ts         301 map from the legacy WordPress URLs
```

### Principles worth preserving

**Content is not code.** Anything a trustee might want to change lives in
`content/`, never in a component. Adding a fund, an occasion or a library item
requires no code change.

**Unpublished content degrades honestly.** A `null` renders an explicit
"not published yet" notice naming the file and field to fill in — never a blank
space, never a broken link, never invented placeholder data.

**Marathi falls back to English, per key.** `content/ui/mr.json` is merged over
English one key at a time, so it can be filled in gradually. A missing
`*.mr.md` page shows the English with a note explaining why.

**Times are rendered in the reader's timezone.** The mandir publishes in
`America/Los_Angeles`; devotees read from Pune, London and Fremont. Anything
time-sensitive is a client component so it shows the reader's own clock.

**No cookies means no consent banner.** Analytics are cookieless, the map is
OpenStreetMap rather than Google, and YouTube is linked rather than embedded.
Adding Google Analytics or a YouTube iframe would make a consent banner legally
necessary and undo this.

---

## Deploying

Vercel, connected to this repository. `npm run build`, no adapter needed —
middleware, API routes and `next/font` all run natively.

Before pointing DNS at it:

1. Set `url` in `content/data/site.json` to the production origin.
2. Confirm the 301s resolve — the legacy URLs in `next.config.ts` are what
   currently rank for "Gajanan Maharaj Bay Area" and similar queries.
3. Enable Analytics and Speed Insights in the Vercel dashboard.
4. Submit `/sitemap.xml` in Google Search Console.

---

## What is deliberately not built

Scoped out with the client, not overlooked:

| Area | State | To turn on |
|---|---|---|
| **Card / ACH donations** | No processor chosen. `/donate/online` is an honest interim page. | The builder already passes `fund`, `amount`, `frequency`, `coverFees`. Add a checkout route and replace the notice with a redirect. |
| **Devotee portal data** | Runs against an in-memory demo household. Every screen and state is real; the records are fictional. | Implement `PortalRepository` (`lib/portal/types.ts`) against Postgres, swap one export in `lib/portal/session.ts`. |
| **Authentication** | Demo cookie. Gates nothing, because nothing real sits behind it. | Replace `lib/portal/actions.ts` with real passwordless auth + Google sign-in. |
| **Writes** | RSVP, household and preference forms render fully but submit is disabled. | Add write methods to the repository plus server actions. |
| **Admin console** | Not started — spec §3, a later phase. | |

`/en/portal/about-this-demo` states all of this on the site itself, so trustees
reviewing the portal can see where the line falls without asking.

### Known issue

`npm audit` reports a build-time advisory against `postcss@8.4.31`, pinned
inside Next 15. Our direct dependency is on a patched 8.5.x. It affects the
build toolchain only, not the deployed site, and clears on the upgrade to Next
16 — which is a breaking change and deliberately not bundled into this work.
