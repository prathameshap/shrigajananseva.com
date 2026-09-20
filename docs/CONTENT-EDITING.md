# Editing the website

**For trustees and volunteers.** No programming knowledge needed.

Everything on this site that is *words* or *facts* lives in plain text files you can edit. You do not need to touch any code to change a date, add a trustee, publish the EIN, upload a PDF or fix a typo.

---

## The two kinds of file

| Kind | Where | What it holds | Looks like |
|---|---|---|---|
| **Data files** | `content/data/` | Facts in a list — occasions, funds, library items, opening hours | Lists of `"label": "value"` |
| **Page files** | `content/pages/` | Long writing — the About page, Privacy Policy, Maharaj's life | Ordinary paragraphs |

Data files end in `.json`. Page files end in `.md`.

---

## Rule one: the quote marks matter

In a data file, every piece of text sits between `"` quote marks, and lines end with a comma.

```json
"phone": "(408) 785-1450",
```

You can change what is **inside** the quotes. Do not remove the quotes, the colon, or the comma.

One exception: the very last line before a `}` has **no** comma.

If you are ever unsure, paste the file into <https://jsonlint.com> — it will tell you if a comma is missing.

---

## Rule two: `null` means "not published yet"

Some values say `null` instead of text:

```json
"ein": null,
```

`null` means we have not published this yet. The website notices and shows an honest "not yet published" note instead of a blank space or a broken link.

To publish it, replace `null` with the value **in quotes**:

```json
"ein": "12-3456789",
```

The notice disappears on its own. Nothing else to do.

---

## Rule three: both languages, whenever you can

Text that appears in both languages is written like this:

```json
"title": { "en": "Monthly Upasana", "mr": "मासिक उपासना" }
```

If you do not have the Marathi yet, leave it out entirely:

```json
"title": { "en": "Monthly Upasana" }
```

Marathi readers see the English. Nothing breaks. Add the `"mr"` part whenever you are ready.

---

## The most common jobs

### Change the opening hours

`content/data/site.json`, the `hours` section.

```json
{ "day": 4, "opens": "07:00", "closes": "21:00" }
```

Days are numbered **0 = Sunday** through **6 = Saturday**. So `4` is Thursday. Times are 24-hour: `19:00` is 7pm.

This one change updates the footer, the Visit page, the Contact page, the open/closed badge in the header, and what Google shows in search results.

### Publish the EIN, 990 or determination letter

`content/data/site.json`, the `nonprofit` section. Put PDFs in the `public/documents/` folder first, then point to them:

```json
"ein": "12-3456789",
"determinationLetterUrl": "/documents/501c3-letter.pdf",
```

> This is the highest-value edit on the whole site. Employer matching portals cannot process a donation without the EIN, and several thousand dollars a year is typically left on the table without it.

### Add the WhatsApp links

`content/data/site.json`, the `social` section. Find the entry with `"id": "whatsapp-channel"` and replace `null` with the invite link in quotes. The card appears on the home page and the Connect page immediately.

### Add a Zoom link for daily seva

`content/data/site.json`, the `zoom` section:

```json
"joinUrl": "https://us02web.zoom.us/j/000000000",
```

This switches on the "Join on Zoom" button everywhere, including the **Live now** card that appears automatically on the home page while a seva is in progress.

### Add or change an occasion

`content/data/occasions.json`. Copy an existing entry between its `{` and `}`, paste it, and edit.

The important fields:

- `slug` — the web address. Lowercase, hyphens, no spaces. **Must be unique.**
- `start` / `end` — `2027-02-23T08:00:00-08:00`. That last part is the timezone: `-08:00` in winter, `-07:00` in summer.
- `dateConfirmed` — `false` if the panchang date is not settled. The site then shows "date to be confirmed" and publishes the calendar entry as tentative rather than presenting a guess as fact.
- `capacity` — a number, or `null` for no limit.
- `rsvpOpen` — `true` or `false`. No quote marks around these two words.

### Upload a PDF or audio file

1. Put the file in `public/library/`.
2. In `content/data/library.json`, find the entry and set `fileUrl` to `/library/your-file-name.pdf`.

The "coming soon" label disappears and the download button appears.

### Edit the About page, or any long page

`content/pages/about.en.md`. Just write. Blank line between paragraphs.

- `## Heading` makes a heading
- `**bold**` makes bold
- `- item` makes a bullet
- `> quote` makes a pull quote

Leave the block at the very top (between the two `---` lines) alone except for `title` and `description`.

To add Marathi, copy the file to `about.mr.md` and translate. Until that file exists, Marathi readers see the English version with a small note explaining why.

---

## Currently waiting to be filled in

Everywhere below shows an honest "not published yet" notice on the live site. Each is a one-line edit.

| What | File | Field |
|---|---|---|
| EIN | `content/data/site.json` | `nonprofit.ein` |
| 501(c)(3) determination letter | `content/data/site.json` | `nonprofit.determinationLetterUrl` |
| Annual report | `content/data/site.json` | `nonprofit.annualReportUrl` |
| Form 990 | `content/data/site.json` | `nonprofit.form990Url` |
| WhatsApp community invite | `content/data/site.json` | `social` → `whatsapp-group` → `url` |
| WhatsApp channel invite | `content/data/site.json` | `social` → `whatsapp-channel` → `url` |
| Daily seva Zoom link | `content/data/site.json` | `zoom.joinUrl` |
| Zelle handle | `content/data/giving-methods.json` | `zelle` → `handle` |
| Venmo handle | `content/data/giving-methods.json` | `venmo` → `handle` |
| Payment QR images | `content/data/giving-methods.json` | `qrImage` on each |
| Trustee names and roles | `content/data/people.json` | `trustees` |
| Seva impact figures | `content/data/visit.json` | `impact.stats` → `value` |
| All library PDFs and audio | `content/data/library.json` | `fileUrl` on each |
| Marathi translations | `content/ui/mr.json`, `content/pages/*.mr.md` | anything missing |

---

## Before you publish

Three things worth checking:

1. **Does it still open?** Paste the file into <https://jsonlint.com>. Green means good.
2. **Dates in the right order?** `start` must come before `end`.
3. **Slugs unique?** No two occasions or library items may share a `slug`.

Then save, commit, and push. Vercel rebuilds and publishes within about a minute.

---

## If something goes wrong

Every edit is tracked in version control, so nothing can be permanently broken. Any change can be undone.

If the site fails to rebuild after your edit, it is almost always a missing comma or a missing quote mark. Check the file you just changed, and check JSONLint.

If you are stuck, ask whoever maintains the site — with the file name and what you were trying to change, it is usually a one-minute fix.
