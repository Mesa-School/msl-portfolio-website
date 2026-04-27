'use client';

import Link from 'next/link';
import { BarChart3, Linkedin, Instagram, Share2, Target, Twitter, Users } from 'lucide-react';
import { DM_Sans } from 'next/font/google';
import { motion, type Variants } from 'framer-motion';

import type { StartupDetail } from '@/types/startupDetail';
import { formatCurrency } from './helpers';
import ImageWithSkeleton from './ImageWithSkeleton';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const dmSans = DM_Sans({ subsets: ['latin'] });

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
};

type RightColumnSectionProps = {
  detail: StartupDetail;
};

const RightColumnSection = ({ detail }: RightColumnSectionProps) => (
  <div className={`sticky top-20 self-start space-y-6 ${dmSans.className}`}>
    {/* Revenue Section */}
    {detail.revenueStatus.currently_generating_revenue && detail.revenueStatus.revenueDetails && (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="relative rounded-3xl bg-msl-card to-transparent backdrop-blur-xl p-2 md:p-5 border border-gray-700/30 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-msl-accent/15 rounded-xl">
            <BarChart3 className="w-5 h-5 text-msl-accent" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">Revenue</h3>
            <div className="h-0.5 w-10 bg-linear-to-r from-msl-accent to-transparent rounded-full mt-1"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400">Total Revenue:</p>
            <p className="text-lg md:text-xl font-semibold text-white mt-1">
              {formatCurrency(detail.revenueStatus.revenueDetails.total_revenue)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Monthly Revenue:</p>
            <p className="text-lg md:text-xl font-semibold text-white mt-1">
              {formatCurrency(detail.revenueStatus.revenueDetails.monthly_revenue)}
            </p>
          </div>
        </div>
      </motion.div>
    )}

    {/* Founders Section */}
    {detail.founders.length > 0 && (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        transition={{ delay: 0.1 }}
        className="rounded-3xl bg-msl-card backdrop-blur-xl p-5 md:p-6 border border-gray-700/30 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-msl-accent/15 rounded-xl">
            <Users className="w-5 h-5 text-msl-accent" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
              {detail.founders.length > 1 ? 'Founders' : 'Founder'}
            </h3>
            <div className="h-0.5 w-10 bg-linear-to-r from-msl-accent to-transparent rounded-full mt-1"></div>
          </div>
        </div>
        <div className="space-y-4">
          {detail.founders.map((founder) => (
            <div
              key={founder.id}
              className="flex items-center gap-3"
            >
              {founder.founderProfilePic && (
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="relative bg-white w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-2 ring-white/10 shrink-0 shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-msl-accent"
                    >
                      <ImageWithSkeleton
                        src={founder.founderProfilePic}
                        alt={founder.name}
                        fill
                        className="object-cover hover:scale-125 transition-transform duration-300"
                      />
                      <span className="sr-only">Open founder details</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-black/95 border border-white/10 w-full max-w-2xl rounded-3xl space-y-6">
                    <DialogTitle className="text-white text-2xl font-semibold text-center">
                      Founder Details
                    </DialogTitle>
                    <div className="flex flex-col items-center text-center space-y-5">
                      <div className="relative w-full max-w-sm h-72 md:h-80 rounded-2xl overflow-hidden bg-black">
                        <ImageWithSkeleton
                          src={founder.founderProfilePic}
                          alt={`${founder.name} portrait`}
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                      <div className="flex flex-col gap-4 text-sm md:text-base text-gray-300 w-full max-w-sm">
                        <div>
                          <p className="text-2xl text-msl-accent/80">{founder.name}</p>
                          <p className="text-lg text-white">{founder.designation}</p>
                        </div>
                        {founder.email && (
                          <div>
                            <p className="text-xs uppercase tracking-wide text-purple-300/80">Email</p>
                            <a
                              href={`mailto:${founder.email}`}
                              className="text-white hover:text-msl-accent transition-colors"
                            >
                              {founder.email}
                            </a>
                          </div>
                        )}
                        {founder.linkedin && (
                          <Link
                            href={founder.linkedin}
                            target="_blank"
                            className="inline-flex items-center gap-2 mx-auto w-fit justify-center rounded-full px-4 py-2 text-sm font-medium text-white bg-msl-accent transition-colors"
                          >
                            <Linkedin className="w-4 h-4" />
                            <span>LinkedIn Profile</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white text-sm md:text-[1.25rem]">{founder.name}</h4>
                <p className="text-xs md:text-sm text-gray-400">{founder.designation}</p>
                {founder.linkedin && (
                  <Link
                    href={founder.linkedin}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-sm text-msl-accent hover:text-msl-accent transition-colors mt-1"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    )}

    {/* Competitors Section */}
    {detail.competitors && detail.competitors.length > 0 && (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        transition={{ delay: 0.2 }}
        className="rounded-3xl bg-msl-card backdrop-blur-xl p-5 md:p-6 border border-gray-700/30 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-msl-accent/10 rounded-xl">
            <Users className="w-5 h-5 text-msl-accent" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">Competitors</h3>
            <div className="h-0.5 w-10 bg-linear-to-r from-msl-accent to-transparent rounded-full mt-1"></div>
          </div>
        </div>
        <div className="space-y-3">
          {detail.competitors.map((competitor) => (
            <div
              key={competitor.id}
              className="flex items-center gap-3"
            >
              {competitor.competitor_image && (
                <div className="relative bg-white w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden ring-2 ring-white/10 shrink-0">
                  <ImageWithSkeleton
                    src={competitor.competitor_image}
                    alt={competitor.competitor_name}
                    fill
                    className="object-cover p-1"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white text-sm md:text-base">
                  {competitor.competitor_name}
                </h4>
                {competitor.competitor_website && (
                  <Link
                    href={competitor.competitor_website}
                    target="_blank"
                    className="text-xs text-white/70 transition-colors inline-flex items-center gap-1"
                  >
                    <span className="truncate">{competitor.competitor_website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    )}

    {/* Social Media Section */}
    {(detail.socialMediaLinks.instagram || detail.socialMediaLinks.linkedin || detail.socialMediaLinks.twitter) && (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        transition={{ delay: 0.3 }}
        className="rounded-3xl bg-msl-card backdrop-blur-xl p-5 md:p-6 border border-gray-700/30 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-msl-accent/15 rounded-xl">
            <Share2 className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">Connect</h3>
            <div className="h-0.5 w-10 bg-linear-to-r from-msl-accent to-transparent rounded-full mt-1"></div>
          </div>
        </div>
        <div className="flex gap-3">
          {detail.socialMediaLinks.instagram && (
            <Link
              href={detail.socialMediaLinks.instagram}
              target="_blank"
              className="group flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-purple-500/20 transition-all duration-300 hover:scale-105"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4 text-purple-200 group-hover:text-purple-100 transition-colors" />
            </Link>
          )}
          {detail.socialMediaLinks.linkedin && (
            <Link
              href={detail.socialMediaLinks.linkedin}
              target="_blank"
              className="group flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-blue-500/20 transition-all duration-300 hover:scale-105"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4 text-blue-200 group-hover:text-blue-100 transition-colors" />
            </Link>
          )}
          {detail.socialMediaLinks.twitter && (
            <Link
              href={detail.socialMediaLinks.twitter}
              target="_blank"
              className="group flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-blue-500/20 transition-all duration-300 hover:scale-105"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4 text-blue-200 group-hover:text-blue-100 transition-colors" />
            </Link>
          )}
        </div>
      </motion.div>
    )}
  </div>
);

export default RightColumnSection;