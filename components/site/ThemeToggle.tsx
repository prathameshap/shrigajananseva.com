"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";

const STORAGE_KEY = "sgs_theme";

/**
 * Light/dark toggle.
 *
 * The inline script in the layout has already applied the stored choice before
 * first paint, so this component's only job is to change it. It renders a
 * fixed-size placeholder until mounted: reading `matchMedia` during render
 * would produce different markup on the server and trip a hydration warning,
 * and collapsing to nothing would shift the header on hydration.
 */
export function ThemeToggle({ labels }: { labels: { label: string; light: string; dark: string } }) {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(stored ? stored === "dark" : systemDark);
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // Private browsing. The theme still applies for this page view.
    }
  }

  if (!mounted) return <span className="block h-9 w-9" aria-hidden="true" />;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      title={`${labels.label}: ${dark ? labels.dark : labels.light}`}
      className="grid h-9 w-9 place-items-center rounded-full text-sandal-200 transition-colors hover:bg-night-700 hover:text-marigold-300"
    >
      {dark ? <Icon.Sun className="h-5 w-5" /> : <Icon.Moon className="h-5 w-5" />}
      <span className="sr-only">
        {labels.label}: {dark ? labels.dark : labels.light}
      </span>
    </button>
  );
}
