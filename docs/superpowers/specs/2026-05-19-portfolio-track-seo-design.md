# Portfolio Track SEO — Design Spec

**Date:** 2026-05-19
**Status:** Approved (design)
**Approach:** A — Server-rendered per-track view, URL is the source of truth

## Problem

Google shows the portfolio page as **"Portfolio | Mesa Startup Lab"** with a single
generic description. The track filter (All / AI / D2C / Services) is client-only
React state with no URL representation, so:

- There is no crawlable, rankable URL for "AI Track", "D2C Track", or
  "Services Track".
- Track selections cannot be shared, bookmarked, or deep-linked.
- The homepage `/` 308-redirects to `/portfolio` with no defined default tab.

## Goals

1. Base `/portfolio` titled **"Startup Portfolio | Mesa Startup Lab"**.
2. Per-track URLs `?track=ai|d2c|services` that Google can index and rank as
   distinct results titled **"AI Track | Mesa Startup Lab"**,
   **"D2C Track | Mesa Startup Lab"**, **"Services Track | Mesa Startup Lab"**.
3. Track-filtered content server-rendered into the initial HTML (so the title
   matches the content).
4. Tab clicks update the URL with no page reload; back/forward and sharing work.
5. `/` permanently redirects to `/portfolio` (All tab, no param).

## Non-Goals

- Sector filters in the URL (sectors stay client-only).
- Path-segment routes `/portfolio/[track]` (explicitly rejected; query param chosen).
- ISR for portfolio pages (stays `force-dynamic` per prior decision).
- Client-side `document.title` rewriting on in-page tab switches (see Tradeoffs).

## Decisions (from brainstorming)

| Decision | Choice |
|---|---|
| Base title | `Startup Portfolio` (template appends `| Mesa Startup Lab`) |
| Track titles | `AI Track`, `D2C Track`, `Services Track` |
| URL scheme | Query param `?track=<slug>` |
| Slug values | `ai`, `d2c`, `services` |
| Indexing | Each valid track URL self-canonical + in sitemap (indexable) |
| Invalid/junk params | Canonical to `/portfolio` + `robots: noindex, follow` |
| `/` redirect | `308 → /portfolio` (no param, All tab) |
| Tab click | Shallow `router.push`, `{ scroll: false }`, no reload |

## Architecture

### Component / module map

| Unit | Responsibility | Depends on |
|---|---|---|
| `src/lib/track.ts` (new) | Single source of truth: slug ↔ API value ↔ label ↔ SEO description; `trackBySlug()` validation | none |
| `portfolio/page.tsx` | Read `searchParams.track`, server-fetch filtered list, `generateMetadata` | `track.ts`, `fetchStartupsAction` |
| `PortfolioFilterContext.tsx` | Seed `selectedTracks` from URL; stay synced via `useSearchParams` | `track.ts` |
| `OurStartupsHeader.tsx` | Tabs sourced from `track.ts`; click → shallow `router.push` | `track.ts` |
| `StartupOverviewGrid.tsx` | Existing refetch-on-filter-change behavior; `skipFirstFetch` guard prevents duplicate initial fetch | — (unchanged logic) |
| `sitemap.ts` | Emit 4 URLs (`/portfolio` + 3 track variants) | `track.ts` |
| `fetchStartups.ts` | Remove leftover `console.log("All Startups", …)` | — |

### `src/lib/track.ts`

```ts
export type TrackSlug = 'ai' | 'd2c' | 'services';

export interface TrackEntry {
  slug: TrackSlug;
  apiValue: string;   // value sent to API service_track ('AI Track')
  label: string;      // tab + <title> text ('AI Track')
  description: string; // per-track meta description
}

export const TRACKS: readonly TrackEntry[];

export function trackBySlug(slug?: string | null): TrackEntry | null;
```

`TRACK_TABS` in the header is derived from `TRACKS` plus a synthetic
`{ id:'all', label:'All', slug:null }` entry.

**Concrete copy** (≤160 chars, keyword-led for the description while titles stay
exactly as decided):

- Base `/portfolio` — title `Startup Portfolio`; description:
  *"Explore the Mesa Startup Lab portfolio — student- and early-stage founders
  building across AI, D2C, and services."* (existing `PORTFOLIO_DESCRIPTION`)
- `ai` — title `AI Track`; description:
  *"Mesa Startup Lab's AI Track — student and early-stage founders building
  AI-first startups, from applied ML to AI-native products."*
- `d2c` — title `D2C Track`; description:
  *"Mesa Startup Lab's D2C Track — founders building consumer and
  direct-to-consumer brands across India."*
- `services` — title `Services Track`; description:
  *"Mesa Startup Lab's Services Track — founders building service-led and
  B2B startups."*

