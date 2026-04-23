# Professional Site Restructure — Design Spec

**Date:** 2026-04-23  
**Status:** Approved

## Goal

Strip the personal site down to a pure software engineering portfolio. Remove all music content. Simplify the structure to two pages. Update the accent color.

---

## Site Structure

| Route | Page | Description |
|-------|------|-------------|
| `/` | Homepage (About) | Hero + employment timeline + projects CTA |
| `/projects` | Projects | Existing filter/card grid, unchanged |

No other routes. The `/about` and `/music` routes are deleted.

---

## Navigation

- **Left:** "Timothy Hall" — links to `/`
- **Right (desktop):** "Projects" link + LinkedIn icon
- **Mobile menu:** "Projects" link + LinkedIn item

The About and Music nav items are removed. No other nav changes.

---

## Homepage

Three stacked sections, no preview cards:

1. **Hero**
   - Eyebrow: `Software Engineer` (remove "· Musician")
   - H1: `Timothy Hall`
   - Bio: rewritten to be software-only (remove music references)
   - Buttons: "View Projects" (links to `/projects`) + "LinkedIn" (external link)

2. **Employment timeline**
   - Move the existing `<EmploymentTimeline>` component here from the old About page
   - Content populated from `content/work.ts` (user will fill in from LinkedIn)

3. **"View my projects →" link**
   - Simple text link at the bottom of the page, above the footer
   - Links to `/projects`

---

## Footer

Two icon links: GitHub (`https://github.com/timothyryanhall`) and LinkedIn (`https://www.linkedin.com/in/timothyryanhall/`). Icon-only links, no text labels, no music reference.

---

## Accent Color

Change from electric lime `#c8ff00` to cyan `#22d3ee` (Tailwind cyan-400).

Update in `globals.css`: the three `--primary`, `--accent`, and `--ring` CSS custom properties all use `oklch(0.93 0.26 130)` today. Replace with the oklch equivalent of `#22d3ee` (`oklch(0.82 0.14 216)`). Also update `--primary-foreground` to remain black (good contrast on cyan).

---

## Deletions

Everything below is removed entirely — no stubs, no redirects:

**Pages/routes:**
- `app/about/` (route + page.tsx)
- `app/music/` (route + page.tsx)

**Components:**
- `components/about/achievement-list.tsx`
- `components/home/preview-cards.tsx`
- `components/music/` (entire directory)

**Lib:**
- `lib/youtube.ts`
- `lib/__tests__/youtube.test.ts`

**Content:**
- `content/work.ts` — keep file, remove the `Achievement` interface and `achievements` export (keep `WorkEntry` and `workHistory`)

**Env vars:**
- `YOUTUBE_API_KEY` and `YOUTUBE_CHANNEL_ID` references removed from code
- User to revoke the YouTube API key in Google Cloud Console separately

---

## Files Kept Unchanged

- `app/projects/page.tsx`
- `components/projects/` (all)
- `components/about/employment-timeline.tsx` (moved to homepage use)
- `components/layout/nav.tsx` (modified, not replaced)
- `components/home/hero.tsx` (modified, not replaced)
- `lib/projects.ts` and `lib/__tests__/projects.test.ts`
- All `components/ui/` shadcn components
- All design tokens except accent color

---

## Content Notes

- Hero bio text: user to provide final copy, or derive from LinkedIn profile at `https://www.linkedin.com/in/timothyryanhall/`
- `content/work.ts` work history: user to fill in from LinkedIn (current placeholder has Bellese Technologies 2021–Present)
- GitHub URL for footer: `https://github.com/timothyryanhall`
