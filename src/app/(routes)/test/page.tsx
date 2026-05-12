import startupDataRaw from '@/data/bloc.json';
import {
  PortfolioDetailRevamp,
  type StartupData,
} from '@/components/portfoliodetailed-revamp';

const startupData = startupDataRaw as unknown as StartupData;

const TestPage = () => <PortfolioDetailRevamp data={startupData} />;

export default TestPage;
