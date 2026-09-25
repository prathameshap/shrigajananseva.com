/**
 * One definition of the site's navigation, consumed by the header, the mobile
 * drawer, the footer and the sitemap. Adding a page here adds it everywhere.
 *
 * `labelKey` and `descriptionKey` are dot-paths into content/ui/<locale>.json.
 */

export type NavItem = {
  href: string;
  labelKey: string;
  children?: NavItem[];
};

export const primaryNav: NavItem[] = [
  {
    href: "/about",
    labelKey: "nav.about",
    children: [
      { href: "/about", labelKey: "navGroups.aboutSgs" },
      { href: "/about/shri-gajanan-maharaj", labelKey: "navGroups.maharaj" },
      { href: "/about/trustees", labelKey: "navGroups.trustees" },
      { href: "/about/transparency", labelKey: "navGroups.transparency" },
    ],
  },
  { href: "/visit", labelKey: "nav.visit" },
  {
    href: "/daily-seva",
    labelKey: "nav.dailySeva",
    children: [
      { href: "/daily-seva", labelKey: "dailySeva.scheduleTitle" },
      { href: "/daily-seva/upasana", labelKey: "navGroups.upasana" },
      { href: "/daily-seva/nam-jaap", labelKey: "navGroups.namJaap" },
    ],
  },
  { href: "/occasions", labelKey: "nav.occasions" },
  {
    href: "/library",
    labelKey: "nav.library",
    children: [
      { href: "/library", labelKey: "library.title" },
      { href: "/library/texts", labelKey: "navGroups.texts" },
      { href: "/library/audio", labelKey: "navGroups.audio" },
      { href: "/library/videos", labelKey: "navGroups.videos" },
      { href: "/library/newsletters", labelKey: "navGroups.newsletterArchive" },
    ],
  },
  {
    href: "/get-involved",
    labelKey: "nav.getInvolved",
    children: [
      { href: "/get-involved", labelKey: "navGroups.volunteer" },
      { href: "/get-involved/students", labelKey: "navGroups.students" },
    ],
  },
  {
    href: "/connect",
    labelKey: "nav.connect",
    children: [
      { href: "/connect", labelKey: "nav.connect" },
      { href: "/connect/newsletter", labelKey: "navGroups.newsletter" },
      { href: "/contact", labelKey: "navGroups.contact" },
    ],
  },
];

export const footerNav: { headingKey: string; items: NavItem[] }[] = [
  {
    headingKey: "footer.explore",
    items: [
      { href: "/about", labelKey: "nav.about" },
      { href: "/about/shri-gajanan-maharaj", labelKey: "navGroups.maharaj" },
      { href: "/visit", labelKey: "nav.visit" },
      { href: "/occasions", labelKey: "nav.occasions" },
    ],
  },
  {
    headingKey: "footer.participate",
    items: [
      { href: "/daily-seva", labelKey: "nav.dailySeva" },
      { href: "/get-involved", labelKey: "navGroups.volunteer" },
      { href: "/get-involved/students", labelKey: "navGroups.students" },
      { href: "/donate", labelKey: "nav.donate" },
    ],
  },
  {
    headingKey: "footer.resources",
    items: [
      { href: "/library/texts", labelKey: "navGroups.texts" },
      { href: "/library/audio", labelKey: "navGroups.audio" },
      { href: "/library/videos", labelKey: "navGroups.videos" },
      { href: "/connect/newsletter", labelKey: "navGroups.newsletter" },
    ],
  },
  {
    headingKey: "footer.legalHeading",
    items: [
      { href: "/legal/privacy", labelKey: "legal.privacy" },
      { href: "/legal/terms", labelKey: "legal.terms" },
      { href: "/legal/accessibility", labelKey: "legal.accessibility" },
      { href: "/legal/privacy-choices", labelKey: "legal.privacyChoices" },
    ],
  },
];

<<<<<<< HEAD
/**
 * The devotee portal's navigation, defined but deliberately not rendered.
 *
 * The portal needs passwordless sign-in, households and a giving history, all of
 * which sit on the Postgres schema and row-level security built in sprints 1 and
 * 2 — none of which exists in this repository, which is the public site. Linking
 * to these paths now would put seven 404s in the header.
 *
 * Wire this into HeaderShell once /portal exists, and delete the exemption in
 * scripts/check-links.mjs at the same time.
 */
=======
>>>>>>> e67c5ca9bc25bf3af85c8980399123cded4b906f
export const portalNav: NavItem[] = [
  { href: "/portal", labelKey: "portal.dashboard" },
  { href: "/portal/household", labelKey: "portal.household" },
  { href: "/portal/rsvps", labelKey: "portal.myRsvps" },
  { href: "/portal/tickets", labelKey: "portal.myTickets" },
  { href: "/portal/giving", labelKey: "portal.giving" },
  { href: "/portal/preferences", labelKey: "portal.preferences" },
  { href: "/portal/privacy", labelKey: "portal.privacy" },
];

/** Resolve a dot-path like `navGroups.texts` against a dictionary. */
export function lookup(dict: unknown, path: string): string {
  const value = path
    .split(".")
    .reduce<unknown>(
      (acc, key) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined),
      dict,
    );
  return typeof value === "string" ? value : path;
}
