import { useCallback, useState } from 'react';
import { PromptRole } from '@/models/prompt';
import AdvancedMessageInput from '@/app/components/domain/configuration/config-prompt/advanced-prompt-input';
import {
  MAX_PROMPT_MESSAGE_LENGTH,
  SUPPORTED_PROMPT_VARIABLE_TYPE,
} from '@/configs';
import { TertiaryButton } from '@/app/components/ui/primitives';
import { FormLabel } from '@/app/components/ui/primitives';
import { FieldSet } from '@/app/components/ui/primitives';
import { ScalableTextarea } from '@/app/components/ui/primitives';
import { getNewVar, getVars } from '@/utils/var';
import { TypeOfVariable } from '@/app/components/domain/configuration/config-prompt/type-of-variable';
import { InputHelper } from '@/app/components/ui/primitives';
import {
  RAPIDA_RESERVED_RUNTIME_VARIABLE_KEYS,
  RAPIDA_RESERVED_RUNTIME_VARIABLES,
} from '@/utils/prompt-reserved-variables';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
} from '@carbon/react';
import { Add, ChevronDown, Information } from '@carbon/icons-react';

const isRapidaReservedRuntimeVariable = (variableName: string): boolean =>
  RAPIDA_RESERVED_RUNTIME_VARIABLE_KEYS.has(variableName) ||
  variableName.startsWith('args.');
export type IPromptProps = {
  existingPrompt: {
    prompt: { role: string; content: string }[];
    variables: { name: string; type: string; defaultvalue: string }[];
  };
  instanceId?: string;
  showRuntimeReplacementHint?: boolean;
  hideArgumentRuntimeHint?: boolean;
  enableReservedVariableSuggestions?: boolean;
  onChange: (prompt: {
    prompt: { role: string; content: string }[];
    variables: { name: string; type: string; defaultvalue: string }[];
  }) => void;
};

