import type { Brand, SocialLinks } from './types';
import { SocialIcon } from './SocialIcon';
import { Linkedin, Instagram, Twitter } from './icons';

export const DetailFooter = ({
  socialLinks,
  cohort,
  publishedAt,
  slug,
  brand,
}: {
  socialLinks: SocialLinks;
  cohort: string;
  publishedAt: string;
  slug: string;
  brand: Brand;
}) => (
  <footer className="mt-12 pt-5 border-t border-white/8 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
    <div>
      <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-white/40 mb-2">
        Connect
      </div>
      <div className="flex gap-1.5">
        {socialLinks.instagram && (
          <SocialIcon href={socialLinks.instagram} brand={brand} label="Instagram">
            <Instagram className="h-3.5 w-3.5" />
          </SocialIcon>
        )}
        {socialLinks.linkedin && (
          <SocialIcon href={socialLinks.linkedin} brand={brand} label="LinkedIn">
            <Linkedin className="h-3.5 w-3.5" />
          </SocialIcon>
        )}
        {socialLinks.twitter && (
          <SocialIcon href={socialLinks.twitter} brand={brand} label="Twitter">
            <Twitter className="h-3.5 w-3.5" />
          </SocialIcon>
        )}
      </div>
    </div>

    <div className="md:text-center">
      <div
        className="font-display text-[24px] leading-none tracking-[-0.02em]"
        style={{ color: brand.accent }}
      >
        ✦
      </div>
    </div>

    <div className="md:text-right font-mono text-[9px] tracking-[0.22em] uppercase text-white/40 leading-relaxed">
      <div>
        Filed ·{' '}
        {new Date(publishedAt).toLocaleDateString('en-IN', {
          month: 'short',
          year: 'numeric',
        })}
      </div>
      <div>Mesa Startup Lab · {cohort}</div>
      <div>Doc/{slug}/v2</div>
    </div>
  </footer>
);
