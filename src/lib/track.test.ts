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

  it('returns null when given an apiValue instead of a slug', () => {
    expect(trackBySlug('AI Track')).toBeNull();
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
