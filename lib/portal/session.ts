import { cookies } from "next/headers";
import { DemoPortalRepository } from "@/lib/portal/demo-repository";
import type { Devotee, PortalRepository } from "@/lib/portal/types";

/**
 * The single place the rest of the app asks for portal data.
 *
 * Swap the constructor here for a Postgres-backed implementation and every
 * portal screen keeps working untouched.
 */
export const portal: PortalRepository = new DemoPortalRepository();

const SESSION_COOKIE = "sgs_demo_session";

/**
 * Demonstration sign-in.
 *
 * Real passwordless auth needs a mail provider and a session store, neither of
 * which is configured. Rather than stub out a fake magic link that silently
 * never arrives, the sign-in page is explicit that this is a demonstration and
 * sets a plain cookie holding the email that was entered.
 *
 * This is deliberately NOT a security boundary. It gates nothing real, because
 * there is nothing real behind it yet — every record it can reach is the same
 * fictional household. Replacing it is step one of the portal phase.
 */
export async function getSession(): Promise<Devotee | null> {
  const store = await cookies();
  const email = store.get(SESSION_COOKIE)?.value;
  if (!email) return null;
  return portal.getDevoteeByEmail(email);
}

export async function isSignedIn(): Promise<boolean> {
  return (await getSession()) !== null;
}

export const sessionCookieName = SESSION_COOKIE;
