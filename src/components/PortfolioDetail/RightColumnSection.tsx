import Image from 'next/image';
import Link from 'next/link';
import { BarChart3, Linkedin, Instagram, Share2, Target, TrendingUp, Users } from 'lucide-react';
import { DM_Sans } from 'next/font/google';

import type { StartupDetail } from '@/types/startupDetail';
import { formatCurrency, renderMarkdownText } from './helpers';

const dmSans = DM_Sans({ subsets: ['latin'] });

type RightColumnSectionProps = {
  detail: StartupDetail;
};

const RightColumnSection = ({ detail }: RightColumnSectionProps) => (
  <div className={`space-y-6 ${dmSans.className}`}>
    {/* Revenue Section */}
    {detail.revenueStatus.isRevenue && (
      <div className="rounded-3xl bg-gradient-to-br from-emerald-900/20 via-gray-900/40 to-gray-900/20 backdrop-blur-xl p-5 md:p-6 border border-gray-700/30 shadow-xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-emerald-500/10 rounded-xl">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">Revenue</h3>
            <div className="h-0.5 w-10 bg-gradient-to-r from-emerald-500 to-transparent rounded-full mt-1"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-emerald-300/70 mb-1">Total Revenue</p>
            <p className="text-xl md:text-2xl font-bold text-white">
              {formatCurrency(detail.revenueStatus.revenue)}
            </p>
          </div>
          <div>
            <p className="text-xs text-emerald-300/70 mb-1">Monthly Revenue</p>
            <p className="text-lg md:text-xl font-bold text-white">
              {formatCurrency(detail.revenueStatus.currentRevenue)}
            </p>
          </div>
        </div>
      </div>
    )}

    {/* Key Progress Section */}
    <div className="rounded-3xl bg-gradient-to-br from-blue-900/20 via-gray-900/40 to-gray-900/20 backdrop-blur-xl p-5 md:p-6 border border-gray-700/30 shadow-xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-blue-500/10 rounded-xl">
          <TrendingUp className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">Key Progress</h3>
          <div className="h-0.5 w-10 bg-gradient-to-r from-blue-500 to-transparent rounded-full mt-1"></div>
        </div>
      </div>
      <div className="text-gray-300 text-xs md:text-sm leading-relaxed space-y-2">
        {renderMarkdownText(detail.keyProgress, {
          lineClassName: 'text-xs md:text-sm text-gray-300 leading-relaxed',
        })}
      </div>
    </div>

    {/* Founders Section */}
    {detail.founders.length > 0 && (
      <div className="rounded-3xl bg-gradient-to-br from-purple-900/20 via-gray-900/40 to-gray-900/20 backdrop-blur-xl p-5 md:p-6 border border-gray-700/30 shadow-xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-purple-500/10 rounded-xl">
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
              {detail.founders.length > 1 ? 'Founders' : 'Founder'}
            </h3>
            <div className="h-0.5 w-10 bg-gradient-to-r from-purple-500 to-transparent rounded-full mt-1"></div>
          </div>
        </div>
        <div className="space-y-4">
          {detail.founders.map((founder, index) => (
            <div 
              key={`${founder.name}-${index}`} 
              className="flex items-center gap-3"
            >
              {founder.profileImage && (
                <div className="relative bg-white w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden ring-2 ring-white/10 shrink-0 shadow-lg">
                  <Image 
                    src={founder.profileImage} 
                    alt={founder.name} 
                    fill 
                    className="object-cover" 
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white text-sm md:text-base">{founder.name}</h4>
                <p className="text-xs md:text-sm text-gray-400">{founder.designation}</p>
                {founder.linkedinUrl && (
                  <Link
                    href={founder.linkedinUrl}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors mt-1"
                  >
                    <Linkedin className="w-3 h-3" />
                    <span>LinkedIn</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Competition Section */}
    {detail.competitors && detail.competitors.length > 0 && (
      <div className="rounded-3xl bg-gradient-to-br from-orange-900/20 via-gray-900/40 to-gray-900/20 backdrop-blur-xl p-5 md:p-6 border border-gray-700/30 shadow-xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-orange-500/10 rounded-xl">
            <Target className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">Competition</h3>
            <div className="h-0.5 w-10 bg-gradient-to-r from-orange-500 to-transparent rounded-full mt-1"></div>
          </div>
        </div>
        <div className="space-y-3">
          {detail.competitors.map((competitor, index) => (
            <div 
              key={`${competitor.company_name}-${index}`}
              className="flex items-center gap-3"
            >
              {competitor.company_logo?.url && (
                <div className="relative bg-white w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden ring-2 ring-white/10 shrink-0">
                  <Image
                    src={competitor.company_logo.url}
                    alt={competitor.company_name}
                    fill
                    className="object-cover p-1"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white text-sm md:text-base">
                  {competitor.company_name}
                </h4>
                {competitor.company_website && (
                  <Link
                    href={competitor.company_website}
                    target="_blank"
                    className="text-xs text-orange-400 hover:text-orange-300 transition-colors inline-flex items-center gap-1"
                  >
                    <span className="truncate">{competitor.company_website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Social Media Section */}
    {(detail.socialMediaLinks.instagram || detail.socialMediaLinks.linkedin) && (
      <div className="rounded-3xl bg-gradient-to-br from-pink-900/20 via-gray-900/40 to-gray-900/20 backdrop-blur-xl p-5 md:p-6 border border-gray-700/30 shadow-xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-pink-500/10 rounded-xl">
            <Share2 className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">Connect</h3>
            <div className="h-0.5 w-10 bg-gradient-to-r from-pink-500 to-transparent rounded-full mt-1"></div>
          </div>
        </div>
        <div className="flex gap-3">
          {detail.socialMediaLinks.instagram && (
            <Link
              href={detail.socialMediaLinks.instagram}
              target="_blank"
              className="group flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-pink-600/20 to-purple-600/20 hover:from-pink-600/30 hover:to-purple-600/30 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 hover:scale-105"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 md:w-6 md:h-6 text-pink-400 group-hover:text-pink-300 transition-colors" />
            </Link>
          )}
          {detail.socialMediaLinks.linkedin && (
            <Link
              href={detail.socialMediaLinks.linkedin}
              target="_blank"
              className="group flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-500/20 hover:from-blue-600/30 hover:to-blue-500/30 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-105"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 md:w-6 md:h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
            </Link>
          )}
        </div>
      </div>
    )}
  </div>
);

export default RightColumnSection;