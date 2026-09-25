/**
 * Domain types for the devotee portal.
 *
 * Defined independently of any storage so that the repository behind them can
 * be swapped from the current in-memory demo to Postgres without a single
 * component changing.
 */

export type AgeBand = "child" | "teen" | "adult" | "senior";

export type HouseholdMember = {
  id: string;
  name: string;
  relation: string;
  ageBand: AgeBand;
  /** Drives the guardian-consent flow for the student volunteer programme. */
  isMinor: boolean;
};

export type Household = {
  id: string;
  name: string;
  members: HouseholdMember[];
};

export type Devotee = {
  id: string;
  email: string;
  name: string;
  householdId: string;
  preferredLocale: "en" | "mr";
  createdAt: string;
};

export type Rsvp = {
  id: string;
  occasionSlug: string;
  devoteeId: string;
  partySize: number;
  attendeeIds: string[];
  dietaryNotes?: string;
  status: "confirmed" | "waitlisted" | "cancelled";
  createdAt: string;
  /** Opaque code shown as a QR at the gate. */
  ticketCode: string;
};

export type AttendanceRecord = {
  occasionSlug: string;
  attendedOn: string;
  partySize: number;
};

export type Donation = {
  id: string;
  date: string;
  amount: number;
  fundSlug: string;
  method: "zelle" | "check" | "venmo" | "card" | "cash" | "in-kind";
  receiptNumber: string;
  receiptUrl?: string | null;
  recurring: boolean;
};

export type RecurringGift = {
  id: string;
  amount: number;
  fundSlug: string;
  frequency: "monthly" | "quarterly" | "annual";
  nextChargeOn: string;
  active: boolean;
};

export type ChannelPreference = {
  channel: "email" | "whatsapp" | "sms";
  purpose: "newsletter" | "occasions" | "seva" | "giving";
  enabled: boolean;
};

/**
 * Everything the portal needs, expressed as intent rather than as queries.
 *
 * A Postgres implementation satisfies this same interface; so does the demo
 * adapter currently in use. Callers cannot tell the difference.
 */
export interface PortalRepository {
  getDevoteeByEmail(email: string): Promise<Devotee | null>;
  getDevotee(id: string): Promise<Devotee | null>;
  getHousehold(id: string): Promise<Household | null>;
  listRsvps(devoteeId: string): Promise<Rsvp[]>;
  getRsvp(devoteeId: string, occasionSlug: string): Promise<Rsvp | null>;
  listAttendance(devoteeId: string): Promise<AttendanceRecord[]>;
  listDonations(devoteeId: string): Promise<Donation[]>;
  listRecurringGifts(devoteeId: string): Promise<RecurringGift[]>;
  listPreferences(devoteeId: string): Promise<ChannelPreference[]>;
}
