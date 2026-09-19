import { lazyLoad } from '@/utils/loadable';
import { LineLoader } from '@/app/components/ui/feedback/loaders/line-loader';

export const AccountSettingPage = lazyLoad(
  () => import('./account-setting'),
  module => module.AccountSettingPage,
  {
    fallback: <LineLoader />,
  },
);
