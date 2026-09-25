/**
 * The content layer.
 *
 * Everything the site renders that isn't UI chrome comes from JSON files under
 * `content/data/` and Markdown under `content/pages/`. Trustees edit those
 * files; this module gives the rest of the app typed, derived access to them.
 *
 * Nothing here touches a database. When one arrives, these same function
 * signatures can be backed by it without changing a single caller.
 */

import type { LocalizedText } from "@/lib/i18n";

import siteJson from "@/content/data/site.json";
import occasionsJson from "@/content/data/occasions.json";
import libraryJson from "@/content/data/library.json";
import fundsJson from "@/content/data/funds.json";
import dailySevaJson from "@/content/data/daily-seva.json";
import peopleJson from "@/content/data/people.json";
import volunteerJson from "@/content/data/volunteer.json";
import visitJson from "@/content/data/visit.json";
import givingMethodsJson from "@/content/data/giving-methods.json";

/* ------------------------------------------------------------------ types */

export type Site = {
  legalName: string;
  displayName: LocalizedText;
  tagline: LocalizedText;
  url: string;
  nonprofit: {
    status: string;
    state: string;
    ein: string | null;
    determinationLetterUrl: string | null;
    annualReportUrl: string | null;
    form990Url: string | null;
    candidSealUrl: string | null;
  };
  contact: {
    phone: string;
    phoneE164: string;
    email: string;
    charityEmail: string;
    newsletterEmail: string;
    privacyEmail: string;
  };
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
    mapQuery: string;
    latitude: number;
    longitude: number;
  };
  timezone: string;
  hours: { day: number; opens: string; closes: string; note?: LocalizedText }[];
  hoursNote: LocalizedText;
  social: {
    id: string;
    label: string;
    url: string | null;
    handle: string | null;
    description?: LocalizedText;
  }[];
  zoom: {
    joinUrl: string | null;
    meetingId: string | null;
    passcode: string | null;
    note: LocalizedText;
  };
  youtubePlaylistId: string | null;
};

export type OccasionType = "utsav" | "upasana" | "seva-drive";

export type ScheduleItem = { time: string; label: LocalizedText };

export type Occasion = {
  slug: string;
  type: OccasionType;
  title: LocalizedText;
  summary: LocalizedText;
  start: string;
  end: string;
  dateConfirmed: boolean;
  dateNote?: LocalizedText;
  recurrence?: LocalizedText;
  locationName: string;
  capacity: number | null;
  rsvpCount: number;
  rsvpOpen: boolean;
  rsvpOpensOn?: string;
  onlineJoin: boolean;
  fundSlug?: string;
  schedule: ScheduleItem[];
  significance: LocalizedText;
  whatToBring: LocalizedText[];
  volunteerNeeds: (LocalizedText & { slots?: number })[];
};

export type LibraryType = "text" | "audio" | "video" | "newsletter";

export type LibraryItem = {
  slug: string;
  type: LibraryType;
  languages: string[];
  title: LocalizedText;
  description: LocalizedText;
  fileUrl?: string | null;
  externalUrl?: string | null;
  durationMinutes?: number;
  publishedOn?: string;
  featured?: boolean;
};

export type Fund = {
  slug: string;
  active: boolean;
  title: LocalizedText;
  description: LocalizedText;
  suggested: { amount: number; impact: LocalizedText }[];
};

export type SevaMode = "in-person" | "online" | "both";

export type SevaSlot = {
  slug: string;
  time: string;
  durationMinutes: number;
  /** Weekdays this slot runs on, 0 = Sunday … 6 = Saturday. */
  days: number[];
  title: LocalizedText;
  description: LocalizedText;
  mode: SevaMode;
  highlight?: boolean;
};

export type GivingMethod = {
  id: string;
  title: LocalizedText;
  feeNote: LocalizedText;
  handle: string | null;
  handleLabel: LocalizedText;
  qrImage: string | null;
  instructions: LocalizedText;
  recommended?: boolean;
};

/* -------------------------------------------------------------- accessors */

export const site = siteJson as unknown as Site;

export const occasions = (occasionsJson as unknown as Occasion[])
  .slice()
  .sort((a, b) => a.start.localeCompare(b.start));

export const library = libraryJson as unknown as LibraryItem[];

export const funds = (fundsJson as unknown as Fund[]).filter((fund) => fund.active);

