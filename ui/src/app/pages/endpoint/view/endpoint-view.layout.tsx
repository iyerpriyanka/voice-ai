import { Endpoint, Tag } from '@rapidaai/react';
import { Helmet } from '@/app/components/app-shell/helmet';
import { EndpointInstructionDialog } from '@/app/components/dialogs/endpoint';
import { CreateTagDialog } from '@/app/components/dialogs/shared/create-tag-modal';
import { EndpointTag } from '@/app/components/domain/tags/endpoint-tags';
import { useRapidaStore } from '@/stores/app';
import { useEndpointPageStore } from '@/stores/endpoint';
import { useCredential } from '@/hooks/use-credential';
import { useCallback, useEffect } from 'react';
import toast from 'react-hot-toast/headless';
import { Outlet, useParams } from 'react-router-dom';
import { EndpointSideNav } from './endpoint-side-nav';

export function EndpointViewLayout() {
  const [userId, token, projectId] = useCredential();
  const { showLoader, hideLoader } = useRapidaStore();

  const {
    currentEndpoint,
    onChangeCurrentEndpoint,
    onChangeCurrentEndpointProviderModel,
    instructionVisible,
    onHideInstruction,
    currentEndpointProviderModel,
    editTagVisible,
    onHideEditTagVisible,
    onCreateEndpointTag,
    onGetEndpoint,
  } = useEndpointPageStore();

  const { endpointId, endpointProviderId } = useParams();

  const onError = useCallback(
    (err: string) => {
      hideLoader();
      toast.error(err);
    },
    [endpointId, endpointProviderId],
  );

  const onSuccess = useCallback(
    (data: Endpoint) => {
      onChangeCurrentEndpoint(data);
      const endpointProviderModel = data.getEndpointprovidermodel();
      if (endpointProviderModel) {
        onChangeCurrentEndpointProviderModel(endpointProviderModel);
      }
      hideLoader();
    },
    [endpointId, endpointProviderId],
  );

  const onReload = useCallback(() => {
    if (endpointId) {
      showLoader('overlay');
      onGetEndpoint(
        endpointId,
        endpointProviderId ? endpointProviderId : null,
        projectId,
        token,
        userId,
        onError,
        onSuccess,
      );
    }
  }, [endpointId, endpointProviderId]);

  useEffect(() => {
    onReload();
  }, [endpointId, endpointProviderId]);

  return (
    <div className="h-full flex flex-1 overflow-hidden">
      <EndpointInstructionDialog
        modalOpen={instructionVisible}
        setModalOpen={onHideInstruction}
        currentEndpoint={currentEndpoint}
        currentEndpointProviderModel={currentEndpointProviderModel}
      />
      <CreateTagDialog
        title="Edit tags"
        tags={currentEndpoint?.getEndpointtag()?.getTagList()}
        modalOpen={editTagVisible}
        allTags={EndpointTag}
        setModalOpen={onHideEditTagVisible}
        onCreateTag={(
          tags: string[],
          onError: (err: string) => void,
          onSuccess: (e: Tag) => void,
        ) => {
          let wId = currentEndpoint?.getId();
          if (!wId) {
            onError('Endpoint is undefined.');
            return;
          }
          onCreateEndpointTag(
            wId,
            tags,
            projectId,
            token,
            userId,
            onError,
            endpoint => {
              let tags = endpoint.getEndpointtag();
              if (tags) onSuccess(tags);
            },
          );
        }}
      />

      <Helmet title="Hosted endpoints" />

      {endpointId && <EndpointSideNav endpointId={endpointId} />}

      <div className="flex flex-col flex-1 overflow-auto">
        {currentEndpoint && endpointId ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <Outlet context={{ onReload }} />
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            <Outlet context={{ onReload }} />
          </div>
        )}
      </div>
    </div>
  );
}
