import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import type { StartupDetail } from '@/types/startupDetail';

type HeaderSectionProps = {
  detail: StartupDetail;
};

const HeaderSection = ({ detail }: HeaderSectionProps) => {
  const heroImage = detail.companyHeader || detail.companyLogo;

  return (
    <>
      <div className="container mx-auto px-4 py-4 md:py-6">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Startups</span>
        </Link>
      </div>

      <div className="relative h-[200px] md:h-[400px] w-full">
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#05070f]" />
        {heroImage && (
          <Image
            src={heroImage}
            alt={detail.startupName}
            fill
            className="object-cover"
            priority
          />
        )}
      </div>
    </>
  );
};

export default HeaderSection;

