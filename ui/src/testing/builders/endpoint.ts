type EndpointFixture = {
  id: string;
  name?: string;
  endpointProviderModelId?: string;
};

type EndpointProviderModelFixture = {
  id: string;
  endpointId: string;
  version: string;
  provider: string;
};

type EndpointLogFixture = {
  id: string;
  endpointId: string;
  endpointProviderModelId: string;
  source: string;
  status: string;
  timeTaken: string;
};

export const buildEndpoint = ({
  id,
  name = id,
  endpointProviderModelId = 'model-1',
}: EndpointFixture) =>
  ({
    getId: () => id,
    getName: () => name,
    getEndpointprovidermodelid: () => endpointProviderModelId,
  }) as any;

export const buildEndpointProviderModel = ({
  id,
  endpointId,
  version,
  provider,
}: EndpointProviderModelFixture) =>
  ({
    getId: () => id,
    getEndpointid: () => endpointId,
    getVersion: () => version,
    getProvider: () => provider,
  }) as any;

export const buildEndpointLog = ({
  id,
  endpointId,
  endpointProviderModelId,
  source,
  status,
  timeTaken,
}: EndpointLogFixture) =>
  ({
    getId: () => id,
    getEndpointid: () => endpointId,
    getEndpointprovidermodelid: () => endpointProviderModelId,
    getSource: () => source,
    getStatus: () => status,
    getTimetaken: () => timeTaken,
    getMetadataList: () => [],
    getOptionsList: () => [],
    getArgumentsList: () => [],
    getMetricsList: () => [],
  }) as any;
