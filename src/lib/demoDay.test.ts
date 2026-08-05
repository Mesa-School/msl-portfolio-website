import { describe, it, expect } from 'vitest';

import { DEMO_DAY_SLUGS, byDemoDayOrder, isDemoDaySlug } from './demoDay';

describe('DEMO_DAY_SLUGS', () => {
  it('holds exactly 13 startups', () => {
    expect(DEMO_DAY_SLUGS).toHaveLength(13);
  });

  it('has no duplicates', () => {
    expect(new Set(DEMO_DAY_SLUGS).size).toBe(DEMO_DAY_SLUGS.length);
  });

  it('opens with FYN and closes with Orange Invest', () => {
    expect(DEMO_DAY_SLUGS[0]).toBe('fyn');
    expect(DEMO_DAY_SLUGS.at(-1)).toBe('orange-invest');
  });

  it('contains no blank slugs', () => {
    for (const slug of DEMO_DAY_SLUGS) {
      expect(slug.trim().length).toBeGreaterThan(0);
    }
  });
});

describe('isDemoDaySlug', () => {
  it('accepts a slug in the line-up', () => {
    expect(isDemoDaySlug('whisperwave')).toBe(true);
  });

  it('rejects a portfolio slug outside the line-up', () => {
    expect(isDemoDaySlug('bloc')).toBe(false);
  });

  it('rejects nullish input', () => {
    expect(isDemoDaySlug(null)).toBe(false);
    expect(isDemoDaySlug(undefined)).toBe(false);
  });
});

describe('byDemoDayOrder', () => {
  it('restores pitch order from a shuffled list', () => {
    const shuffled = [
      { slug: 'squareup' },
      { slug: 'fyn' },
      { slug: 'playroot' },
    ];

    expect(shuffled.sort(byDemoDayOrder((s) => s.slug)).map((s) => s.slug)).toEqual([
      'fyn',
      'playroot',
      'squareup',
    ]);
  });

  it('pushes unknown slugs to the end rather than the front', () => {
    const items = [{ slug: 'not-in-lineup' }, { slug: 'fyn' }];

    expect(items.sort(byDemoDayOrder((s) => s.slug)).map((s) => s.slug)).toEqual([
      'fyn',
      'not-in-lineup',
    ]);
  });
});
