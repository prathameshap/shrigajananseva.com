# Website Feature List
**shrigajananseva.org — rebuilt** · Version 1.0 · 2026-09-19

Legend — **Phase:** M = MVP · 2 / 3 / 4 = later phase · **Auth:** Public / Devotee / Staff role

---

## 1. Public website

### 1.1 Home
| Feature | Phase | Auth | Notes |
|---|---|---|---|
| Hero with current/next occasion | M | Public | Auto-selects the nearest upcoming occurrence |
| "Live now" seva card | M | Public | Appears during Zoom broadcast windows; local timezone; one-tap join |
| Today's schedule strip | M | Public | Day-aware (Thursday vs. weekend schedule) |
| Upcoming occasions (3) with RSVP CTA | M | Public | |
| Donate CTA with fund shortcuts | M | Public | |
| Seva impact strip | 3 | Public | Meals served, blankets distributed, volunteer hours |
| Connect strip: WhatsApp, Channel, YouTube, Instagram, Facebook | M | Public | **New — currently absent from the site** |
| Newsletter signup inline | M | Public | Double opt-in |
| Language toggle EN / मराठी | M | Public | Persists per device and account |

### 1.2 About & transparency
| Feature | Phase | Auth | Notes |
|---|---|---|---|
| Mission and seva philosophy | M | Public | |
| Shri Gajanan Maharaj, Shegaon | M | Public | Migrated from existing site |
| Trustees & governance | M | Public | **New** |
| Transparency page: EIN, 501(c)(3) determination letter, annual report, Form 990 | M | Public | **New — highest-value, zero-build item** |
| Candid/GuideStar transparency seal | 3 | Public | Prerequisite for some employer-matching portals |

### 1.3 Visit
| Feature | Phase | Auth | Notes |
|---|---|---|---|
| Hours, address, embedded map, directions | M | Public | Map is **new** |
| Weekly seva schedule (Thu / Sat / Sun) | M | Public | |
| First-time visitor guide | M | Public | **New** — what to expect, etiquette, parking, what to bring |
| Parking and accessibility information | M | Public | **New** |

### 1.4 Daily Seva
| Feature | Phase | Auth | Notes |
|---|---|---|---|
| Daily schedule in viewer's timezone | M | Public | Bhupali Aarti, Shrungar Seva, aartis, Shejarati |
| Zoom join for daily Ram Raksha / Maruti Stotra & nam jaap | M | Public | **New on site** — currently invisible to newcomers |
| Upasana instructions | M | Public | Migrated |
| Nam jaap (Gan Gan Ganat Bote) guidance | M | Public | |
| Community jap counter (aggregate) | 3 | Public | Live total toward an active sankalp |

### 1.5 Occasions
| Feature | Phase | Auth | Notes |
|---|---|---|---|
| Occasions index, filterable by type and year | M | Public | |
| Dedicated section per occasion type | M | Public | Prakat Din, Guru Pournima, Rishi Panchami, Monthly Upasana, seva drives |
| Occasion detail: schedule, significance, what to bring, volunteer needs | M | Public | |
| Add to calendar (`.ics`) + subscribable feed | M | Public | |
| RSVP CTA (routes to login) | M | Public→Devotee | |
| Capacity / waitlist status indicator | M | Public | |
| Past-occasion archive | 3 | Public | Preserves the 2017–2023 Pragat Din material currently orphaned on the Downloads page |
| Photo gallery per occasion | 3 | Public | Consent-aware publishing |

### 1.6 Library (replaces "Downloads")
| Feature | Phase | Auth | Notes |
|---|---|---|---|
| Unified library with type/language filters | M | Public | Fixes the current fragmented, partially broken Downloads page |
| Texts: Upasana Booklet, Shri Gajanan Stotra, Shriram Vandana, Pradakshina & Prasad, Gajanan Vijay Grantha, Shejarati | M | Public | PDF + readable HTML |
| Audio: Gan Gan Ganat Bote 24hr / 12hr / 108, aarti | 2 | Public | In-page player; downloadable |
| Newsletter archive | M | Public | |
| YouTube gallery | M | Public | Playlist embed, replaces the static gallery page |
| Search within library | 3 | Public | |

