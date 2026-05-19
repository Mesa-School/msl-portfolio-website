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
