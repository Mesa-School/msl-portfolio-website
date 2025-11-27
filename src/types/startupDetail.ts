export interface StartupDetail {
  id: number;
  documentId: string;
  startupName: string;
  name: string;
  startupSummary: string;
  startupOverview: string;
  startupProblemGap: string;
  location: string;
  startupWebsite: string;
  keyProgress: string;
  competitors: Array<{
    company_name: string;
    company_logo?: {
      url?: string;
    };
    company_website?: string;
  }>;
  startup10xBetterment: string;
  futureGrowthVision: string;
  cohort: string;
  sector: {
    name: string;
    description?: string;
  };
  companyLogo: string;
  companyHeader: string;
  socialMediaLinks: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  revenueStatus: {
    isRevenue: boolean;
    revenue: string;
    currentRevenue: string;
  };
  founders: Array<{
    name: string;
    designation: string;
    linkedinUrl: string;
    email?: string;
    profileImage: string;
  }>;
  keyAchievements: Array<{
    achievementSummary: string;
    achievementImage: string;
  }>;
}

