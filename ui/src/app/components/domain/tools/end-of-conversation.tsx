import { ConfigureToolProps, ToolDefinitionForm } from './common';

// ============================================================================
// Main Component
// ============================================================================

export function ConfigureEndOfConversation({
  inputClass,
  toolDefinition,
  onChangeToolDefinition,
}: ConfigureToolProps) {
  return (
    <>
      {toolDefinition && onChangeToolDefinition && (
        <ToolDefinitionForm
          toolDefinition={toolDefinition}
          onChangeToolDefinition={onChangeToolDefinition}
          inputClass={inputClass}
          documentationPath="/assistants/tools/add-end-of-conversation-tool"
          documentationTitle="Know more about supported End of Conversation behavior"
        />
      )}
    </>
  );
}
