import en from "@/content/ui/en.json";
import mr from "@/content/ui/mr.json";

export const locales = ["en", "mr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  mr: "मराठी",
};

/** BCP-47 tags, used for `lang`, `hreflang` and date formatting. */
export const localeTags: Record<Locale, string> = {
  en: "en-US",
  mr: "mr-IN",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * A field that may or may not have been translated yet.
 *
 * Marathi translation is happening incrementally, so every localized lookup
 * falls back to English rather than rendering an empty node. Trustees can add
 * `mr` to any record at any time and it appears without a code change.
 */
export type LocalizedText = { en: string; mr?: string };

export function t(value: LocalizedText | string | undefined, locale: Locale): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[locale] ?? value.en;
}

/** True when this record still needs a Marathi translation. Drives the editor report. */
export function needsTranslation(value: LocalizedText | string | undefined): boolean {
  return typeof value === "object" && value !== null && !value.mr;
}

type Dictionary = typeof en;

type Nested = { [key: string]: string | Nested };

/**
 * Overlay a partial translation onto English, one key at a time.
 *
 * Marathi is being filled in gradually, so `mr.json` only carries the keys
 * that have actually been translated. A shallow spread would drop every
 * untranslated sibling in a group, so the merge has to recurse.
 */
function deepMerge(base: Nested, overlay: Nested): Nested {
  const out: Nested = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    const current = out[key];
    if (value && typeof value === "object" && current && typeof current === "object") {
      out[key] = deepMerge(current, value);
    } else if (typeof value === "string" && value.length > 0) {
      out[key] = value;
    }
  }
  return out;
}

const dictionaries: Record<Locale, Dictionary> = {
  en,
  mr: deepMerge(en as unknown as Nested, mr as unknown as Nested) as unknown as Dictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

/** Prefix an app-relative path with the active locale. */
export function localePath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}
