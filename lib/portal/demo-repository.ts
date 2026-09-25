/**
 * The demonstration adapter.
 *
 * No database is connected yet, so the portal runs against a single fictional
 * household held in memory. Every screen, state and empty case is real; only
 * the records behind them are invented.
 *
 * Replacing this is the whole job of the next phase: write a Postgres class
 * implementing `PortalRepository`, export it from `lib/portal/index.ts`
 * instead of this one, and nothing else in the app changes.
 */

import type {
  AttendanceRecord,
  ChannelPreference,
  Devotee,
  Donation,
  Household,
  PortalRepository,
  RecurringGift,
  Rsvp,
} from "@/lib/portal/types";

const DEMO_DEVOTEE: Devotee = {
  id: "dev_demo",
  email: "demo@shrigajananseva.org",
  name: "Demo Devotee",
  householdId: "hh_demo",
  preferredLocale: "en",
  createdAt: "2024-03-11T00:00:00Z",
};

const DEMO_HOUSEHOLD: Household = {
  id: "hh_demo",
  name: "Demo household",
  members: [
    {
      id: "hm_1",
      name: "Demo Devotee",
      relation: "Self",
      ageBand: "adult",
      isMinor: false,
    },
    {
      id: "hm_2",
      name: "Household member (spouse)",
      relation: "Spouse",
      ageBand: "adult",
      isMinor: false,
    },
    {
      id: "hm_3",
      name: "Household member (child)",
      relation: "Child",
      ageBand: "teen",
      isMinor: true,
    },
    {
      id: "hm_4",
      name: "Household member (parent)",
      relation: "Parent",
      ageBand: "senior",
      isMinor: false,
    },
  ],
};

const DEMO_RSVPS: Rsvp[] = [
  {
    id: "rsvp_1",
    occasionSlug: "monthly-upasana-october-2026",
    devoteeId: "dev_demo",
    partySize: 3,
    attendeeIds: ["hm_1", "hm_2", "hm_4"],
    dietaryNotes: "One guest needs a chair rather than floor seating.",
    status: "confirmed",
    createdAt: "2026-09-14T18:20:00Z",
    ticketCode: "SGS-UPA-26X4K9",
  },
  {
    id: "rsvp_2",
    occasionSlug: "winter-blanket-distribution-2026",
    devoteeId: "dev_demo",
    partySize: 2,
    attendeeIds: ["hm_1", "hm_3"],
    status: "confirmed",
    createdAt: "2026-09-02T02:10:00Z",
    ticketCode: "SGS-BLK-73PM21",
  },
];

const DEMO_ATTENDANCE: AttendanceRecord[] = [
  { occasionSlug: "rishi-panchami-samadhi-din-2026", attendedOn: "2026-08-17", partySize: 4 },
  { occasionSlug: "school-supplies-drive-2026", attendedOn: "2026-08-15", partySize: 2 },
];

const DEMO_DONATIONS: Donation[] = [
  {
    id: "don_1",
    date: "2026-08-17",
    amount: 251,
    fundSlug: "annadan",
    method: "zelle",
    receiptNumber: "SGS-2026-0418",
    receiptUrl: null,
    recurring: false,
  },
  {
    id: "don_2",
    date: "2026-07-01",
    amount: 51,
    fundSlug: "general",
    method: "zelle",
    receiptNumber: "SGS-2026-0331",
    receiptUrl: null,
    recurring: true,
  },
  {
    id: "don_3",
    date: "2026-06-01",
    amount: 51,
    fundSlug: "general",
    method: "zelle",
    receiptNumber: "SGS-2026-0287",
    receiptUrl: null,
    recurring: true,
  },
  {
    id: "don_4",
    date: "2025-12-14",
    amount: 108,
    fundSlug: "blanket-drive",
    method: "check",
    receiptNumber: "SGS-2025-0912",
    receiptUrl: null,
    recurring: false,
  },
];

const DEMO_RECURRING: RecurringGift[] = [
  {
    id: "rec_1",
    amount: 51,
    fundSlug: "general",
    frequency: "monthly",
    nextChargeOn: "2026-10-01",
    active: true,
  },
];

const DEMO_PREFERENCES: ChannelPreference[] = [
  { channel: "email", purpose: "newsletter", enabled: true },
  { channel: "email", purpose: "occasions", enabled: true },
  { channel: "email", purpose: "giving", enabled: true },
  { channel: "email", purpose: "seva", enabled: false },
  { channel: "whatsapp", purpose: "occasions", enabled: true },
  { channel: "whatsapp", purpose: "seva", enabled: true },
  { channel: "whatsapp", purpose: "newsletter", enabled: false },
  { channel: "sms", purpose: "occasions", enabled: false },
];

export class DemoPortalRepository implements PortalRepository {
  async getDevoteeByEmail(email: string): Promise<Devotee | null> {
    // Any address signs in to the same demo household — the point is to show
    // the screens, not to simulate an account system that does not exist.
    return { ...DEMO_DEVOTEE, email: email.trim().toLowerCase() };
  }

  async getDevotee(id: string): Promise<Devotee | null> {
    return id === DEMO_DEVOTEE.id ? DEMO_DEVOTEE : null;
  }

  async getHousehold(id: string): Promise<Household | null> {
    return id === DEMO_HOUSEHOLD.id ? DEMO_HOUSEHOLD : null;
  }

  async listRsvps(devoteeId: string): Promise<Rsvp[]> {
    return DEMO_RSVPS.filter((rsvp) => rsvp.devoteeId === devoteeId);
  }

  async getRsvp(devoteeId: string, occasionSlug: string): Promise<Rsvp | null> {
    return (
      DEMO_RSVPS.find(
        (rsvp) => rsvp.devoteeId === devoteeId && rsvp.occasionSlug === occasionSlug,
      ) ?? null
    );
  }

  async listAttendance(): Promise<AttendanceRecord[]> {
    return DEMO_ATTENDANCE;
  }

  async listDonations(): Promise<Donation[]> {
    return DEMO_DONATIONS;
  }

  async listRecurringGifts(): Promise<RecurringGift[]> {
    return DEMO_RECURRING;
  }

  async listPreferences(): Promise<ChannelPreference[]> {
    return DEMO_PREFERENCES;
  }
}
