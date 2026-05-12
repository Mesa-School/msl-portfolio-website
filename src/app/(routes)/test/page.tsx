import type { Metadata } from 'next';

import startupDataRaw from '@/data/bloc.json';
import {
  PortfolioDetailRevamp,
  type StartupData,
} from '@/components/portfoliodetailed-revamp';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const startupData = startupDataRaw as unknown as StartupData;

const TestPage = () => <PortfolioDetailRevamp data={startupData} />;

export default TestPage;
