import { FC } from 'react';
import { PageLoader } from '@/app/components/ui/feedback';
import { useOAuthCallback } from '@/hooks/use-oauth-callback';
import { connectGeneralProvider } from '@/clients';

export const ConnectHubspotCRMPage: FC = () => {
  useOAuthCallback(
    connectGeneralProvider,
    'hubspot',
    'Unable to connect hubspot, please try again later.',
  );

  return <PageLoader />;
};
