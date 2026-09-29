import { Endpoint, EndpointProviderModel } from '@rapidaai/react';
import { EndpointLogsPage } from '@/app/pages/endpoint/view/pages/logs-page';
import { EndpointOverviewPage } from '@/app/pages/endpoint/view/pages/overview-page';
import { EndpointVersionsPage } from '@/app/pages/endpoint/view/pages/versions-page';
import { EndpointSettingsPage } from '@/app/pages/endpoint/view/pages/settings-page';
import { Playground } from '@/app/pages/endpoint/view/try-playground';

export type EndpointDetailTabKey =
  | 'overview'
  | 'playground'
  | 'logs'
  | 'Traces'
  | 'settings'
  | 'versions';

export function EndpointDetailTabContent(props: {
  activeTab: string;
  currentEndpoint: Endpoint | null;
  currentEndpointProviderModel: EndpointProviderModel | null;
  onReload: () => void;
}) {
  const { activeTab, currentEndpoint, currentEndpointProviderModel, onReload } =
    props;

  if (!currentEndpoint || !currentEndpointProviderModel) return null;

  switch (activeTab) {
    case 'overview':
      return (
        <EndpointOverviewPage
          currentEndpoint={currentEndpoint}
          currentEndpointProviderModel={currentEndpointProviderModel}
        />
      );
    case 'playground':
      return (
        <Playground
          currentEndpoint={currentEndpoint}
          currentEndpointProviderModel={currentEndpointProviderModel}
        />
      );
    case 'logs':
    case 'Traces':
      return <EndpointLogsPage currentEndpoint={currentEndpoint} />;
    case 'versions':
      return (
        <EndpointVersionsPage
          currentEndpoint={currentEndpoint}
          onReload={onReload}
        />
      );
    case 'settings':
      return <EndpointSettingsPage currentEndpoint={currentEndpoint} />;
    default:
      return (
        <EndpointOverviewPage
          currentEndpoint={currentEndpoint}
          currentEndpointProviderModel={currentEndpointProviderModel}
        />
      );
  }
}