export function ConfigPrompt({
  existingPrompt,
  onChange,
  instanceId,
  showRuntimeReplacementHint = false,
  hideArgumentRuntimeHint = false,
  enableReservedVariableSuggestions = false,
}: IPromptProps) {
  const [showReservedVariables, setShowReservedVariables] = useState(false);

  const handlePromptChange = useCallback(
    (newPrompt: typeof existingPrompt.prompt) => {
      onChange({
        ...existingPrompt,
        prompt: newPrompt,
      });
    },
    [onChange, existingPrompt],
  );

  const handleVariablesChange = useCallback(
    (newVariables: typeof existingPrompt.variables) => {
      onChange({
        ...existingPrompt,
        variables: newVariables,
      });
    },
    [onChange, existingPrompt],
  );

  const handleMessageTypeChange = useCallback(
    (index: number, role: PromptRole) => {
      handlePromptChange(
        existingPrompt.prompt.map((item, i) =>
          i === index ? { ...item, role } : item,
        ),
      );
    },
    [handlePromptChange, existingPrompt.prompt],
  );
  const handleValueChange = useCallback(
    (value: string, index: number) => {
      const updatedPrompt = existingPrompt.prompt.map((item, i) =>
        i === index ? { ...item, content: value } : item,
      );
      const allVars = updatedPrompt.flatMap(item => getVars(item.content));
      const uniqueVars = [...new Set(allVars)];

      const updatedVariables = uniqueVars.map(varName => {
        const existingVar = existingPrompt.variables.find(
          v => v.name === varName,
        );
        return existingVar || getNewVar(varName);
      });

      onChange({
        prompt: updatedPrompt,
        variables: updatedVariables,
      });
    },
    [existingPrompt, onChange],
  );
  const handleAddMessage = useCallback(() => {
    const lastMessageType =
      existingPrompt.prompt[existingPrompt.prompt.length - 1]?.role;
    const newRole =
      lastMessageType === PromptRole.user
        ? PromptRole.assistant
        : PromptRole.user;
    handlePromptChange([
      ...existingPrompt.prompt,
      { role: newRole, content: '' },
    ]);
  }, [handlePromptChange, existingPrompt.prompt]);

  const handlePromptDelete = useCallback(
    (index: number) => {
      handlePromptChange(existingPrompt.prompt.filter((_, i) => i !== index));
    },
    [handlePromptChange, existingPrompt.prompt],
  );

  const handleVariableChange = useCallback(
    (name: string, type: string, defaultValue: string) => {
      handleVariablesChange(
        existingPrompt.variables.map(v =>
          v.name === name ? { ...v, type, defaultvalue: defaultValue } : v,
        ),
      );
    },
    [handleVariablesChange, existingPrompt.variables],
  );

  return (
    <>
      <FieldSet>
        <div className="flex items-center gap-1">
          <FormLabel>Instruction</FormLabel>
          <Toggletip align="right">
            <ToggletipButton label="Show information">
              <Information size={14} />
            </ToggletipButton>
            <ToggletipContent>
              Define the messages and variables that guide the agent response.
            </ToggletipContent>
          </Toggletip>
        </div>
        {showRuntimeReplacementHint && (
          <div className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <Button
              type="button"
              kind="ghost"
              size="md"
              className="!h-auto !min-h-0 !w-full !max-w-none !justify-between !px-4 !py-4 !text-left"
              aria-expanded={showReservedVariables}
              onClick={() => setShowReservedVariables(v => !v)}
            >
              <div className="w-full flex items-center justify-between gap-2 text-left">
                <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-gray-500 dark:text-gray-400">
                  Reserved Variables
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${showReservedVariables ? 'rotate-180' : ''}`}
                />
              </div>
              <InputHelper className="mt-1">
                These variables are preserved and replaced at runtime.
              </InputHelper>
            </Button>

            {showReservedVariables && (
              <div className="mt-2 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                <TableContainer>
                  <Table size="sm" useZebraStyles={false}>
                    <TableHead>
                      <TableRow>
                        <TableHeader>Variable</TableHeader>
                        <TableHeader>Runtime value</TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {RAPIDA_RESERVED_RUNTIME_VARIABLES.map(item => (
                        <TableRow key={item.variable}>
                          <TableCell>
                            <code className="text-xs text-gray-700 dark:text-gray-200">
                              {item.variable}
                            </code>
                          </TableCell>
                          <TableCell>{item.runtimeValue}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
          </div>
        )}
        <div className="space-y-2">
          {existingPrompt.prompt.map((item, index) => (
            <AdvancedMessageInput
              key={`${item.role}-${index}`}
              isChatMode
              instanceId={`${instanceId}-${item.role}-${index}`}
              type={item.role as PromptRole}
              value={item.content}
              onTypeChange={type => handleMessageTypeChange(index, type)}
              canDelete={existingPrompt.prompt.length > 1}
              onDelete={() => handlePromptDelete(index)}
              onChange={value => handleValueChange(value, index)}
              enableReservedVariableSuggestions={
                enableReservedVariableSuggestions
              }
            />
          ))}
          {existingPrompt.prompt.length < MAX_PROMPT_MESSAGE_LENGTH && (
            <TertiaryButton
              size="md"
              renderIcon={Add}
              onClick={handleAddMessage}
              className="!w-full !max-w-none !justify-between !text-left"
            >
              Add new message
            </TertiaryButton>
          )}
        </div>
      </FieldSet>

      {(showRuntimeReplacementHint || existingPrompt.variables.length > 0) && (
        <FieldSet>
          <div className="flex items-center gap-2">
            <FormLabel>Arguments</FormLabel>
            <span className="text-xs tabular-nums text-gray-400 dark:text-gray-600">
              {existingPrompt.variables.length}
            </span>
          </div>
          {showRuntimeReplacementHint && !hideArgumentRuntimeHint && (
            <InputHelper className="mb-2">
              Add only your template-specific variables here. Reserved variables
              are preserved and replaced at runtime.
            </InputHelper>
          )}
          <TableContainer>
            <Table size="sm" useZebraStyles={false}>
              <TableHead>
                <TableRow>
                  <TableHeader>Variable</TableHeader>
                  <TableHeader>Type</TableHeader>
                  <TableHeader>Default value</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {existingPrompt.variables.map(v => (
                  <TableRow key={v.name}>
                    <TableCell>
                      <span className="flex items-center gap-2 font-medium text-gray-800 dark:text-gray-200">
                        {v.name}
                        {showRuntimeReplacementHint &&
                          isRapidaReservedRuntimeVariable(v.name) && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-blue-700 dark:text-blue-300 border border-blue-300/70 dark:border-blue-700/70">
                              Reserved
                            </span>
                          )}
                      </span>
                    </TableCell>
                    <TableCell>
                      <TypeOfVariable
                        allType={SUPPORTED_PROMPT_VARIABLE_TYPE()}
                        className="h-full border-0"
                        type={v.type}
                        onChange={t =>
                          handleVariableChange(v.name, t, v.defaultvalue)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <ScalableTextarea
                        wrapperClassName="border-0 bg-transparent h-full"
                        placeholder={`Default value for '${v.name}'`}
                        value={v.defaultvalue}
                        row={1}
                        onChange={e =>
                          handleVariableChange(v.name, v.type, e.target.value)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {existingPrompt.variables.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      No template-specific variables yet. Add placeholders like{' '}
                      <code>{'{{customer_name}}'}</code> in instruction messages
                      to populate this list.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </FieldSet>
      )}
    </>
  );
}
