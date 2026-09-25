"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
<<<<<<< HEAD
=======
import { cx } from "@/components/ui";

type Theme = "light" | "dark" | "system";
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f

const STORAGE_KEY = "sgs_theme";

/**
<<<<<<< HEAD
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
=======
 * Light / dark / follow-the-system.
 *
 * The no-flash script in the layout has already applied the stored choice
 * before paint; this control only has to keep itself in sync with it.
 */
export function ThemeToggle({
  label,
  lightLabel,
  darkLabel,
  systemLabel,
}: {
  label: string;
  lightLabel: string;
  darkLabel: string;
  systemLabel: string;
}) {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") setTheme(stored);
    setMounted(true);
  }, []);

  function apply(next: Theme) {
    setTheme(next);
    const root = document.documentElement;
    if (next === "system") {
      root.removeAttribute("data-theme");
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      root.setAttribute("data-theme", next);
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  }

  const options: { value: Theme; label: string; icon: typeof Icon.Sun }[] = [
    { value: "light", label: lightLabel, icon: Icon.Sun },
    { value: "dark", label: darkLabel, icon: Icon.Moon },
    { value: "system", label: systemLabel, icon: Icon.Globe },
  ];

  return (
    <div className="inline-flex items-center gap-0.5" role="group" aria-label={label}>
      {options.map(({ value, label: optionLabel, icon: OptionIcon }) => (
        <button
          key={value}
          type="button"
          onClick={() => apply(value)}
          // Before hydration we cannot know the stored value, so nothing is
          // marked as pressed rather than briefly marking the wrong one.
          aria-pressed={mounted ? theme === value : undefined}
          title={optionLabel}
          className={cx(
            "rounded-full p-1.5 transition-colors",
            mounted && theme === value
              ? "bg-brand-soft text-brand"
              : "text-muted hover:bg-surface-raised hover:text-heading",
          )}
        >
          <OptionIcon className="h-4 w-4" title={optionLabel} />
        </button>
      ))}
    </div>
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
  );
}
