"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { Button, cx } from "@/components/ui";

export type FilterableItem = {
  slug: string;
  type: "text" | "audio" | "video" | "newsletter";
  languages: string[];
};

export type LibraryFilterLabels = {
  filterType: string;
  filterLanguage: string;
  all: string;
  noResults: string;
  clearFilters: string;
  typeLabels: Record<FilterableItem["type"], string>;
};

/**
 * Replaces the old Downloads page, which scattered resources across seven
 * separate pages and showed event photographs instead of downloads.
 *
 * Cards are rendered server-side and hidden rather than unmounted, so the
 * complete library stays in the HTML for search engines and for anyone
 * without JavaScript.
 */
export function LibraryFilters({
  items,
  labels,
  children,
}: {
  items: FilterableItem[];
  labels: LibraryFilterLabels;
  children: React.ReactNode;
}) {
  const [type, setType] = useState<FilterableItem["type"] | "all">("all");
  const [language, setLanguage] = useState<string>("all");

  const visible = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      if (type !== "all" && item.type !== type) continue;
      if (language !== "all" && !item.languages.includes(language)) continue;
      set.add(item.slug);
    }
    return set;
  }, [items, type, language]);

  const dirty = type !== "all" || language !== "all";

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2 rounded-card border border-hairline bg-surface-raised p-4">
        <div className="flex flex-wrap gap-1" role="group" aria-label={labels.filterType}>
          {(["all", "text", "audio", "video", "newsletter"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setType(value)}
              aria-pressed={type === value}
              className={cx(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                type === value
                  ? "bg-kumkum-700 text-sandal-50"
                  : "bg-surface text-muted hover:text-heading",
              )}
            >
              {value === "all" ? labels.all : labels.typeLabels[value]}
            </button>
          ))}
        </div>

        <span className="mx-1 h-6 w-px bg-hairline" aria-hidden="true" />

        <div className="flex gap-1" role="group" aria-label={labels.filterLanguage}>
          {(
            [
              ["all", labels.all],
              ["en", "English"],
              ["mr", "मराठी"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setLanguage(value)}
              aria-pressed={language === value}
              className={cx(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                language === value
                  ? "bg-kumkum-700 text-sandal-50"
                  : "bg-surface text-muted hover:text-heading",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {dirty ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setType("all");
              setLanguage("all");
            }}
          >
            <Icon.Close className="h-4 w-4" />
            {labels.clearFilters}
          </Button>
        ) : null}

        <span className="ml-auto text-sm text-muted" aria-live="polite">
          {visible.size} / {items.length}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <div key={item.slug} hidden={!visible.has(item.slug)}>
            {Array.isArray(children) ? children[index] : children}
          </div>
        ))}
      </div>

      {visible.size === 0 ? (
        <p className="rounded-card border border-dashed border-hairline p-10 text-center text-muted">
          {labels.noResults}
        </p>
      ) : null}
    </div>
  );
}