export const dailySeva = dailySevaJson as unknown as {
  schedule: SevaSlot[];
  namJaap: { mantra: string; transliteration: string; guidance: LocalizedText };
  sankalp: { title: LocalizedText; description: LocalizedText };
};

export function getSevaSlot(slug: string): SevaSlot | undefined {
  return dailySeva.schedule.find((slot) => slot.slug === slug);
}

export const people = peopleJson as unknown as {
  trustees: {
    name: string;
    role: LocalizedText;
    bio?: LocalizedText;
    photo?: string | null;
  }[];
  governanceNote: LocalizedText;
  sevaTeams: { slug: string; title: LocalizedText; description: LocalizedText }[];
};

export const volunteer = volunteerJson as unknown as {
  intro: LocalizedText;
  opportunities: {
    slug: string;
    title: LocalizedText;
    team: string;
    commitment: LocalizedText;
    description: LocalizedText;
    open: boolean;
    minAge: number;
  }[];
  studentProgramme: {
    title: LocalizedText;
    summary: LocalizedText;
    activities: LocalizedText[];
    requirements: LocalizedText[];
    guardianConsentNote: LocalizedText;
    letterProcess: LocalizedText[];
  };
};

export const visit = visitJson as unknown as {
  firstVisit: {
    intro: LocalizedText;
    steps: { title: LocalizedText; body: LocalizedText }[];
    etiquette: LocalizedText[];
    offering: LocalizedText;
  };
  parking: { summary: LocalizedText; notes: LocalizedText[]; overflowNote: LocalizedText | null };
  accessibility: {
    summary: LocalizedText;
    features: (LocalizedText & { available: boolean })[];
    contactNote: LocalizedText;
  };
  impact: {
    periodLabel: LocalizedText;
    stats: { value: number | null; label: LocalizedText; verified: boolean }[];
  } | null;
  faq: { q: LocalizedText; a: LocalizedText }[];
};

export const givingMethods = givingMethodsJson as unknown as GivingMethod[];

/* ---------------------------------------------------------------- derived */

export function getOccasion(slug: string): Occasion | undefined {
  return occasions.find((occasion) => occasion.slug === slug);
}

export function upcomingOccasions(now: Date = new Date(), limit?: number): Occasion[] {
  const future = occasions.filter((occasion) => new Date(occasion.end) >= now);
  return limit ? future.slice(0, limit) : future;
}

export function pastOccasions(now: Date = new Date()): Occasion[] {
  return occasions.filter((occasion) => new Date(occasion.end) < now).reverse();
}

export function nextOccasion(now: Date = new Date()): Occasion | undefined {
  return upcomingOccasions(now, 1)[0];
}

export function occasionYears(): number[] {
  const years = new Set(occasions.map((occasion) => new Date(occasion.start).getUTCFullYear()));
  return [...years].sort((a, b) => b - a);
}

/**
 * Remaining places, or null when the occasion is uncapped.
 * Never returns a negative — an over-subscribed occasion reads as zero.
 */
export function placesLeft(occasion: Occasion): number | null {
  if (occasion.capacity == null) return null;
  return Math.max(0, occasion.capacity - occasion.rsvpCount);
}

export type CapacityState = "open" | "filling" | "waitlist" | "full" | "uncapped";

export function capacityState(occasion: Occasion): CapacityState {
  const left = placesLeft(occasion);
  if (left == null) return "uncapped";
  if (left === 0) return "full";
  if (occasion.capacity && left / occasion.capacity <= 0.1) return "waitlist";
  if (occasion.capacity && left / occasion.capacity <= 0.3) return "filling";
  return "open";
}

export function getFund(slug: string): Fund | undefined {
  return funds.find((fund) => fund.slug === slug);
}

export function libraryByType(type: LibraryType): LibraryItem[] {
  return library.filter((item) => item.type === type);
}

export function getLibraryItem(slug: string): LibraryItem | undefined {
  return library.find((item) => item.slug === slug);
}

export function featuredLibrary(): LibraryItem[] {
  return library.filter((item) => item.featured);
}

/** Social channels that actually have a URL. Unpublished ones are hidden. */
export function liveSocial() {
  return site.social.filter((channel): channel is typeof channel & { url: string } =>
    Boolean(channel.url),
  );
}
