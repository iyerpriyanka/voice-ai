import { FC } from 'react';
import { PageLoader } from '@/app/components/ui/feedback';
import { useOAuthCallback } from '@/hooks/use-oauth-callback';
import { connectActionProvider } from '@/clients';

export const ConnectSharePointActionPage: FC = () => {
  useOAuthCallback(
    connectActionProvider,
    'share-point',
    'Unable to connect share-point, please try again later.',
  );
  return <PageLoader />;
};
