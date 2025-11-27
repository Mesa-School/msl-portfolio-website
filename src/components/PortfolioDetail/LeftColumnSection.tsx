'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Award, Eye, Lightbulb, MapPin, Rocket, Target } from 'lucide-react';
import { DM_Sans } from 'next/font/google';

import type { StartupDetail } from '@/types/startupDetail';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { renderMarkdownText } from './helpers';

const dmSans = DM_Sans({ subsets: ['latin'] });

type LeftColumnSectionProps = {
  detail: StartupDetail;
};

const LeftColumnSection = ({ detail }: LeftColumnSectionProps) => (
  <div className={`lg:col-span-2 space-y-8 ${dmSans.className}`}>
    {/* Hero Section with Company Info */}
    <div className="relative rounded-3xl bg-linear-to-br from-purple-900/20 via-gray-900/40 to-gray-900/20 backdrop-blur-xl p-2 md:p-5 border border-gray-700/30 shadow-2xl overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative flex flex-col md:flex-row items-start gap-6 md:gap-8">
        {detail.companyLogo && (
          <div className="relative bg-white w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden ring-4 ring-white/10 shadow-xl shrink-0">
            <Image
              src={detail.companyLogo}
              alt={detail.startupName}
              fill
              className="object-cover p-2"
            />
          </div>
        )}
        
        <div className="flex-1 w-full">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-3 text-white tracking-tight leading-tight">
                {detail.startupName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm md:text-base text-purple-200/90">
                <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <MapPin className="w-4 h-4" />
                  {detail.location}
                </span>
              </div>
            </div>
            
            {detail.startupWebsite && (
              <Link href={detail.startupWebsite} target="_blank" className="shrink-0">
                <button className="group relative px-6 py-3 md:px-8 md:py-3.5 bg-linear-to-r from-purple-600 to-purple-500 rounded-xl text-white font-semibold text-sm md:text-base shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 active:scale-95">
                  <span className="relative z-10">Visit Website</span>
                  <div className="absolute inset-0 rounded-xl bg-linear-to-r from-purple-500 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </Link>
            )}
          </div>
          
          <p className="text-gray-300 mt-5 text-sm md:text-base leading-relaxed">
            {detail.startupSummary}
          </p>
        </div>
      </div>
    </div>

    {/* Overview Section */}
    <div className="rounded-3xl bg-linear-to-br from-gray-900/40 to-gray-900/20 backdrop-blur-xl p-2 md:p-5 border border-gray-700/30 shadow-xl">
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
    </div>

    {/* Problem & Solution Section */}
    <div className="rounded-3xl bg-linear-to-br from-gray-900/40 to-gray-900/20 backdrop-blur-xl p-2 md:p-5 border border-gray-700/30 shadow-xl">
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
          {/* <div className="absolute -left-[13px] top-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          </div> */}
          <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-300" />
            The Problem
          </h3>
          <div className="text-gray-300 leading-relaxed text-sm md:text-base space-y-3">
            {renderMarkdownText(detail.startupProblemGap, {
              lineClassName: 'text-sm md:text-base text-gray-300 leading-relaxed',
            })}
          </div>
        </section>
        
        <section className="relative pl-2 md:pl-5">
          {/* <div className="absolute -left-[13px] top-0 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          </div> */}
          <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-300" />
            What we are solving
          </h3>
          <div className="text-gray-300 leading-relaxed text-sm md:text-base space-y-3">
            {renderMarkdownText(detail.startup10xBetterment, {
              lineClassName: 'text-sm md:text-base text-gray-300 leading-relaxed',
            })}
          </div>
        </section>
      </div>
    </div>

    {/* Future Vision Section */}
    <div className="rounded-3xl bg-linear-to-br from-blue-900/20 via-gray-900/40 to-gray-900/20 backdrop-blur-xl p-2 md:p-5 border border-gray-700/30 shadow-xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-blue-500/10 rounded-xl">
          <Rocket className="w-6 h-6 md:w-7 md:h-7 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Future Vision</h2>
          <div className="h-1 w-16 bg-linear-to-r from-blue-500 to-transparent rounded-full mt-1"></div>
        </div>
      </div>
      <div className="text-gray-300 leading-relaxed text-sm md:text-base space-y-3">
        {renderMarkdownText(detail.futureGrowthVision, {
          lineClassName: 'text-sm md:text-base text-gray-300 leading-relaxed',
        })}
      </div>
    </div>

    {/* Key Achievements Section */}
    {detail.keyAchievements.length > 0 && (
      <div className="rounded-3xl bg-linear-to-br from-blue-900/15 via-gray-900/40 to-gray-900/20 backdrop-blur-xl p-2 md:p-5 border border-gray-700/30 shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-500/10 rounded-xl">
            <Award className="w-6 h-6 md:w-7 md:h-7 text-blue-300" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Key Achievements</h2>
            <div className="h-1 w-16 bg-linear-to-r from-blue-500 to-transparent rounded-full mt-1"></div>
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
                      <Image
                        src={achievement.achievementImage}
                        alt="Achievement preview"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="sr-only">Open achievement image</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent
                    className="bg-transparent border-none shadow-none p-0 max-w-5xl w-[92vw]"
                    showCloseButton
                  >
                    <DialogTitle className="sr-only">Achievement image preview</DialogTitle>
                    <div className="relative w-full h-[60vh] md:h-[75vh] rounded-2xl overflow-hidden bg-black">
                      <Image
                        src={achievement.achievementImage}
                        alt="Achievement full preview"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 90vw, 60vw"
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
      </div>
    )}
  </div>
);

export default LeftColumnSection;