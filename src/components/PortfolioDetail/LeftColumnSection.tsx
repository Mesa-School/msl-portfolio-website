'use client';

import Link from 'next/link';
import { Award, Eye, Lightbulb, MapPin, Rocket, Target } from 'lucide-react';
import { DM_Sans } from 'next/font/google';
import { motion, type Variants } from 'framer-motion';

import type { StartupDetail } from '@/types/startupDetail';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { renderMarkdownText } from './helpers';
import ImageWithSkeleton from './ImageWithSkeleton';

const dmSans = DM_Sans({ subsets: ['latin'] });

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
    },
  },
};

type LeftColumnSectionProps = {
  detail: StartupDetail;
};

const LeftColumnSection = ({ detail }: LeftColumnSectionProps) => (
  <div className={`lg:col-span-2 space-y-8 ${dmSans.className}`}>
    {/* Hero Section with Company Info */}
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUpVariants}
      className="relative rounded-3xl bg-linear-to-b from-black/80 via-purple-500/10 to-transparent backdrop-blur-xl p-2 md:p-5 border border-gray-700/30 shadow-2xl"
    >

      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative flex flex-col md:flex-row items-start gap-6 md:gap-4">
        {detail.companyLogo && (
          <div className="relative bg-white w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden ring-4 ring-white/10 shadow-xl shrink-0">
            <ImageWithSkeleton
              src={detail.companyLogo}
              alt={detail.startupName}
              fill
              className="object-cover p-2"
              priority
            />
          </div>
        )}
        
        <div className="flex-1 w-full">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4 md:gap-2">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-1 text-white tracking-tight leading-tight">
                {detail.startupName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm md:text-base text-purple-200/90">
                <span className="flex items-center gap-2 bg-black px-3 py-1.5 rounded-full backdrop-blur-sm">
                  {detail?.sector?.name}
                </span>
              </div>
            </div>
            
            {detail.startupWebsite && (
              <Link href={detail.startupWebsite} target="_blank" className="shrink-0">
                <button className="heading-font clip-hover relative inline-flex items-center justify-center overflow-hidden rounded-full cursor-pointer bg-white px-4 py-2 text-sm md:text-lg font-semibold text-purple-600 shadow-[0_0_25px_rgba(168,85,247,0.25)] transition-transform duration-300 hover:scale-110 hover:shadow-[0_0_35px_rgba(168,85,247,0.35)]">
                  <span className="relative z-10">Visit Website</span>
                  <div className="absolute inset-0 rounded-xl bg-linear-to-r from-purple-500 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </Link>
            )}
          </div>
          
          <p className="text-gray-300 mt-4 md:mt-2 text-sm md:text-base leading-relaxed">
            {detail.startupSummary}
          </p>
        </div>
      </div>
    </motion.div>

    {/* Overview Section */}
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUpVariants}
      transition={{ delay: 0.1 }}
      className="rounded-3xl bg-linear-to-br from-gray-900/40 to-gray-900/20 backdrop-blur-xl p-2 md:p-5 border border-gray-700/30 shadow-xl"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-purple-500/10 rounded-xl">
          <Eye className="w-6 h-6 md:w-7 md:h-7 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Startup Overview</h2>
          <div className="h-1 w-16 bg-linear-to-r from-purple-500 to-transparent rounded-full mt-1"></div>
        </div>
      </div>
      <div className="text-gray-300 leading-relaxed text-sm md:text-base space-y-3">
        {renderMarkdownText(detail.startupOverview, {
          lineClassName: 'text-sm md:text-base text-gray-300 leading-relaxed',
        })}
      </div>
    </motion.div>

    {/* Problem & Solution Section */}
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUpVariants}
      transition={{ delay: 0.2 }}
      className="rounded-3xl bg-linear-to-br from-gray-900/40 to-gray-900/20 backdrop-blur-xl p-2 md:p-5 border border-gray-700/30 shadow-xl"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-purple-500/10 rounded-xl">
          <Lightbulb className="w-6 h-6 md:w-7 md:h-7 text-purple-300" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Problem & Solution</h2>
          <div className="h-1 w-16 bg-linear-to-r from-purple-500 to-transparent rounded-full mt-1"></div>
        </div>
      </div>
      
      <div className="space-y-8">
        <section className="relative pl-2 md:pl-5">
          
          <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-300" />
            Problem
          </h3>
          <div className="text-gray-300 leading-relaxed text-sm md:text-base space-y-3">
            {renderMarkdownText(detail.startupProblemGap, {
              lineClassName: 'text-sm md:text-base text-gray-300 leading-relaxed',
            })}
          </div>
        </section>
        
        <section className="relative pl-2 md:pl-5">
          
          <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-300" />
            The Solution
          </h3>
          <div className="text-gray-300 leading-relaxed text-sm md:text-base space-y-3">
            {renderMarkdownText(detail.startup10xBetterment, {
              lineClassName: 'text-sm md:text-base text-gray-300 leading-relaxed',
            })}
          </div>
        </section>
      </div>
    </motion.div>

    {/* Future Vision Section */}
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUpVariants}
      transition={{ delay: 0.3 }}
      className="rounded-3xl bg-linear-to-br from-blue-900/20 via-gray-900/40 to-gray-900/20 backdrop-blur-xl p-2 md:p-5 border border-gray-700/30 shadow-xl"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-purple-500/10 rounded-xl">
          <Rocket className="w-6 h-6 md:w-7 md:h-7 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Future Vision</h2>
          <div className="h-1 w-16 bg-linear-to-r from-purple-500 to-transparent rounded-full mt-1"></div>
        </div>
      </div>
      <div className="text-gray-300 leading-relaxed text-sm md:text-base space-y-3">
        {renderMarkdownText(detail.futureGrowthVision, {
          lineClassName: 'text-sm md:text-base text-gray-300 leading-relaxed',
        })}
      </div>
    </motion.div>

    {/* Key Achievements Section */}
    {detail.keyAchievements.length > 0 && (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        transition={{ delay: 0.4 }}
        className="rounded-3xl bg-linear-to-br from-purple-900/15 via-gray-900/40 to-gray-900/20 backdrop-blur-xl p-2 md:p-5 border border-gray-700/30 shadow-xl"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-purple-500/10 rounded-xl">
            <Award className="w-6 h-6 md:w-7 md:h-7 text-purple-300" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Key Achievements</h2>
            <div className="h-1 w-16 bg-linear-to-r from-purple-500 to-transparent rounded-full mt-1"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {detail.keyAchievements.map((achievement, index) => (
            <div
              key={`${achievement.achievementSummary}-${index}`}
              className="group relative flex flex-col sm:flex-row gap-5 hover:border-blue-500/30 transition-all duration-300"
            >
              {achievement.achievementImage && (
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="relative w-full sm:w-40 h-48 sm:h-40 rounded-xl overflow-hidden shrink-0 ring-2 ring-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                    >
                      <ImageWithSkeleton
                        src={achievement.achievementImage}
                        alt="Achievement preview"
                        fill
                        className="object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="sr-only">Open achievement image</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent
                    className="bg-black p-4 border-none shadow-none w-full"
                    showCloseButton
                  >
                    <DialogTitle className="sr-only">Achievement image preview</DialogTitle>
                    <div className="relative w-full h-[60vh] md:h-[75vh] rounded-2xl overflow-hidden bg-black">
                      <ImageWithSkeleton
                        src={achievement.achievementImage}
                        alt="Achievement full preview"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 90vw, 60vw"
                        priority
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <div className="flex-1">
                <div className="text-gray-300 leading-relaxed text-sm md:text-base space-y-2">
                  {renderMarkdownText(achievement.achievementSummary, {
                    lineClassName: 'text-sm md:text-base text-gray-300 leading-relaxed',
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    )}
  </div>
);

export default LeftColumnSection;