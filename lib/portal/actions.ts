"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionCookieName } from "@/lib/portal/session";
import { isEmail } from "@/lib/validate";

/**
 * Server actions for the demonstration session.
 *
 * Both are trivial by design — they exist so the portal's sign-in and sign-out
 * flows are wired end to end and can be swapped for real auth in one file.
 */

export async function signInDemo(formData: FormData) {
  const email = formData.get("email");
  const locale = String(formData.get("locale") ?? "en");

  if (!isEmail(email)) {
    redirect(`/${locale}/portal/sign-in?error=email`);
  }

  const store = await cookies();
  store.set(sessionCookieName, email.trim().toLowerCase(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(`/${locale}/portal`);
}

export async function signOut(formData: FormData) {
  const locale = String(formData.get("locale") ?? "en");
  const store = await cookies();
  store.delete(sessionCookieName);
  redirect(`/${locale}/portal/sign-in`);
}
