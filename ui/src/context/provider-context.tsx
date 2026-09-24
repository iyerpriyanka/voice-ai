import { createContext, useContext } from 'use-context-selector';
import { useCallback, useEffect, useState } from 'react';
import { ServiceError } from '@rapidaai/react';
import {
  GetAllOrganizationCredentialResponse,
  VaultCredential,
} from '@rapidaai/react';

import {
  LOCAL_STORAGE_PROVIDER_CREDENTIALS,
  serializeProto,
  useLocalStorageSync,
} from '@/hooks/use-storage-sync';
import { useCurrentCredential } from '@/hooks/use-credential';
import { listOrganizationCredentials } from '@/clients';

const ProviderContext = createContext<{
  providerCredentials: VaultCredential[];
  reloadProviderCredentials: () => void;
}>({
  providerCredentials: [],
  reloadProviderCredentials: () => {
    throw new Error('Function not implemented.');
  },
});

export const useProviderContext = () => useContext(ProviderContext);
type ProviderContextProviderProps = {
  children: React.ReactNode;
};

export const ProviderContextProvider = ({
  children,
}: ProviderContextProviderProps) => {
  const [providerCredentials, setProviderCredentials] = useState<
    VaultCredential[]
  >([]);
  const { authId, projectId, token } = useCurrentCredential();
  useLocalStorageSync(
    LOCAL_STORAGE_PROVIDER_CREDENTIALS,
    setProviderCredentials,
    VaultCredential,
  );

  /**
   *
   */
  useEffect(() => {
    if (token && authId && projectId) {
      getAllOrganizationCredential();
    }
  }, [token, authId, projectId]);

  /**
   * after getting all the credentials to store in the local storage
   */
  const afterGettingAllCredential = useCallback(
    (
      err: ServiceError | null,
      gapcr: GetAllOrganizationCredentialResponse | null,
    ) => {
      if (gapcr?.getSuccess()) {
        const credentials = gapcr.getDataList();
        setProviderCredentials(credentials);
        localStorage.setItem(
          LOCAL_STORAGE_PROVIDER_CREDENTIALS,
          JSON.stringify(
            credentials.map((cred: any) => Array.from(serializeProto(cred))),
          ),
        );
      }
    },
    [],
  );

  /**
   * gettung all the organization
   */
  const getAllOrganizationCredential = () => {
    listOrganizationCredentials({
      page: 1,
      pageSize: 100,
      criteria: [],
      auth: { token, userId: authId, projectId },
      callback: afterGettingAllCredential,
    });
  };

  /**
   * reload provider credentials
   */
  const reloadProviderCredentials = () => {
    getAllOrganizationCredential();
  };

  return (
    <ProviderContext.Provider
      value={{
        providerCredentials,
        reloadProviderCredentials,
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
};
