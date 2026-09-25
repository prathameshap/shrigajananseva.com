/**
 * Site-wide password gate for the pre-launch build.
 *
 * HTTP Basic auth, enforced in middleware so it covers every route, every
 * asset and every API handler — there is no path around it.
 *
 * This is a "keep the public out until we launch" gate, not a security
 * boundary for secrets. It is one shared password held by the trustees. Real
 * per-devotee authentication is the portal's job and is a separate concern.
 *
 * Remove it at launch by clearing SITE_PASSWORD and setting
 * SITE_PUBLIC=true — see docs/DEPLOYMENT.md.
 */

/**
 * ASCII only, and no double quotes.
 *
 * Header values are ByteStrings: any code point above 255 throws when the
 * header is set, which surfaces as a 500 with no credential prompt — locking
 * out the very people the password was issued to. An em dash here did exactly
 * that.
 */
const REALM = "Shri Gajanan Seva - pre-launch";

export type GateResult =
  | { allow: true }
  | { allow: false; reason: "unconfigured" | "unauthorized" };

/**
 * Constant-time string comparison.
 *
 * `crypto.timingSafeEqual` is Node-only and middleware runs on the edge
 * runtime, so this is hand-rolled. Length is compared first and therefore
 * leaks, which is an accepted trade for a shared staging password.
 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function parseBasic(header: string | null): { user: string; pass: string } | null {
  if (!header?.startsWith("Basic ")) return null;
  try {
    const decoded = atob(header.slice(6));
    const separator = decoded.indexOf(":");
    if (separator === -1) return null;
    return { user: decoded.slice(0, separator), pass: decoded.slice(separator + 1) };
  } catch {
    return null;
  }
}

export function checkGate(request: Request): GateResult {
  // Explicit opt-out, used at launch.
  if (process.env.SITE_PUBLIC === "true") return { allow: true };

  const password = process.env.SITE_PASSWORD;
  const user = process.env.SITE_USER || "seva";

  if (!password) {
    // Fail closed in production. Forgetting the variable must never silently
    // publish the site — that is the exact outcome the gate exists to prevent.
    // Local development stays open so `npm run dev` needs no setup.
    return process.env.NODE_ENV === "production"
      ? { allow: false, reason: "unconfigured" }
      : { allow: true };
  }

  const credentials = parseBasic(request.headers.get("authorization"));
  if (!credentials) return { allow: false, reason: "unauthorized" };

  const ok = safeEqual(credentials.user, user) && safeEqual(credentials.pass, password);
  return ok ? { allow: true } : { allow: false, reason: "unauthorized" };
}

/** Shown when the visitor dismisses the browser's credential dialog. */
export function gateResponse(reason: "unconfigured" | "unauthorized"): Response {
  const unconfigured = reason === "unconfigured";

  const body = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>${unconfigured ? "Configuration required" : "Shri Gajanan Seva"}</title>
<style>
  :root { color-scheme: light dark; }
  /* Hand-written rather than imported: middleware runs before the stylesheet
     exists. Kept in step with the tokens in app/globals.css. */
  body {
    margin: 0; min-height: 100vh; display: grid; place-items: center;
    background: #fffcf6; color: #3a3036; padding: 2rem;
    font: 17px/1.7 ui-sans-serif, system-ui, sans-serif;
  }
  .card {
    max-width: 30rem; text-align: center;
    border: 1px solid #ecdcc4; border-radius: 1rem;
    background: #fff; padding: 2.5rem 2rem;
    box-shadow: 0 1px 2px rgb(29 22 64 / .04), 0 8px 24px -12px rgb(29 22 64 / .14);
  }
  h1 { font: 600 1.5rem/1.3 Georgia, serif; color: #8a1938; margin: 0 0 .75rem; }
  p { margin: 0 0 1rem; }
  p:last-child { margin-bottom: 0; }
  code { background: #eff9f8; padding: .15rem .4rem; border-radius: .25rem; font-size: .9em; }
  .mark {
    width: 3rem; height: 3rem; margin: 0 auto 1.25rem; border-radius: 50%;
    background: #8a1938; color: #fffcf6; display: grid; place-items: center;
    font: 600 1.25rem/1 Georgia, serif;
  }
  @media (prefers-color-scheme: dark) {
    body { background: #14101f; color: #e6e0ee; }
    .card { background: #1e1830; border-color: #342c4a; }
    h1 { color: #f0c98a; }
    code { background: #241d38; }
  }
</style>
</head>
<body>
  <main class="card">
    <div class="mark" aria-hidden="true">॥</div>
    ${
      unconfigured
        ? `<h1>Configuration required</h1>
    <p>This deployment has no <code>SITE_PASSWORD</code> set, so it is refusing to serve rather than going public by accident.</p>
    <p>Set <code>SITE_PASSWORD</code> in the Vercel project settings and redeploy.</p>`
        : `<h1>Shri Gajanan Seva</h1>
    <p>This site is not open to the public yet.</p>
    <p>If you are reviewing it, reload the page and enter the password you were given.</p>`
    }
  </main>
</body>
</html>`;

  const headers: Record<string, string> = {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store",
    "x-robots-tag": "noindex, nofollow",
  };

  // Only prompt for credentials when they could actually help.
  if (!unconfigured) {
    headers["www-authenticate"] = `Basic realm="${REALM}", charset="UTF-8"`;
  }

  return new Response(body, { status: unconfigured ? 503 : 401, headers });
}
