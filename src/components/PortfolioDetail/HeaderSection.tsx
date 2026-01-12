'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

import type { StartupDetail } from '@/types/startupDetail';
import ImageWithSkeleton from './ImageWithSkeleton';

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

type HeaderSectionProps = {
  detail: StartupDetail;
};

const HeaderSection = ({ detail }: HeaderSectionProps) => {
  const heroImage = detail.companyHeaderImage || detail.companyLogo;

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="container mx-auto py-4 md:py-6"
      >
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 md:w-6 md:h-6" />
          <span className="text-sm md:text-lg hover:underline hover:font-semibold">Back to Startups</span>
        </Link>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        transition={{ delay: 0.2 }}
        className="relative w-full aspect-5/2"
      >
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#05070f] z-10" />
        {heroImage && (
          <ImageWithSkeleton
            src={heroImage}
            alt={detail.startupName}
            fill
            className="object-cover"
            priority
          />
        )}
      </motion.div>
    </>
  );
};

export default HeaderSection;

