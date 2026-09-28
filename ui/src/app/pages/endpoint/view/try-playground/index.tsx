import { Helmet } from '@/app/components/app-shell/helmet';
import { TryChatComplete } from '@/app/pages/endpoint/view/try-playground/experiment-prompt/try-chat-complete';
import { Endpoint, EndpointProviderModel } from '@rapidaai/react';

export function Playground(props: {
  currentEndpoint: Endpoint;
  currentEndpointProviderModel: EndpointProviderModel;
}) {
  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Helmet title={`${props.currentEndpoint.getName()} playground`} />
      <TryChatComplete
        currentEndpoint={props.currentEndpoint}
        endpointProviderModel={props.currentEndpointProviderModel}
      />
    </main>
  );
}
