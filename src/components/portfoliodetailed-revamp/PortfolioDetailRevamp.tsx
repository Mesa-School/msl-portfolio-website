import type { StartupData } from './types';
import { fontVariables } from './fonts';
import { BannerCard } from './BannerCard';
import { IdentityRow } from './IdentityRow';
import { StatsGrid } from './StatsGrid';
import { KeywordsMarquee } from './KeywordsMarquee';
import { OpportunitySection } from './OpportunitySection';
import { BriefAndEdge } from './BriefAndEdge';
import { WhyNowSection } from './WhyNowSection';
import { PitchAndBuilders } from './PitchAndBuilders';
import { FieldNotes } from './FieldNotes';

export const PortfolioDetailRevamp = ({ data }: { data: StartupData }) => {
  const brand = data.brand;

  const themeStyle = {
    '--brand-primary': brand.primary,
    '--brand-accent': brand.accent,
    '--brand-ink': brand.ink,
  } as React.CSSProperties;

  return (
    <div
      style={themeStyle}
      className={`${fontVariables} relative min-h-screen bg-msl-page text-white overflow-x-hidden font-body`}
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-8 lg:px-12 pt-24 pb-12">
        <section className="mt-2">
          <BannerCard
            startupName={data.startup_name}
            companyLogo={data.company_logo}
            companyHeaderImage={data.company_header_image}
            sectorName={data.sector.name}
            brand={brand}
          />
          <IdentityRow
            tagline={data.tagline}
            twoLiner={data.two_liner}
            startupWebsite={data.startup_website}
            founderVideo={data.founder_video}
            socialLinks={data.social_media_links}
            brand={brand}
          />
          <StatsGrid metrics={data.key_metrics} brand={brand} />
          <KeywordsMarquee keywords={data.keywords} brand={brand} />
        </section>

        <OpportunitySection
          paragraph={data.sector_excitement.paragraph}
          cagr={data.sector_excitement.cagr}
          indiaMarket={data.sector_excitement.india_market}
          globalMarket={data.sector_excitement.global_market}
          brand={brand}
        />

        <BriefAndEdge
          briefDescription={data.brief_description}
          productExcitement={data.product_excitement}
          brand={brand}
        />

        <WhyNowSection whyNow={data.why_now} brand={brand} />

        <PitchAndBuilders
          founderVideo={data.founder_video}
          founders={data.founders}
          brand={brand}
        />

        <FieldNotes
          images={data.founder_gallery?.images || []}
          startupName={data.startup_name}
          brand={brand}
        />
      </div>
    </div>
  );
};
