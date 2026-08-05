import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://msl.mesaschool.co.in';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Only the cookie-gated investor portal is blocked. /demo-day itself is
        // the public Demo Day startup list and must stay crawlable.
        disallow: ['/api/', '/demo-day/vc/', '/test', '/maintenance'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
