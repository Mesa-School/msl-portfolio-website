# Portfolio Track SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make portfolio track filters (`?track=ai|d2c|services`) indexable, server-rendered URLs with per-track titles/canonicals/sitemap entries, while tab clicks update the URL without reload.

**Architecture:** A shared `track.ts` module is the single source of truth (slug ↔ API value ↔ label ↔ description). The `/portfolio` server component reads `searchParams.track`, server-fetches the filtered list, and emits per-track metadata via a pure `buildPortfolioMetadata()` helper. The filter context is seeded from the URL and stays synced via `useSearchParams`; header tabs `router.push` shallow URL changes.

**Tech Stack:** Next.js 16 (App Router, async `searchParams`), React 19, TypeScript, Vitest (new, node environment).

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `vitest.config.ts` | Test runner config (node env, `@` alias) | Create |
| `package.json` | Add `test` scripts + `vitest` devDep | Modify |
| `src/lib/track.ts` | Single source of truth for tracks | Create |
| `src/lib/track.test.ts` | Unit tests for track mapping | Create |
| `src/lib/portfolioMeta.ts` | Pure `buildPortfolioMetadata(slug)` → `Metadata` | Create |
| `src/lib/portfolioMeta.test.ts` | Unit tests for metadata logic | Create |
| `src/app/(routes)/portfolio/page.tsx` | searchParams-aware render + `generateMetadata` | Modify |
| `src/contexts/PortfolioFilterContext.tsx` | `initialTracks` prop + URL sync | Modify |
| `src/components/OurStartups/OurStartupsHeader.tsx` | Tabs from `track.ts` + shallow `router.push` | Modify |
| `src/app/sitemap.ts` | Emit 4 URLs (base + 3 tracks) | Modify |
| `src/actions/fetchStartups.ts` | Remove leftover `console.log` | Modify |

---

### Task 1: Vitest infrastructure

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (scripts + devDependencies)

- [ ] **Step 1: Install Vitest**

Run: `npm install -D vitest`
Expected: `vitest` appears under `devDependencies` in `package.json`, no errors.

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
```

- [ ] **Step 3: Add test scripts to `package.json`**

In the `"scripts"` block, add these two entries (keep existing `dev`/`build`/`start`):

```json
    "test": "vitest run",
    "test:watch": "vitest"
```

- [ ] **Step 4: Verify the runner works with no tests yet**

Run: `npx vitest run --passWithNoTests`
Expected: exits 0 with "No test files found" (confirms config loads).

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts package.json package-lock.json
git commit -m "chore: add Vitest (node env) test infrastructure

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Shared `track.ts` module (TDD)

**Files:**
- Create: `src/lib/track.test.ts`
- Create: `src/lib/track.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/track.test.ts`:

```ts
import { describe, it, expect } from 'vitest';

import { TRACKS, trackBySlug } from './track';

