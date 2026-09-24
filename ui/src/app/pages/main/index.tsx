import { lazyLoad } from '@/utils/loadable';
import { PageLoader } from '@/app/components/ui/feedback';

export const DashboardHomePage = lazyLoad(
  () => import('./web-dashboard/index.tsx'),
  module => module.HomePage,
  {
    fallback: <PageLoader />,
  },
);
