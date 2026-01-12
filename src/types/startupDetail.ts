export interface StartupDetail {
  id: string;
  slug: string;
  startupName: string;
  name: string;
  startupSummary: string;
  startupOverview: string;
  startupProblemGap: string;
  location: string;
  startupWebsite: string;
  keyProgress: string;
  competitors: Array<{
    id: number;
    competitor_name: string;
    competitor_image: string | null;
    competitor_website: string | null;
  }>;
  startup10xBetterment: string;
  futureGrowthVision: string;
  cohort: string;
  sector: {
    name: string;
  };
  companyLogo: string;
  companyHeaderImage: string;
  socialMediaLinks: {
    instagram?: string | null;
    linkedin?: string | null;
    twitter?: string | null;
    facebook?: string | null;
  };
  revenueStatus: {
    isGeneratingRevenue: boolean;
    revenueDetails: string | null;
  };
  founders: Array<{
    id: number;
    name: string;
    designation: string;
    linkedin: string;
    email: string | null;
    bio: string;
    founderProfilePic: string;
  }>;
  keyAchievements: Array<{
    id: number;
    title: string;
    description: string;
    achievementImage: string;
  }>;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

