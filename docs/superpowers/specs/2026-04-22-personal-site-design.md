# Personal Site — Design Spec

**Date:** 2026-04-22  
**Stack:** Next.js 14 App Router · TypeScript · Tailwind CSS · shadcn/ui · next-mdx-remote · Vercel

---

## Purpose & Audience

A personal site for Timothy Hall, software engineer and musician. Serves two professional audiences simultaneously:

- **Software employers** — professional history, projects, engineering credibility
- **Music gig bookers (Boston area)** — performance videos, instruments, booking contact

The site's identity is the generalist thread: the same "play everything, build everything" philosophy applies to both sides.

---

## Visual Design

**Style:** Dark & Sharp  
**Background:** Near-black (`#0f0f0f`)  
**Accent:** Electric lime (`#c8ff00`) — used for labels, CTAs, highlights  
**Typography:** Clean sans-serif, tight tracking on labels, light weight on headings  
**No scroll animations, no parallax.** Fast and intentional.

**Design tokens** — centralized in `tailwind.config.ts`. All colors, font families, and spacing extensions defined there as the single source of truth. shadcn/ui components wired to the same token set so the theme propagates automatically.

**Component library:** shadcn/ui — accessible primitives (Button, Card, Dialog for the lightbox, etc.) installed à la carte. Not a full dependency — generated components live in `/components/ui/` and are owned by the project.

---

## Navigation

Top bar: initials/name (left) · `About · Projects · Music` (right) + LinkedIn icon  
Mobile: simple slide-down menu, no hamburger complexity

---

## Pages

### Homepage (`/`)

**Hero section (full viewport):**
- Name: Timothy Hall
- Role label: `SOFTWARE ENGINEER · MUSICIAN`
- 2-sentence bio establishing both identities
- Two CTAs: `View Projects` and `Watch Music`

**Preview cards (below the fold):**
Three cards in a row linking to each main section:
- Latest featured project (from Projects)
- Latest YouTube video (most recently active playlist)
- Latest repo/experiment (from Projects)

Cards use real content pulled at build time — not placeholder.

---

### About (`/about`)

**Employment timeline** — company, role, date range, key technologies. Scannable, not exhaustive. LinkedIn badge/link for full résumé. Known current role: Senior Software Engineer at Bellese Technologies (Boston area).

**Notable achievements** — Fulbright U.S. Student Program Alternate (Romania — Doina music transcription, classical guitar composition and performance), Yamaha Artist in-Residence Fellow (founded a community ensemble). These surface on the About page, not buried.

**Short bio** — prose version of professional identity. Mentions the music side briefly; the Music page handles it fully.

No project gallery here — all projects live on the Projects page.

---

### Projects (`/projects`)

All personal builds in one place — professional, personal, experimental, in-progress.

**Filter tabs:** `All · Embedded · Deployed · Repos`

**Three card types:**

| Type | Description |
|---|---|
| `embedded` | Interactive demo renders inline on the page. "Launch" expands it in an overlay. React component lives in `/components/demos/<name>.tsx`, imported via MDX. |
| `deployed` | Separate deployment (Vercel, Railway, etc.). Card shows title, description, tech tags, GitHub link, external live link. Optional thumbnail/GIF. |
| `repo` | GitHub-only project (CLI tool, backend experiment, CS exploration). Card shows title, description, tech tags, GitHub link. |

**Featured flag:** Projects with `featured: true` in frontmatter appear as preview cards on the homepage. Typically 1–3 projects.

**Empty state:** Until projects are added, the page shows a clean intentional placeholder — not a blank grid.

**No detail pages initially.** Extended descriptions render as expandable content within the card. Detail pages can be added later for projects that warrant it.

**Content model** — one MDX file per project in `/content/projects/`:

```yaml
---
title: Chord Visualizer
type: embedded          # embedded | deployed | repo
description: Interactive fretboard tool
tech: [React, Tone.js]
repo: https://github.com/timothyryanhall/chord-visualizer
url: https://chord-viz.vercel.app   # deployed type only
featured: true
---
```

For `embedded` projects, the MDX body exports or imports the demo component. For others, the body is an optional longer description.

---

### Music (`/music`)

Serves both casual visitors and gig bookers.

**Musician bio** (top of page) — 3–4 sentences. Lead with versatility: classical foundation (B.M. + M.M. in classical guitar performance, University of South Carolina), Yamaha Artist in-Residence Fellow, Fulbright alternate for a project composing and performing in Romania. Plays folk, jazz, blues, funk, country, bluegrass. Currently: keys in a funk band, B3 organ in a country band. Sings. Classical training is the foundation that enables the breadth — not the main identity.

**Playlist tabs** — horizontally scrollable tab row. One tab per public YouTube playlist, auto-discovered at build time from the YouTube Data API. Sorted by most recently active (most recent video upload to that playlist floats to the top). Playlist names come directly from YouTube — no manual labeling needed.

**Video grid** — 3 columns desktop / 2 tablet / 1 mobile. Each card: YouTube thumbnail + video title. Clicking opens an inline lightbox (video plays on-page, no redirect to YouTube). "See all on YouTube →" link at the bottom for visitors who want the full channel.

**Booking / Contact** (bottom of page):
- Instruments: Classical guitar, voice, piano/Nord Stage 4, B3 organ
- Styles: Folk, jazz, classical, country, bluegrass, funk
- Contact link (email) for gig inquiries

**Content model** — no files. Two environment variables:
```
YOUTUBE_CHANNEL_ID=<channel_id>
YOUTUBE_API_KEY=<api_key>
```
Build process: fetch all public playlists → for each playlist fetch most recent video date → sort playlists → fetch video lists → static generation. Zero manual maintenance; adding a playlist on YouTube and redeploying is all that's needed.

---

## Content Architecture

```
/app
  /page.tsx                  ← homepage
  /about/page.tsx
  /projects/page.tsx
  /music/page.tsx
/content
  /projects/                 ← one MDX file per project
  work.ts                    ← employment history (typed TS object)
/components
  /ui/                       ← Nav, Card, Button, Lightbox, etc.
  /demos/                    ← embedded demo React components
/lib
  /youtube.ts                ← API fetch + sort logic
  /projects.ts               ← MDX parsing helpers
```

---

## Deployment & Hosting

**Personal site:** Vercel Hobby (free). Connected to GitHub repo; deploys on push to main.

**Side projects:** Each lives in its own GitHub repo, deployed independently to whatever platform fits (Vercel for frontend/fullstack JS, Railway or Render for backend-heavy projects). The personal site stores only the URL — it doesn't care how each project is deployed.

**No database required** for the personal site. Content is statically generated. Contact/booking inquiries use a mailto link or a form service (Resend/Formspree) — no backend needed.

---

## Out of Scope (for now)

- Blog / writing section
- Authentication or user accounts
- CMS or admin UI
- Analytics (can add Vercel Analytics later, one line)
- Dark/light mode toggle
- i18n
