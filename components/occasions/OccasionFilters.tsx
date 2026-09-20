"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { Button, cx } from "@/components/ui";

export type FilterableOccasion = {
  slug: string;
  type: "utsav" | "upasana" | "seva-drive";
  year: number;
  isPast: boolean;
};

export type FilterLabels = {
  filterByType: string;
  filterByYear: string;
  allTypes: string;
  allYears: string;
  upcoming: string;
  past: string;
  noResults: string;
  clearFilters: string;
  typeLabels: Record<FilterableOccasion["type"], string>;
};

/**
 * Filters the occasion index in place.
 *
 * Children are rendered by the server and hidden with CSS rather than
 * unmounted, so the cards stay in the HTML for search engines and for anyone
 * browsing without JavaScript — who sees the full, unfiltered list.
 */
export function OccasionFilters({
  occasions,
  years,
  labels,
  children,
}: {
  occasions: FilterableOccasion[];
  years: number[];
  labels: FilterLabels;
  children: React.ReactNode;
}) {
  const [type, setType] = useState<FilterableOccasion["type"] | "all">("all");
  const [year, setYear] = useState<number | "all">("all");
  const [when, setWhen] = useState<"upcoming" | "past" | "all">("upcoming");

  const visible = useMemo(() => {
    const set = new Set<string>();
    for (const occasion of occasions) {
      if (type !== "all" && occasion.type !== type) continue;
      if (year !== "all" && occasion.year !== year) continue;
      if (when === "upcoming" && occasion.isPast) continue;
      if (when === "past" && !occasion.isPast) continue;
      set.add(occasion.slug);
    }
    return set;
  }, [occasions, type, year, when]);

  const dirty = type !== "all" || year !== "all" || when !== "upcoming";

  const selectClass =
    "rounded-full border border-hairline bg-surface px-4 py-2 font-medium text-body";

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-3 rounded-card border border-hairline bg-surface-raised p-4">
        <div
          className="flex rounded-full border border-hairline bg-surface p-1"
          role="group"
          aria-label="Time"
        >
          {(
            [
              ["upcoming", labels.upcoming],
              ["past", labels.past],
              ["all", labels.allYears],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setWhen(value)}
              aria-pressed={when === value}
              className={cx(
                "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                when === value
                  ? "bg-kumkum-700 text-sandal-50"
                  : "text-muted hover:text-heading",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2">
          <span className="sr-only">{labels.filterByType}</span>
          <select
            className={selectClass}
            value={type}
            onChange={(event) =>
              setType(event.target.value as FilterableOccasion["type"] | "all")
            }
          >
            <option value="all">{labels.allTypes}</option>
            {(Object.keys(labels.typeLabels) as FilterableOccasion["type"][]).map((key) => (
              <option key={key} value={key}>
                {labels.typeLabels[key]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="sr-only">{labels.filterByYear}</span>
          <select
            className={selectClass}
            value={year}
            onChange={(event) =>
              setYear(event.target.value === "all" ? "all" : Number(event.target.value))
            }
          >
            <option value="all">{labels.allYears}</option>
            {years.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        {dirty ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setType("all");
              setYear("all");
              setWhen("upcoming");
            }}
          >
            <Icon.Close className="h-4 w-4" />
            {labels.clearFilters}
          </Button>
        ) : null}

        <span className="ml-auto text-sm text-muted" aria-live="polite">
          {visible.size} / {occasions.length}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {occasions.map((occasion, index) => (
          <div key={occasion.slug} hidden={!visible.has(occasion.slug)}>
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