### 1.7 Get Involved
| Feature | Phase | Auth | Notes |
|---|---|---|---|
| Volunteer programme overview | M | Public | |
| Open opportunities list (view) | 2 | Public | Signup requires login |
| Student service-hours programme page | M | Public | Requirements, guardian consent explanation, how letters are issued |
| Seva team descriptions | 2 | Public | |

### 1.8 Donate
| Feature | Phase | Auth | Notes |
|---|---|---|---|
| Online card / ACH donation (Stripe Checkout) | M | Public | **New — the single largest functional gap today** |
| Guest donation, no account required | M | Public | |
| Fund selection: general, annadan, food drive, blanket, school supplies, toy drive, utsav | M | Public | |
| Recurring giving (monthly / quarterly / annual) | M | Public | **New** |
| Suggested amounts with impact framing | M | Public | "$51 provides meals for 20" |
| Donor-covers-fee toggle | M | Public | Typically recovers 60–75% of processing cost |
| Zelle / Venmo / check / QR instructions | M | Public | Retained — zero-fee channels remain the cheapest path for large gifts |
| Employer matching guidance | M | Public | **New** — EIN, legal name, address, Benevity/YourCause links |
| "Where your donation goes" fund breakdown | 3 | Public | |
| Campaign page with goal thermometer | 3 | Public | |

### 1.9 Connect
| Feature | Phase | Auth | Notes |
|---|---|---|---|
| WhatsApp community group invite | M | Public | **New on site** |
| WhatsApp Channel subscribe (announcements) | M | Public | **New** — free one-way broadcast |
| Social links (YouTube, Facebook, Instagram) | M | Public | |
| Newsletter signup with consent capture | M | Public | Replaces "email us to subscribe" |
| Contact form with spam protection | M | Public | The current contact page has **no form** |

### 1.10 Site-wide
| Feature | Phase | Auth | Notes |
|---|---|---|---|
| Full EN / MR localization | M | Public | |
| WCAG 2.2 AA conformance | M | Public | |
| Mobile-first responsive layout | M | Public | |
| Elder-friendly typography (16px+ base, high contrast, scalable to 200%) | M | Public | |
| SEO: structured data for Organization, Event, LocalBusiness | M | Public | Event schema surfaces utsav dates in Google |
| Open Graph / share cards | M | Public | |
| Cookieless analytics | M | Public | Removes the need for a cookie consent banner |
| Sitemap, robots, canonical URLs, 301 map from old URLs | M | Public | Preserves existing search equity |
| Privacy Policy (CCPA/CPRA-compliant rewrite) | M | Public | |
| Terms of Use | M | Public | **New** |
| Accessibility Statement | M | Public | **New** |
| "Your Privacy Choices" + rights request form | M | Public | **New — required** |
| App download banners (iOS / Android) | 2 | Public | |

## 2. Devotee portal (login-gated)

| Feature | Phase | Auth | Notes |
|---|---|---|---|
| Passwordless sign-in (magic link / OTP) | M | Devotee | |
| Google sign-in | M | Devotee | |
| Household profile: members, relations, age bands | M | Devotee | Underpins family attendance counts |
| Contact & language preferences | M | Devotee | |
| **RSVP for an occasion** (party size, named attendees, dietary notes) | M | Devotee | |
| My tickets — QR on screen + PDF download | M | Devotee | |
| RSVP edit / cancel | M | Devotee | |
| My attendance history | M | Devotee | |
| Giving history and receipt downloads | M | Devotee | |
| Annual consolidated tax statement | M | Devotee | |
| Manage recurring donations | M | Devotee | |
| Volunteer opportunity browse & signup | 2 | Devotee | |
| My shifts and reminders | 2 | Devotee | |
| My verified volunteer hours | 2 | Devotee | |
| Download service-hours letter | 2 | Devotee | With public verification code |
| Guardian view for a linked minor | 2 | Guardian | Consent, shifts, hours |
| Nam jaap log and streak | 2 | Devotee | Syncs with the app |
| Communication preference centre (per channel, per purpose) | M | Devotee | |
| Privacy: view my data, export, delete request | M | Devotee | |

## 3. Admin console

