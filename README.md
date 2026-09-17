# Kuantum — revised seminar website

A complete, self-contained static website using the supplied Kuantum logo, colour palette, committee portraits, and seminar programme. The original `kuantum-main` folder is unchanged.

## Preview

Open `index.html` in your browser. No installation, build step, account, or server is required. The current semester is Winter 2026/27, with its programme to be announced. The archives are `ss26.html` (Summer 2026) and `ws25-26.html` (Winter 2025/26).

## Publish on the existing GitHub Pages website

Copy the **contents** of this folder to the folder that currently serves your GitHub Pages website. Keep `index.html`, `ss26.html`, and `ws25-26.html` at that folder's top level, and keep the entire `assets` folder beside them. Do not nest everything inside another `kuantum-revised` directory unless that is the URL you want.

The archive keeps its original filename so existing links continue to work. This package has not been uploaded or published.

## Files

- `index.html`: main page, Winter 2026/27 programme announcement, joining information, committee, contacts, and supplied Impressum.
- `ss26.html`: Summer 2026 archive with all six talks and its semester calendar download.
- `ws25-26.html`: Winter 2025/26 archive.
- `assets/styles.css`: shared responsive layout and all 24 supplied colour tokens.
- `assets/site.js`: accessible navigation, programme search, filters, automatic next-talk display, and calendar export.
- `assets/logo.svg` and `assets/logo-light.svg`: supplied original SVG logos.
- `assets/field.svg`: decorative line background.
- `assets/*.webp`: optimized copies of the supplied committee photographs.

There are no external fonts, runtime styling services, analytics, trackers, or package dependencies. The original newsletter link opens the external signup form. Email links open the visitor's email application.

## Updating the programme

Each talk is an `article` in the HTML; there is no separate database or hidden schedule to maintain. No Winter 2026/27 dates or speakers have been supplied, so the main page currently shows the programme announcement and “Next seminar to be announced.” Search, date filters, and calendar download remain hidden while there are no talks. An empty programme is not treated as a concluded semester.

To publish the first winter talk, copy an existing talk article from `ss26.html` into `#talk-list` in `index.html`, then replace all its date, title, speaker, and location details with the confirmed information. The list is inside the initially hidden `#programme-content` wrapper. When talk articles exist, the script reveals that wrapper and the programme tools and hides `#programme-pending`. For the same result without JavaScript, also remove `hidden` from `#programme-content` and add `hidden` to `#programme-pending` when publishing the first talk; keep the JavaScript-only tools initially hidden.

When adding or changing a talk, update both its visible contents and these attributes on the same article. This example is an archived summer talk, not a proposed winter event:

```html
<article class="talk" id="talk-2026-07-27"
  data-start="2026-07-27T11:30:00+02:00"
  data-end="2026-07-27T13:00:00+02:00"
  data-title="Fermi Liquid Theory and Momentum Distributions of Fermi Gases"
  data-speaker="Sascha Lill (UCPH)"
  data-location="Zoom + SR 2.066">
  <!-- Visible date, title, speaker, and location go here. -->
</article>
```

Use a unique `id` for each talk. Supply the correct Karlsruhe UTC offset for the actual date: `+02:00` during summer time, `+01:00` during standard time. Update the date's visible weekday, month, and year too. Avoid inserting unescaped `&`, `<`, or quotation marks in HTML attributes.

When publishing confirmed dates, replace the pending-programme description with the actual date range and talk count and check the time-zone note. For a new semester, also update the `programme-title`, semester navigation, and page metadata. Navigation currently lists Winter 2026/27 first, followed by the Summer 2026 and Winter 2025/26 archives. The script uses the programme title for the concluded-semester notice and calendar name. It finds the next unended talk automatically; during a talk it shows “Happening now”, and after the final talk it shows “Next seminar to be announced.”

The calendar download is available only when the displayed semester has talks with valid start/end times. It includes all such talks and is a one-time `.ics` export, not a subscription. Times are converted to UTC so calendar applications can display them in each visitor's local time. Search and filters do not limit the exported semester calendar. The Summer 2026 archive retains its calendar; the pending winter programme has no calendar export.

## Content decisions

All six Summer 2026 and seven Winter 2025/26 titles, dates, and speakers are retained in their respective archives. Summer times are treated as Karlsruhe local time; the special 11:45 start on 23 June is preserved. Sascha Lill's UCPH affiliation and SR 2.066 location come from the original featured-talk panel. The July 13 talk remains Zoom-only. The archives do not invent missing times or venues.

The source does not contain a Zoom joining link, future talks, abstracts, or recordings. The joining section therefore directs visitors to the existing seminar email. The secretariat address is kept in the Impressum, separate from seminar locations. The previous “Next upcoming talk” dated July 27 is no longer incorrectly displayed as upcoming.

## Validation

All three pages were checked in Chromium at 320, 390, 580, 768, 1024, and 1440 pixels wide after the Winter 2026/27 update. Checks passed for the pending winter state, all 13 archived talks, three-way semester navigation, local page and anchor links, horizontal overflow, archive search/reset, mobile menu handling, the preserved six-event Summer 2026 calendar, and the no-JavaScript fallback. Desktop and mobile winter screenshots were visually reviewed.

A browser-only sample winter event verified that adding a confirmed talk enables the programme, search, filters, next-talk display, and calendar export, including conversion from Karlsruhe standard time (UTC+1). That sample was never written to the website files. No winter talks have been invented or published.
