import type { Knowledge } from '@rapidaai/react';
import { useCredential } from '@/hooks/use-credential';
import { useKnowledgePageStore } from '@/stores/knowledge/knowledge.store';
import { Launch, Renew } from '@carbon/icons-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast/headless';
import { Dropdown, Button } from '@carbon/react';
import { cn } from '@/utils';

interface KnowledgeDropdownProps {
  className?: string;
  currentKnowledge?: string;
  onChangeKnowledge?: (k: Knowledge) => void;
}

interface KnowledgeDropdownViewProps extends KnowledgeDropdownProps {
  isLoading?: boolean;
  knowledgeBases: Knowledge[];
  onCreateKnowledge: () => void;
  onRefresh: () => void;
}

export function KnowledgeDropdownView({
  className,
  currentKnowledge,
  isLoading = false,
  knowledgeBases,
  onChangeKnowledge,
  onCreateKnowledge,
  onRefresh,
}: KnowledgeDropdownViewProps) {
  const selectedItem =
    knowledgeBases.find(knowledge => knowledge.getId() === currentKnowledge) ||
    null;

  return (
    <div className={cn(className)}>
      <div className="flex">
        <div className="flex-1 [&_.cds--dropdown]:!rounded-none [&_.cds--list-box]:!rounded-none">
          <Dropdown
            id="knowledge-dropdown"
            titleText="Knowledge"
            label="Select knowledge"
            items={knowledgeBases}
            selectedItem={selectedItem}
            disabled={isLoading}
            itemToString={(item: Knowledge | null) =>
              item ? `${item.getName()} [${item.getId()}]` : ''
            }
            onChange={({ selectedItem }) => {
              if (selectedItem) {
                onChangeKnowledge?.(selectedItem);
              }
            }}
          />
        </div>
        <Button
          hasIconOnly
          renderIcon={Renew}
          iconDescription="Refresh knowledge"
          kind="ghost"
          size="md"
          disabled={isLoading}
          onClick={onRefresh}
          className="!rounded-none !border !border-l-0 !border-gray-200 dark:!border-gray-700"
        />
        <Button
          hasIconOnly
          renderIcon={Launch}
          iconDescription="Create knowledge"
          kind="ghost"
          size="md"
          onClick={onCreateKnowledge}
          className="!rounded-none !border !border-l-0 !border-gray-200 dark:!border-gray-700"
        />
      </div>
    </div>
  );
}

export function KnowledgeDropdown(props: KnowledgeDropdownProps) {
  const [userId, token, projectId] = useCredential();
  const knowledgeActions = useKnowledgePageStore();
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  const onError = useCallback((err: string) => {
    hideLoader();
    toast.error(err);
  }, []);

  const onSuccess = useCallback((data: Knowledge[]) => {
    hideLoader();
  }, []);

  const getKnowledges = useCallback((projectId, token, userId) => {
    showLoader();
    knowledgeActions.getAllKnowledge(
      projectId,
      token,
      userId,
      onError,
      onSuccess,
    );
  }, []);

  useEffect(() => {
    if (props.currentKnowledge) {
      knowledgeActions.addCriteria('id', props.currentKnowledge, 'or');
    }
    getKnowledges(projectId, token, userId);
  }, [
    projectId,
    knowledgeActions.page,
    knowledgeActions.pageSize,
    JSON.stringify(knowledgeActions.criteria),
    props.currentKnowledge,
  ]);

  return (
    <KnowledgeDropdownView
      className={props.className}
      currentKnowledge={props.currentKnowledge}
      isLoading={isLoading}
      knowledgeBases={knowledgeActions.knowledgeBases}
      onChangeKnowledge={props.onChangeKnowledge}
      onRefresh={() => getKnowledges(projectId, token, userId)}
      onCreateKnowledge={() =>
        window.open('/knowledge/create-knowledge', '_blank')
      }
    />
  );
}
