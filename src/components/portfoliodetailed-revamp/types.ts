export type Brand = {
  primary: string;
  accent: string;
  ink: string;
};

export type GalleryImage = {
  id: number;
  url: string;
  caption?: string;
};

export type Founder = {
  id: number;
  name: string;
  designation: string;
  linkedin?: string;
  email?: string | null;
  founder_profile_pic?: string;
  description?: string;
};

export type MarketStat = { value: string; label: string };

export type KeyMetric = {
  id: number;
  value: string;
  label: string;
  description: string;
};

export type FounderVideo = {
  url: string;
  embed_url: string;
  title: string;
  duration_seconds: number;
};

export type SocialLinks = {
  instagram: string | null;
  linkedin: string | null;
  twitter: string | null;
  facebook: string | null;
};

export type StartupData = {
  id: string;
  slug: string;
  startup_name: string;
  brand: Brand;
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
  key_metrics: KeyMetric[];
  sector_excitement: {
    paragraph: string;
    india_market: MarketStat;
    global_market: MarketStat;
    cagr: MarketStat;
  };
  product_excitement: string;
  why_now: string;
  founders: Founder[];
  founder_gallery: { images: GalleryImage[]; testimonials: unknown[] };
  founder_video: FounderVideo | null;
  social_media_links: SocialLinks;
  created_at: string;
  updated_at: string;
  published_at: string;
};
