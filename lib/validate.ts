/** Small hand-rolled validators — a schema library would outweigh the rules. */

export function isEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

/**
 * Two invisible spam checks.
 *
 * `company` is a honeypot — hidden from people, filled in by most bots.
 * `elapsedMs` catches scripted posts that submit faster than a person can
 * physically type, without penalising someone who reads slowly.
 */
export function looksLikeSpam(payload: { company?: unknown; elapsedMs?: unknown }): boolean {
  if (typeof payload.company === "string" && payload.company.trim().length > 0) return true;
  if (typeof payload.elapsedMs === "number" && payload.elapsedMs < 1500) return true;
  return false;
}
