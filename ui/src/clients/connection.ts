import { connectionConfig } from '@/configs';

export type ApiAuth = {
  projectId: string;
  token: string;
  userId: string;
};

export type ApiMetadata = {
  authorization: string;
  'x-project-id': string;
  'x-auth-id': string;
};

export const createApiMetadata = ({
  projectId,
  token,
  userId,
}: ApiAuth): ApiMetadata => ({
  authorization: token,
  'x-project-id': projectId,
  'x-auth-id': userId,
});

type ConnectedApiFunction = (
  config: typeof connectionConfig,
  ...args: any[]
) => any;

type ConnectedApiArgs<T extends ConnectedApiFunction> = T extends (
  config: typeof connectionConfig,
  ...args: infer TArgs
) => any
  ? TArgs
  : never;

export const withConnection = <T extends ConnectedApiFunction>(
  request: T,
): ((...args: ConnectedApiArgs<T>) => ReturnType<T>) =>
  ((...args: ConnectedApiArgs<T>) => request(connectionConfig, ...args)) as (
    ...args: ConnectedApiArgs<T>
  ) => ReturnType<T>;
