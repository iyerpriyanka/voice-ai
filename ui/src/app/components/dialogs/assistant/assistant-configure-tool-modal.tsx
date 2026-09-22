import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { CONFIG } from '@/configs';
import {
  BuildinTool,
  BuildinToolConfig,
  GetDefaultToolConfigIfInvalid,
  GetDefaultToolDefintion,
  ValidateToolDefaultOptions,
} from '@/app/components/domain/tools/tool-registry';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  type ModalProps,
  PrimaryButton,
  SecondaryButton,
} from '@/app/components/ui/primitives';
import { Notification } from '@/app/components/ui/feedback';

interface ConfigureAssistantToolDialogProps extends ModalProps {
  initialData: {
    name: string;
    description: string;
    fields: string;
    buildinToolConfig: BuildinToolConfig;
  } | null;
  onChange?: (data: {
    name: string;
    description: string;
    fields: string;
    buildinToolConfig: BuildinToolConfig;
  }) => void;
  onValidateConfig?: (data: {
    name: string;
    description: string;
    fields: string;
    buildinToolConfig: BuildinToolConfig;
  }) => string | null; // Return error message or null if valid
}

export function ConfigureAssistantToolDialog({
  modalOpen,
  setModalOpen,
  initialData,
  onChange,
  onValidateConfig,
}: ConfigureAssistantToolDialogProps) {
  const defaultToolCode = useMemo(
    () =>
      CONFIG.workspace.features?.knowledge !== false
        ? 'knowledge_retrieval'
        : 'endpoint',
    [],
  );

  const resolveToolCode = useCallback(
    (code?: string) => {
      if (!code) return defaultToolCode;
      if (
        CONFIG.workspace.features?.knowledge === false &&
        code === 'knowledge_retrieval'
      ) {
        return 'endpoint';
      }
      return code;
    },
    [defaultToolCode],
  );

  const [toolDefinition, setToolDefinition] = useState<{
    name: string;
    description: string;
    parameters: string;
  }>(
    GetDefaultToolDefintion(defaultToolCode, {
      name: '',
      description: '',
      parameters: '',
    }),
  );

  const [buildinToolConfig, setBuildinToolConfig] = useState<BuildinToolConfig>(
    {
      code: defaultToolCode,
      parameters: GetDefaultToolConfigIfInvalid(defaultToolCode, []),
    },
  );

  const [errorMessage, setErrorMessage] = useState('');

  const closeDialog = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  const resetState = useCallback(() => {
    setBuildinToolConfig({
      code: defaultToolCode,
      parameters: GetDefaultToolConfigIfInvalid(defaultToolCode, []),
    });
    setToolDefinition(
      GetDefaultToolDefintion(defaultToolCode, {
        name: '',
        description: '',
        parameters: '',
      }),
    );

    setErrorMessage('');
  }, [defaultToolCode]);

  useEffect(() => {
    if (modalOpen && initialData) {
      const toolCode = resolveToolCode(initialData.buildinToolConfig.code);
      setToolDefinition(
        GetDefaultToolDefintion(toolCode, {
          name: initialData.name || '',
          description: initialData.description || '',
          parameters: initialData.fields || '',
        }),
      );
      setBuildinToolConfig({
        code: toolCode,
        parameters: GetDefaultToolConfigIfInvalid(
          toolCode,
          initialData.buildinToolConfig.parameters || [],
        ),
      });
    } else if (!modalOpen) {
      resetState();
    }
  }, [initialData, modalOpen, resetState, resolveToolCode]);

  const onChangeBuildinToolConfig = useCallback(
    (code: string) => {
      setBuildinToolConfig({
        code,
        parameters: GetDefaultToolConfigIfInvalid(
          code,
          buildinToolConfig.parameters,
        ),
      });
      setToolDefinition(
        GetDefaultToolDefintion(code, {
          name: '',
          description: '',
          parameters: '',
        }),
      );
    },
    [buildinToolConfig.parameters],
  );

  const validateForm = () => {
    if (!toolDefinition.name) {
      setErrorMessage('Please provide a valid name for tool.');
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(toolDefinition.name)) {
      setErrorMessage(
        'Name should only contain letters, numbers, and underscores.',
      );
      return false;
    }

    if (!toolDefinition.description) {
      setErrorMessage('Please provide a valid description for the tool.');
      return false;
    }
    if (!toolDefinition.parameters) {
      setErrorMessage('Please provide a valid parameters for the tool.');
      return false;
    }
    try {
      JSON.parse(toolDefinition.parameters);
    } catch (error) {
      setErrorMessage(
        'Please provide a valid parameter, parameter must be a valid JSON.',
      );
      return false;
    }

    const toolOptionsError = ValidateToolDefaultOptions(
      buildinToolConfig.code,
      buildinToolConfig.parameters,
    );
    if (toolOptionsError) {
      setErrorMessage(toolOptionsError);
      return false;
    }

    return true;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!validateForm()) return;
    if (onValidateConfig) {
      const parentError = onValidateConfig({
        name: toolDefinition.name,
        description: toolDefinition.description,
        fields: toolDefinition.parameters,
        buildinToolConfig,
      });
      if (parentError) {
        setErrorMessage(parentError);
        return;
      }
    }

    if (onChange) {
      onChange({
        name: toolDefinition.name,
        description: toolDefinition.description,
        fields: toolDefinition.parameters,
        buildinToolConfig,
      });
    }
  };

  return (
    <Modal open={modalOpen} onClose={closeDialog} size="lg">
      <ModalHeader
        label="Tools"
        title="Configure Assistant Tool"
        onClose={closeDialog}
      />
      <ModalBody hasForm hasScrollingContent>
        <BuildinTool
          onChangeToolDefinition={setToolDefinition}
          toolDefinition={toolDefinition}
          onChangeBuildinTool={onChangeBuildinToolConfig}
          onChangeConfig={setBuildinToolConfig}
          config={buildinToolConfig}
        />
        {errorMessage && (
          <Notification kind="error" title="Error" subtitle={errorMessage} />
        )}
      </ModalBody>
      <ModalFooter>
        <SecondaryButton size="lg" onClick={closeDialog}>
          Cancel
        </SecondaryButton>
        <PrimaryButton size="lg" type="button" onClick={onSubmit}>
          Save tool
        </PrimaryButton>
      </ModalFooter>
    </Modal>
  );
}
