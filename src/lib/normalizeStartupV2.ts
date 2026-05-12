import { toProxyUrl } from '@/lib/imageProxy';
import type { StartupData } from '@/components/portfoliodetailed-revamp';

const ensureReadable = (hex: string, minLuminance = 0.45): string => {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const r = parseInt(m[1].slice(0, 2), 16);
  const g = parseInt(m[1].slice(2, 4), 16);
  const b = parseInt(m[1].slice(4, 6), 16);
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  if (lum >= minLuminance) return hex;
  const t = Math.min(1, ((minLuminance - lum) / (1 - lum)) * 1.4);
  const lift = (c: number) => Math.min(255, Math.round(c + (255 - c) * t));
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(lift(r))}${toHex(lift(g))}${toHex(lift(b))}`;
};

type V2Brand = {
  primary: string;
  accent: string;
  ink: string;
  surface_deep?: string | null;
  surface_mid?: string | null;
};

type V2KeyMetric = {
  id: number;
  value: string;
  label: string;
  description: string;
  active?: boolean;
};

type V2MarketStat = { value: string; label: string };

type V2Founder = {
  id: number;
  name: string;
  designation: string;
  linkedin?: string | null;
  email?: string | null;
  founder_profile_pic?: string | null;
  description?: string | null;
};

type V2GalleryImage = { id: number; url: string; caption?: string | null };

type V2FounderVideo = {
  url: string;
  embed_url: string;
  title: string;
  duration_seconds: number;
};

type V2SocialLinks = {
  instagram: string | null;
  linkedin: string | null;
  twitter: string | null;
  facebook: string | null;
};

type V2StartupData = {
  id: string;
  slug: string;
  startup_name: string;
  brand: V2Brand;
  keywords: string[];
  startup_website: string;
  company_logo: string;
  company_header_image: string;
  sector: { name: string };
  cohort: string;
  location: string;
  two_liner: string;
  tagline: string;
  brief_description: string;
  key_metrics: V2KeyMetric[];
  sector_excitement: {
    paragraph: string;
    india_market: V2MarketStat;
    global_market: V2MarketStat;
    cagr: V2MarketStat;
  };
  product_excitement: string;
  why_now: string;
  founders: V2Founder[];
  founder_gallery: { images: V2GalleryImage[]; testimonials: unknown[] };
  founder_video: V2FounderVideo | null;
  social_media_links: V2SocialLinks;
  published: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export type V2Envelope = { success: boolean; data: V2StartupData };

export const normalizeStartupV2 = (payload: V2Envelope): StartupData => {
  const d = payload.data;
  return {
    id: d.id,
    slug: d.slug,
    startup_name: d.startup_name,
    brand: {
      primary: d.brand.primary,
      accent: ensureReadable(d.brand.accent),
      ink: d.brand.ink,
    },
    keywords: d.keywords ?? [],
    startup_website: d.startup_website ?? '',
    company_logo: toProxyUrl(d.company_logo) ?? d.company_logo ?? '',
    company_header_image:
      toProxyUrl(d.company_header_image) ?? d.company_header_image ?? '',
    sector: { name: d.sector?.name ?? 'N/A' },
    cohort: d.cohort,
    location: d.location,
    two_liner: d.two_liner,
    tagline: d.tagline,
    brief_description: d.brief_description,
    key_metrics: (d.key_metrics ?? [])
      .filter((m) => m.active !== false)
      .map((m) => ({
        id: m.id,
        value: m.value,
        label: m.label,
        description: m.description,
      })),
    sector_excitement: {
      paragraph: d.sector_excitement?.paragraph ?? '',
      india_market: d.sector_excitement?.india_market ?? { value: '', label: '' },
      global_market: d.sector_excitement?.global_market ?? { value: '', label: '' },
      cagr: d.sector_excitement?.cagr ?? { value: '', label: '' },
    },
    product_excitement: d.product_excitement ?? '',
    why_now: d.why_now ?? '',
    founders: (d.founders ?? []).map((f) => ({
      id: f.id,
      name: f.name,
      designation: f.designation,
      linkedin: f.linkedin ?? undefined,
      email: f.email ?? null,
      founder_profile_pic:
        toProxyUrl(f.founder_profile_pic) ?? f.founder_profile_pic ?? undefined,
      description: f.description ?? undefined,
    })),
    founder_gallery: {
      images: (d.founder_gallery?.images ?? []).map((img) => ({
        id: img.id,
        url: toProxyUrl(img.url) ?? img.url,
        caption: img.caption ?? undefined,
      })),
      testimonials: d.founder_gallery?.testimonials ?? [],
    },
    founder_video: d.founder_video,
    social_media_links: {
      instagram: d.social_media_links?.instagram ?? null,
      linkedin: d.social_media_links?.linkedin ?? null,
      twitter: d.social_media_links?.twitter ?? null,
      facebook: d.social_media_links?.facebook ?? null,
    },
    created_at: d.created_at,
    updated_at: d.updated_at,
    published_at: d.published_at ?? '',
  };
};
