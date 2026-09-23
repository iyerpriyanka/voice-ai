import { ConnectionConfig, GetAllUser } from '@rapidaai/react';

import { listUsers } from '@/clients';

jest.mock('@/configs', () => ({
  connectionConfig: { endpoint: 'test-endpoint' },
}));

jest.mock('@rapidaai/react', () => ({
  ConnectionConfig: {
    WithDebugger: jest.fn(metadata => ({ debugger: metadata })),
  },
  GetAllUser: jest.fn(),
  GetNotificationSetting: jest.fn(),
  GetUser: jest.fn(),
  UpdateNotificationSetting: jest.fn(),
  UpdateUser: jest.fn(),
}));

describe('user client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lists users with pagination, criteria, and debugger metadata', () => {
    const callback = jest.fn();
    const criteria = [{ key: 'email', value: 'p_iyer', logic: 'contains' }];

    listUsers({
      page: 2,
      pageSize: 25,
      criteria,
      auth: {
        projectId: 'project-1',
        token: 'token-1',
        userId: 'user-1',
      },
      callback,
    });

    const metadata = (ConnectionConfig.WithDebugger as jest.Mock).mock
      .results[0].value;
    expect(GetAllUser).toHaveBeenCalledWith(
      { endpoint: 'test-endpoint' },
      2,
      25,
      criteria,
      callback,
      metadata,
    );
    expect(ConnectionConfig.WithDebugger).toHaveBeenCalledWith({
      authorization: 'token-1',
      userId: 'user-1',
      projectId: 'project-1',
    });
  });
});
