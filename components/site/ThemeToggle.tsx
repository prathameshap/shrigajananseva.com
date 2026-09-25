"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { cx } from "@/components/ui";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "sgs_theme";

/**
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
  );
}
