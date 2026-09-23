import {
  createEndpointCacheConfiguration,
  createEndpointRetryConfiguration,
  createEndpointTag,
  getEndpoint,
  listEndpoints,
  updateEndpointDetail,
} from '@/clients';

import {
  initialEndpointType,
  useEndpointPageStore,
} from '@/stores/endpoint/endpoint.store';
import endpointsFixture from '@/testing/fixtures/endpoint/endpoints.json';
import { buildEndpoint } from '@/testing/builders/endpoint';

jest.mock('@/clients', () => ({
  createEndpointCacheConfiguration: jest.fn(),
  createEndpointRetryConfiguration: jest.fn(),
  createEndpointTag: jest.fn(),
  getEndpoint: jest.fn(),
  listEndpoints: jest.fn(),
  updateEndpointDetail: jest.fn(),
}));

const defaultColumns = useEndpointPageStore.getState().columns;

const resetStore = () => {
  useEndpointPageStore.setState({
    ...initialEndpointType,
    columns: defaultColumns,
    page: 1,
    pageSize: 20,
    totalCount: 0,
    criteria: [],
  });
};

const [endpointFixture1, endpointFixture2] = endpointsFixture.items;

const makeEndpoint = (id: string) => {
  const fixture = endpointsFixture.items.find(endpoint => endpoint.id === id);

  return buildEndpoint({
    id,
    name: fixture?.name,
    endpointProviderModelId: fixture?.version,
  });
};

describe('useEndpointPageStore', () => {
  beforeEach(() => {
    resetStore();
    (listEndpoints as jest.Mock).mockReset();
    (getEndpoint as jest.Mock).mockReset();
    (createEndpointTag as jest.Mock).mockReset();
    (createEndpointRetryConfiguration as jest.Mock).mockReset();
    (createEndpointCacheConfiguration as jest.Mock).mockReset();
    (updateEndpointDetail as jest.Mock).mockReset();
  });

  it('adds, merges, and removes criteria correctly', () => {
    const state = useEndpointPageStore.getState();

    state.addCriteria('status', 'active', 'and');
    state.addCriteria('status', 'paused', 'and');
    state.addCriteria('owner', 'u-1', 'or');

    expect(useEndpointPageStore.getState().criteria).toEqual([
      { key: 'status', value: 'paused', logic: 'and' },
      { key: 'owner', value: 'u-1', logic: 'or' },
    ]);

    state.addCriterias([
      { k: 'status', v: 'ready', logic: 'and' },
      { k: 'model', v: 'gpt-5', logic: 'and' },
    ]);

    expect(useEndpointPageStore.getState().criteria).toEqual([
      { key: 'owner', value: 'u-1', logic: 'or' },
      { key: 'status', value: 'ready', logic: 'and' },
      { key: 'model', value: 'gpt-5', logic: 'and' },
    ]);

    state.removeCriteria('status');
    expect(useEndpointPageStore.getState().criteria).toEqual([
      { key: 'owner', value: 'u-1', logic: 'or' },
      { key: 'model', value: 'gpt-5', logic: 'and' },
    ]);
  });

  it('reloads endpoint to first position and sets current endpoint', () => {
    const endpoint1 = makeEndpoint('e-1');
    const endpoint2 = makeEndpoint('e-2');
    const endpoint2Updated = makeEndpoint('e-2');

    useEndpointPageStore.setState({ endpoints: [endpoint1, endpoint2] });

    useEndpointPageStore.getState().onReloadEndpoint(endpoint2Updated);

    expect(useEndpointPageStore.getState().endpoints).toEqual([
      endpoint2Updated,
      endpoint1,
    ]);
    expect(useEndpointPageStore.getState().currentEndpoint).toBe(
      endpoint2Updated,
    );
  });

  it('handles successful onGetAllEndpoint response', () => {
    const endpoint = buildEndpoint(endpointFixture1);
    const onError = jest.fn();
    const onSuccess = jest.fn();

    (listEndpoints as jest.Mock).mockImplementation(({ callback }) => {
      callback(null, {
        getSuccess: () => true,
        getDataList: () => [endpoint],
        getPaginated: () => ({
          getTotalitem: () => endpointsFixture.totalCount,
        }),
      });
    });

    useEndpointPageStore
      .getState()
      .onGetAllEndpoint('project-1', 'token-1', 'user-1', onError, onSuccess);

    expect(onSuccess).toHaveBeenCalledWith([endpoint]);
    expect(onError).not.toHaveBeenCalled();
    expect(useEndpointPageStore.getState().endpoints).toEqual([endpoint]);
    expect(useEndpointPageStore.getState().totalCount).toBe(
      endpointsFixture.totalCount,
    );
    expect(listEndpoints).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
        pageSize: 20,
        criteria: [],
        auth: {
          projectId: 'project-1',
          token: 'token-1',
          userId: 'user-1',
        },
      }),
    );
  });

  it('uses human-readable error from onGetAllEndpoint response', () => {
    const onError = jest.fn();
    const onSuccess = jest.fn();

    (listEndpoints as jest.Mock).mockImplementation(({ callback }) => {
      callback(null, {
        getSuccess: () => false,
        getError: () => ({ getHumanmessage: () => 'explicit endpoint error' }),
      });
    });

    useEndpointPageStore
      .getState()
      .onGetAllEndpoint('project-1', 'token-1', 'user-1', onError, onSuccess);

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith('explicit endpoint error');
  });

  it('uses fallback error when onGetAllEndpoint has no error object', () => {
    const onError = jest.fn();

    (listEndpoints as jest.Mock).mockImplementation(({ callback }) => {
      callback(null, {
        getSuccess: () => false,
        getError: () => null,
      });
    });

    useEndpointPageStore
      .getState()
      .onGetAllEndpoint('project-1', 'token-1', 'user-1', onError, jest.fn());

    expect(onError).toHaveBeenCalledWith(
      'Something went wrong while retrieving your endpoints. Please refresh the page or try again later.',
    );
  });

  it('handles successful onGetEndpoint response', () => {
    const endpoint = buildEndpoint(endpointFixture2);
    const onError = jest.fn();
    const onSuccess = jest.fn();

    (getEndpoint as jest.Mock).mockImplementation(({ callback }) => {
      callback(null, {
        getSuccess: () => true,
        getData: () => endpoint,
      });
    });

    useEndpointPageStore
      .getState()
      .onGetEndpoint(
        'endpoint-2',
        null,
        'project-1',
        'token-1',
        'user-1',
        onError,
        onSuccess,
      );

    expect(onSuccess).toHaveBeenCalledWith(endpoint);
    expect(onError).not.toHaveBeenCalled();
    expect(useEndpointPageStore.getState().currentEndpoint).toBe(endpoint);
    expect(getEndpoint).toHaveBeenCalledWith(
      expect.objectContaining({
        endpointId: 'endpoint-2',
        endpointProviderModelId: null,
        auth: {
          projectId: 'project-1',
          token: 'token-1',
          userId: 'user-1',
        },
      }),
    );
  });

  it('uses fallback error when onGetEndpoint fails without error object', () => {
    const onError = jest.fn();

    (getEndpoint as jest.Mock).mockImplementation(({ callback }) => {
      callback(null, {
        getSuccess: () => false,
        getError: () => null,
      });
    });

    useEndpointPageStore
      .getState()
      .onGetEndpoint(
        'endpoint-2',
        null,
        'project-1',
        'token-1',
        'user-1',
        onError,
        jest.fn(),
      );

    expect(onError).toHaveBeenCalledWith(
      'Unable to get your endpoint, please try again later.',
    );
  });
});