### Metadata logic (`generateMetadata`)

```
slug = (await searchParams).track
entry = trackBySlug(slug)

if slug present AND entry === null:        // junk param
  title 'Startup Portfolio'
  alternates.canonical = '/portfolio'
  robots = { index: false, follow: true }

else if entry:                             // valid track
  title = entry.label                      // 'AI Track'
  description = entry.description
  alternates.canonical = `/portfolio?track=${entry.slug}`

else:                                      // base
  title = 'Startup Portfolio'
  description = PORTFOLIO_DESCRIPTION
  alternates.canonical = '/portfolio'
```

OpenGraph/Twitter mirror title + description. The root layout template
(`%s | Mesa Startup Lab`) supplies the suffix.

### Page render

```
slug  = (await searchParams).track
entry = trackBySlug(slug)
tracksForApi = entry ? [entry.apiValue] : []
{ startups, pagination } = await fetchStartupsAction(1, [], tracksForApi)

<PortfolioFilterProvider initialTracks={tracksForApi}>
  <OurStartupsHeader />
  <StartupOverviewGrid initialStartups={startups} initialPagination={pagination} />
</PortfolioFilterProvider>
```

### URL ↔ state sync

- `PortfolioFilterProvider` accepts `initialTracks?: string[]`, uses it as the
  initial `selectedTracks` state.
- Provider runs a `useEffect` on `useSearchParams().get('track')`: resolves the
  slug via `trackBySlug` and sets `selectedTracks` to `[apiValue]` or `[]`.
- `OurStartupsHeader.handleTabClick` calls `router.push` only (no direct context
  set): `All → /portfolio`, track → `/portfolio?track=<slug>`, both
  `{ scroll: false }`. The provider's effect is the single place that mutates
  `selectedTracks`, preventing double updates.
- `StartupOverviewGrid` is unchanged: its existing `useEffect` on
  `selectedTracks` refetches page 1; `skipFirstFetch` (true when
  `initialStartups` is non-empty) suppresses the duplicate fetch on first load.

### Sitemap

`staticEntries` becomes:

| URL | priority |
|---|---|
| `/portfolio` | 1.0 |
| `/portfolio?track=ai` | 0.8 |
| `/portfolio?track=d2c` | 0.8 |
| `/portfolio?track=services` | 0.8 |

All with `lastModified: BUILD_DATE`, `changeFrequency: 'daily'`. Track URLs
sourced by mapping `TRACKS`.

## Data Flow

1. **Direct load / crawler** `GET /portfolio?track=ai`
   → `generateMetadata` emits `<title>AI Track | Mesa Startup Lab`, canonical
   `/portfolio?track=ai`
   → page server-fetches AI-filtered startups → initial HTML contains AI list
   → provider seeded with `['AI Track']` → grid renders SSR data, skips first
   client fetch.
2. **In-page tab click** (e.g. All → D2C)
   → `router.push('/portfolio?track=d2c', { scroll:false })`
   → provider effect sets `selectedTracks=['D2C Track']`
   → grid effect fetches page 1 for D2C (client) → list updates, no reload.
3. **Back button** → `searchParams` reverts → provider effect resyncs → grid
   refetches.

## Tradeoffs

- **Shallow nav does not re-run `generateMetadata`.** On in-page tab switching
  `document.title` keeps the landing page's title. Acceptable: SEO depends on
  SSR responses (crawlers, direct loads, shared links) which always get the
  correct per-track title. We deliberately do **not** patch `document.title`
  client-side (YAGNI, avoids hydration/title-flicker complexity).
- **Duplicate-content risk** of `?track=` variants is mitigated by unique
  per-track title + description + self-canonical; junk params are `noindex`.

## Testing

- **Unit (`track.ts`):** `trackBySlug` for each valid slug, `null`, `undefined`,
  unknown string; label/apiValue/description correctness.
- **Unit (`generateMetadata`):** no param → "Startup Portfolio" + canonical
  `/portfolio`; `track=ai|d2c|services` → correct title + canonical; invalid
  `track=foo` → "Startup Portfolio" + canonical `/portfolio` + `noindex`.
- **Verification (manual / curl):**
  - `view-source /portfolio?track=ai` contains AI startups and
    `<title>AI Track | Mesa Startup Lab`.
  - `/sitemap.xml` lists all 4 URLs.
  - Clicking a tab changes the URL with no full reload; back button restores
    previous tab + list.

## Rollout / Risk

- No DB or API changes; API already supports `service_track` filtering.
- Behind no flag — pure routing/metadata change, safe to ship directly.
- Stale `.next` validator cache (pre-existing, references externally-deleted
  `maintenance/page.tsx`) clears on next build; unrelated to this work.