describe('trackBySlug', () => {
  it('resolves the ai slug to the API value', () => {
    expect(trackBySlug('ai')?.apiValue).toBe('AI Track');
  });

  it('resolves the d2c slug to its label', () => {
    expect(trackBySlug('d2c')?.label).toBe('D2C Track');
  });

  it('resolves the services slug', () => {
    expect(trackBySlug('services')?.slug).toBe('services');
  });

  it('returns null for an unknown slug', () => {
    expect(trackBySlug('foo')).toBeNull();
  });

  it('returns null for empty/nullish input', () => {
    expect(trackBySlug('')).toBeNull();
    expect(trackBySlug(null)).toBeNull();
    expect(trackBySlug(undefined)).toBeNull();
  });

  it('exposes exactly 3 tracks, each with a non-empty description', () => {
    expect(TRACKS).toHaveLength(3);
    for (const t of TRACKS) {
      expect(t.description.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/track.test.ts`
Expected: FAIL — cannot resolve module `./track`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/track.ts`:

```ts
export type TrackSlug = 'ai' | 'd2c' | 'services';

export interface TrackEntry {
  /** URL slug used in ?track=<slug> */
  slug: TrackSlug;
  /** Value the startups API expects for service_track filtering */
  apiValue: string;
  /** Human label used for tab text and the <title> */
  label: string;
  /** Per-track meta description (<=160 chars) */
  description: string;
}

export const TRACKS: readonly TrackEntry[] = [
  {
    slug: 'ai',
    apiValue: 'AI Track',
    label: 'AI Track',
    description:
      "Mesa Startup Lab's AI Track — student and early-stage founders building AI-first startups, from applied ML to AI-native products.",
  },
  {
    slug: 'd2c',
    apiValue: 'D2C Track',
    label: 'D2C Track',
    description:
      "Mesa Startup Lab's D2C Track — founders building consumer and direct-to-consumer brands across India.",
  },
  {
    slug: 'services',
    apiValue: 'Services Track',
    label: 'Services Track',
    description:
      "Mesa Startup Lab's Services Track — founders building service-led and B2B startups.",
  },
] as const;

export function trackBySlug(slug?: string | null): TrackEntry | null {
  if (!slug) return null;
  return TRACKS.find((track) => track.slug === slug) ?? null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/track.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/track.ts src/lib/track.test.ts
git commit -m "feat: add shared track module (slug/apiValue/label/description)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: `buildPortfolioMetadata` helper (TDD)

**Files:**
- Create: `src/lib/portfolioMeta.test.ts`
- Create: `src/lib/portfolioMeta.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/portfolioMeta.test.ts`:

```ts
import { describe, it, expect } from 'vitest';

import { buildPortfolioMetadata, PORTFOLIO_DESCRIPTION } from './portfolioMeta';

describe('buildPortfolioMetadata', () => {
  it('returns base metadata when no track param', () => {
    const m = buildPortfolioMetadata(undefined);
    expect(m.title).toBe('Startup Portfolio');
    expect(m.description).toBe(PORTFOLIO_DESCRIPTION);
    expect(m.alternates?.canonical).toBe('/portfolio');
    expect(m.robots).toBeUndefined();
  });

  it('returns AI track metadata', () => {
    const m = buildPortfolioMetadata('ai');
    expect(m.title).toBe('AI Track');
    expect(m.alternates?.canonical).toBe('/portfolio?track=ai');
    expect(m.robots).toBeUndefined();
  });

  it('returns D2C track metadata', () => {
    const m = buildPortfolioMetadata('d2c');
    expect(m.title).toBe('D2C Track');
    expect(m.alternates?.canonical).toBe('/portfolio?track=d2c');
  });

  it('returns Services track metadata', () => {
    const m = buildPortfolioMetadata('services');
    expect(m.title).toBe('Services Track');
    expect(m.alternates?.canonical).toBe('/portfolio?track=services');
  });

  it('treats an unknown track as base + noindex', () => {
    const m = buildPortfolioMetadata('foo');
    expect(m.title).toBe('Startup Portfolio');
    expect(m.alternates?.canonical).toBe('/portfolio');
    expect(m.robots).toEqual({ index: false, follow: true });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/portfolioMeta.test.ts`
Expected: FAIL — cannot resolve module `./portfolioMeta`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/portfolioMeta.ts`:

```ts
import type { Metadata } from 'next';

import { trackBySlug } from '@/lib/track';

export const PORTFOLIO_DESCRIPTION =
  'Explore the Mesa Startup Lab portfolio — student- and early-stage founders building across AI, D2C, and services.';

function base(title: string, description: string, canonical: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

/**
 * Pure metadata builder for the portfolio route.
 * - valid ?track=<slug>  -> per-track title + self canonical
 * - junk ?track=<other>  -> base title, canonical /portfolio, noindex
 * - no param             -> base title + /portfolio canonical
 */
export function buildPortfolioMetadata(rawTrack?: string | null): Metadata {
  const hasParam = typeof rawTrack === 'string' && rawTrack.length > 0;
  const entry = trackBySlug(rawTrack);

  if (entry) {
    return base(
      entry.label,
      entry.description,
      `/portfolio?track=${entry.slug}`,
    );
  }

  const meta = base('Startup Portfolio', PORTFOLIO_DESCRIPTION, '/portfolio');

  if (hasParam) {
    // unknown junk param — keep crawlers off infinite param URLs
    meta.robots = { index: false, follow: true };
  }

  return meta;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/portfolioMeta.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/portfolioMeta.ts src/lib/portfolioMeta.test.ts
git commit -m "feat: add pure buildPortfolioMetadata helper

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Wire `portfolio/page.tsx` to searchParams

**Files:**
- Modify: `src/app/(routes)/portfolio/page.tsx`

- [ ] **Step 1: Replace the file contents**

Replace the entire contents of `src/app/(routes)/portfolio/page.tsx` with:

```tsx
import type { Metadata } from 'next';

import { OurStartupsHeader } from '@/components/OurStartups/OurStartupsHeader';
import { StartupOverviewGrid } from '@/components/OurStartups/StartupOverviewGrid';
import { PortfolioFilterProvider } from '@/contexts/PortfolioFilterContext';
import { fetchStartupsAction } from '@/actions/fetchStartups';
import { trackBySlug } from '@/lib/track';
import { buildPortfolioMetadata } from '@/lib/portfolioMeta';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PageProps = {
  searchParams: Promise<{ track?: string }>;
};

export async function generateMetadata(
  { searchParams }: PageProps,
): Promise<Metadata> {
  const { track } = await searchParams;
  return buildPortfolioMetadata(track);
}

const OurStartupsPage = async ({ searchParams }: PageProps) => {
  const { track } = await searchParams;
  const entry = trackBySlug(track);
  const tracksForApi = entry ? [entry.apiValue] : [];

  const { startups, pagination } = await fetchStartupsAction(1, [], tracksForApi);

  return (
    <PortfolioFilterProvider initialTracks={tracksForApi}>
      <main className="min-h-screen bg-msl-page text-white px-4 sm:px-8 lg:px-16">
        <div className="mx-auto w-full max-w-6xl">
          <OurStartupsHeader />
          <StartupOverviewGrid
            initialStartups={startups}
            initialPagination={pagination}
          />
        </div>
      </main>
    </PortfolioFilterProvider>
  );
};

export default OurStartupsPage;
```

Note: the old static `export const metadata` and local `PORTFOLIO_DESCRIPTION` are intentionally removed — `generateMetadata` + `portfolioMeta.ts` replace them. A page cannot export both `metadata` and `generateMetadata`.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit 2>&1 | grep -v "^\.next/"`
Expected: no output (the only pre-existing error lives under `.next/` and is filtered).

- [ ] **Step 3: Commit**

```bash
git add "src/app/(routes)/portfolio/page.tsx"
git commit -m "feat: portfolio page reads ?track and emits per-track metadata

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Seed + sync filter context from the URL

**Files:**
- Modify: `src/contexts/PortfolioFilterContext.tsx`

- [ ] **Step 1: Replace the file contents**

Replace the entire contents of `src/contexts/PortfolioFilterContext.tsx` with:

```tsx
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useSearchParams } from 'next/navigation';

import { trackBySlug } from '@/lib/track';

type PortfolioFilterContextType = {
  selectedSectors: string[];
  selectedTracks: string[];
  searchTerm: string;
  setSelectedSectors: (sectors: string[]) => void;
  setSelectedTracks: (tracks: string[]) => void;
  setSearchTerm: (term: string) => void;
  toggleSector: (sectorName: string) => void;
  toggleTrack: (trackName: string) => void;
  clearFilters: () => void;
};

const PortfolioFilterContext = createContext<
  PortfolioFilterContextType | undefined
>(undefined);

export const PortfolioFilterProvider = ({
  children,
  initialTracks = [],
}: {
  children: ReactNode;
  initialTracks?: string[];
}) => {
  const searchParams = useSearchParams();
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedTracks, setSelectedTracks] =
    useState<string[]>(initialTracks);
  const [searchTerm, setSearchTerm] = useState('');

  // URL is the single source of truth for the track filter.
  useEffect(() => {
    const entry = trackBySlug(searchParams.get('track'));
    const next = entry ? [entry.apiValue] : [];
    setSelectedTracks((prev) =>
      prev.length === next.length && prev.every((v, i) => v === next[i])
        ? prev
        : next,
    );
  }, [searchParams]);

  const toggleSector = (sectorName: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sectorName)
        ? prev.filter((s) => s !== sectorName)
        : [...prev, sectorName],
    );
  };

  const toggleTrack = (trackName: string) => {
    setSelectedTracks((prev) =>
      prev.includes(trackName)
        ? prev.filter((t) => t !== trackName)
        : [...prev, trackName],
    );
  };

  const clearFilters = () => {
    setSelectedSectors([]);
    setSelectedTracks([]);
    setSearchTerm('');
  };

  return (
    <PortfolioFilterContext.Provider
      value={{
        selectedSectors,
        selectedTracks,
        searchTerm,
        setSelectedSectors,
        setSelectedTracks,
        setSearchTerm,
        toggleSector,
        toggleTrack,
        clearFilters,
      }}
    >
      {children}
    </PortfolioFilterContext.Provider>
  );
};

export const usePortfolioFilters = () => {
  const context = useContext(PortfolioFilterContext);
  if (context === undefined) {
    throw new Error(
      'usePortfolioFilters must be used within a PortfolioFilterProvider',
    );
  }
  return context;
};
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit 2>&1 | grep -v "^\.next/"`
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/contexts/PortfolioFilterContext.tsx
git commit -m "feat: seed + sync portfolio track filter from URL

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Header tabs drive the URL

**Files:**
- Modify: `src/components/OurStartups/OurStartupsHeader.tsx`

- [ ] **Step 1: Replace the tab data + imports**

In `src/components/OurStartups/OurStartupsHeader.tsx`:

Add to the import block near the top (after the existing `lucide-react` import):

```tsx
import { useRouter } from 'next/navigation';
import { TRACKS } from '@/lib/track';
```

Replace the existing `TrackTab` type and `TRACK_TABS` constant:

```tsx
type TrackTab = {
  id: string;
  name: string;
  value: string | null;
  slug: string | null;
};

const TRACK_TABS: TrackTab[] = [
  { id: 'all', name: 'All', value: null, slug: null },
  ...TRACKS.map((t) => ({
    id: t.slug,
    name: t.label,
    value: t.apiValue,
    slug: t.slug,
  })),
];
```

- [ ] **Step 2: Route on tab click + clear**

Inside the `OurStartupsHeader` component, add the router right after the
`usePortfolioFilters()` destructure:

```tsx
  const router = useRouter();
```

Replace the existing `handleTabClick`:

```tsx
  const handleTabClick = (tab: TrackTab) => {
    router.push(tab.slug ? `/portfolio?track=${tab.slug}` : '/portfolio', {
      scroll: false,
    });
  };
```

Replace the clear-filters button's `onClick` (the one calling `clearFilters`) with:

```tsx
                  onClick={() => {
                    clearFilters();
                    router.push('/portfolio', { scroll: false });
                  }}
```

Note: `setSelectedTracks` is no longer called from `handleTabClick` — the
context's `useSearchParams` effect (Task 5) is the only mutator, preventing
double updates. `activeTabId` already derives from `selectedTracks` and keeps
working because `tab.value` still equals the API value.

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit 2>&1 | grep -v "^\.next/"`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/components/OurStartups/OurStartupsHeader.tsx
git commit -m "feat: portfolio track tabs push shallow URL changes

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Add track URLs to the sitemap

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Import TRACKS**

Add to the import block at the top of `src/app/sitemap.ts` (after the
`API_URL` import):

```ts
import { TRACKS } from '@/lib/track';
```

- [ ] **Step 2: Replace `staticEntries`**

Replace the existing `staticEntries` array literal with:

```ts
  // `/` is intentionally omitted: it permanently redirects to /portfolio,
  // so listing it would waste crawl budget on a 308.
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/portfolio`,
      lastModified: BUILD_DATE,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...TRACKS.map((t) => ({
      url: `${SITE_URL}/portfolio?track=${t.slug}`,
      lastModified: BUILD_DATE,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  ];
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit 2>&1 | grep -v "^\.next/"`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat: list indexable per-track portfolio URLs in sitemap

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Remove leftover debug log

**Files:**
- Modify: `src/actions/fetchStartups.ts`

- [ ] **Step 1: Delete the console.log**

In `src/actions/fetchStartups.ts`, delete this line (currently around line 117,
between the `startups` mapping and the `return`):

```ts
    console.log("All Startups", startups);
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit 2>&1 | grep -v "^\.next/"`
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/actions/fetchStartups.ts
git commit -m "chore: drop leftover debug log in fetchStartups

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS — 11 tests across `track.test.ts` (6) and `portfolioMeta.test.ts` (5).

- [ ] **Step 2: Type-check the whole project**

Run: `npx tsc --noEmit 2>&1 | grep -v "^\.next/"`
Expected: no output.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: build succeeds; no errors for the portfolio route.

- [ ] **Step 4: Manual SSR checks**

Start the server: `npm run dev` (background), then in another shell:

- `curl -s "http://localhost:3000/portfolio?track=ai" | grep -i "<title>"`
  Expected: `<title>AI Track | Mesa Startup Lab</title>`
- `curl -s "http://localhost:3000/portfolio?track=ai" | grep -i 'rel="canonical"'`
  Expected: canonical href ending `/portfolio?track=ai`
- `curl -s "http://localhost:3000/portfolio?track=foo" | grep -i "robots"`
  Expected: a `noindex` robots meta tag present
- `curl -s "http://localhost:3000/sitemap.xml" | grep -c "track="`
  Expected: `3`
- In a browser: click AI/D2C/Services/All tabs — URL updates to
  `/portfolio?track=...` / `/portfolio` with **no full reload**; browser back
  button restores the previous tab and list.

- [ ] **Step 5: Final commit (if any verification fixes were needed)**

```bash
git add -A
git commit -m "test: verify portfolio track SEO end to end

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

(Skip if no changes were required.)

---

## Notes / Known Limitations (from spec)

- **Shallow nav does not re-run `generateMetadata`.** In-page tab switching
  keeps the landing `document.title`. Acceptable — SEO depends on SSR
  responses (crawlers/direct loads/shares) which always get the correct
  per-track title. Deliberately not patching `document.title` (YAGNI).
- **Zero-result track:** if a track has no startups, SSR `initialStartups` is
  empty so `StartupOverviewGrid`'s `skipFirstFetch` is false and it performs
  one client refetch for the same track (shows the empty state). Harmless,
  no code change needed.
- The pre-existing `.next/types/validator.ts` error (references the
  externally-deleted `maintenance/page.tsx`) is unrelated and clears on the
  next clean build.