| Feature | Phase | Role |
|---|---|---|
| Role-aware navigation and dashboard | M | All staff |
| Devotee & household search, view, edit | M | admin_staff, trustee (RO) |
| Duplicate detection and household merge | 2 | admin_staff |
| Event and occurrence management (bilingual, scheduled publish) | M | event_coordinator, content_editor |
| Capacity, waitlist, and RSVP list management | M | event_coordinator |
| Live event dashboard: expected / checked-in / walk-in / no-show | M | event_coordinator |
| Post-event attendance report and export | M | event_coordinator, trustee |
| Scoped scanner-role grants for gate volunteers | M | admin_staff, event_coordinator |
| Donation ledger: view, filter, export | M | treasurer, trustee (RO) |
| Manual gift entry (Zelle / Venmo / check / cash / in-kind) with fuzzy household match | M | treasurer |
| Receipt issue and reissue | M | treasurer |
| Fund-wise financial reporting | M | treasurer, trustee (RO) |
| Refund / chargeback handling | 2 | treasurer |
| Volunteer opportunity, shift, and roster management | 2 | volunteer_lead, event_coordinator |
| Hours verification and service-letter issuance | 2 | volunteer_lead, admin_staff |
| Inventory: assets, locations, movements, audits, labels | 3 | inventory_manager |
| Asset value and donor-attribution reports | 3 | inventory_manager, trustee (RO) |
| Segment builder and multi-channel campaign send | 3 | admin_staff, content_editor |
| Delivery logs per recipient | 3 | admin_staff |
| Document repository (replaces Google Drive) | 3 | admin_staff |
| Privacy rights-request queue with SLA timers | M | admin_staff |
| Audit log viewer | M | super_admin, trustee (RO) |
| Historical data import (Google Forms / Sheets) with mapping and dedupe | M | super_admin |
| Trustee dashboard: attendance, giving, volunteer, growth trends | 4 | trustee |
| Scheduled report delivery | 4 | trustee, treasurer |

## 4. Explicitly removed from the current site

| Current page | Action | Reason |
|---|---|---|
| `/wp-booking-calendar-full-day/` | Remove | WP Booking Calendar is live but unconfigured — renders "No Services match your search" |
| `/wp-booking-calendar-time-slots/` | Remove | Same |
| `/wp-booking-calendar-time-appointments/` | Remove | Same |
| `/wp-booking-calendar-contact/` | Remove | Same |
| `/wpbc-appointment-booking/` | Remove | Only a placeholder "30-minute consultation" service exists |
| `/downloads/` in current form | Restructure | Page shows 2017–2023 event images, not downloads; actual resources are scattered across separate pages |
| Newsletter "email us to subscribe" | Replace | No consent record, no unsubscribe mechanism, manual list management |

If appointment booking is genuinely needed (e.g. Shrungar Seva slots), it returns in Phase 3 as a proper feature integrated with households and notifications — not as four orphaned plugin pages.

## 5. URL migration map

| Old | New | Redirect |
|---|---|---|
| `/about-shri-gajanan-seva/` | `/about` | 301 |
| `/maharaj/` | `/about/shri-gajanan-maharaj` | 301 |
| `/contact/` | `/contact` | — |
| `/qr-codes/` | `/donate` | 301 |
| `/daily-upasana/`, `/bhupali-aarti/`, `/daily-upasana-instructions/`, `/shejarati/` | `/daily-seva/*` | 301 |
| `/downloads/`, `/upasana/`, `/shri-gajanan-stotra/`, `/shriram-vandana/`, `/pradakshina/`, `/gajanan-vijay-grantha/` | `/library/*` | 301 |
| `/gan-gan-ganat-botey-24-hr-jap/`, `/12-hour-jap/`, `/gan-gan-ganat-botey/` | `/library/audio/*` | 301 |
| `/newsletter/` | `/connect/newsletter` | 301 |
| `/youtube-gallery/` | `/library/videos` | 301 |
| `/privacy-policy/` | `/legal/privacy` | 301 |
| `/wp-booking-calendar-*`, `/wpbc-appointment-booking/` | `/contact` | 301 |

All 301s must be in place at cutover. Losing existing search rankings for "Gajanan Maharaj Bay Area" and similar queries would be a self-inflicted wound.
