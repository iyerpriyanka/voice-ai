import {
  CreateAssistant,
  CreateAssistantApiDeployment,
  CreateAssistantConfiguration,
  CreateAssistantDebuggerDeployment,
  CreateAssistantKnowledge,
  CreateAssistantPhoneDeployment,
  CreateAssistantProvider,
  CreateAssistantTag,
  CreateAssistantTool,
  CreateAssistantWebpluginDeployment,
  CreateAssistantWhatsappDeployment,
  DeleteAssistant,
  DeleteAssistantConfiguration,
  DeleteAssistantKnowledge,
  DeleteAssistantTool,
  DisableAssistantApiDeployment,
  DisableAssistantDebuggerDeployment,
  DisableAssistantPhoneDeployment,
  DisableAssistantWebpluginDeployment,
  DisableAssistantWhatsappDeployment,
  GetAllAssistant,
  GetAllAssistantApiDeployment,
  GetAllAssistantConfiguration,
  GetAllAssistantConversation,
  GetAllAssistantConversationMessage,
  GetAllAssistantDebuggerDeployment,
  GetAllAssistantKnowledge,
  GetAllAssistantPhoneDeployment,
  GetAllAssistantProvider,
  GetAllAssistantTool,
  GetAllAssistantWebpluginDeployment,
  GetAllAssistantWhatsappDeployment,
  GetAssistant,
  GetAssistantApiDeployment,
  GetAssistantConfiguration,
  GetAssistantConversation,
  GetAssistantDashboard,
  GetAssistantDebuggerDeployment,
  GetAssistantKnowledge,
  GetAssistantMessages,
  GetAssistantPhoneDeployment,
  GetAssistantTool,
  GetAssistantWebpluginDeployment,
  GetAssistantWhatsappDeployment,
  UpdateAssistantConfiguration,
  UpdateAssistantDetail,
  UpdateAssistantKnowledge,
  UpdateAssistantTool,
  UpdateAssistantVersion,
} from '@rapidaai/react';

import { withConnection } from './connection';

export const createAssistant = withConnection(CreateAssistant);
export const getAllAssistant = withConnection(GetAllAssistant);
export const getAssistant = withConnection(GetAssistant);
export const updateAssistantDetail = withConnection(UpdateAssistantDetail);
export const deleteAssistant = withConnection(DeleteAssistant);
export const createAssistantTag = withConnection(CreateAssistantTag);
export const updateAssistantVersion = withConnection(UpdateAssistantVersion);

export const createAssistantProvider = withConnection(CreateAssistantProvider);
export const getAllAssistantProvider = withConnection(GetAllAssistantProvider);

export const createAssistantConfiguration = withConnection(
  CreateAssistantConfiguration,
);
export const getAssistantConfiguration = withConnection(
  GetAssistantConfiguration,
);
export const getAllAssistantConfiguration = withConnection(
  GetAllAssistantConfiguration,
);
export const updateAssistantConfiguration = withConnection(
  UpdateAssistantConfiguration,
);
export const deleteAssistantConfiguration = withConnection(
  DeleteAssistantConfiguration,
);

export const createAssistantKnowledge = withConnection(
  CreateAssistantKnowledge,
);
export const getAssistantKnowledge = withConnection(GetAssistantKnowledge);
export const getAllAssistantKnowledge = withConnection(
  GetAllAssistantKnowledge,
);
export const updateAssistantKnowledge = withConnection(
  UpdateAssistantKnowledge,
);
export const deleteAssistantKnowledge = withConnection(
  DeleteAssistantKnowledge,
);

export const createAssistantTool = withConnection(CreateAssistantTool);
export const getAssistantTool = withConnection(GetAssistantTool);
export const getAllAssistantTool = withConnection(GetAllAssistantTool);
export const updateAssistantTool = withConnection(UpdateAssistantTool);
export const deleteAssistantTool = withConnection(DeleteAssistantTool);

export const getAssistantDashboard = withConnection(GetAssistantDashboard);
export const getAssistantMessages = withConnection(GetAssistantMessages);
export const getAssistantConversation = withConnection(
  GetAssistantConversation,
);
export const getAllAssistantConversation = withConnection(
  GetAllAssistantConversation,
);
export const getAllAssistantConversationMessage = withConnection(
  GetAllAssistantConversationMessage,
);

export const createAssistantApiDeployment = withConnection(
  CreateAssistantApiDeployment,
);
export const getAssistantApiDeployment = withConnection(
  GetAssistantApiDeployment,
);
export const getAllAssistantApiDeployment = withConnection(
  GetAllAssistantApiDeployment,
);
export const disableAssistantApiDeployment = withConnection(
  DisableAssistantApiDeployment,
);

export const createAssistantDebuggerDeployment = withConnection(
  CreateAssistantDebuggerDeployment,
);
export const getAssistantDebuggerDeployment = withConnection(
  GetAssistantDebuggerDeployment,
);
export const getAllAssistantDebuggerDeployment = withConnection(
  GetAllAssistantDebuggerDeployment,
);
export const disableAssistantDebuggerDeployment = withConnection(
  DisableAssistantDebuggerDeployment,
);

export const createAssistantPhoneDeployment = withConnection(
  CreateAssistantPhoneDeployment,
);
export const getAssistantPhoneDeployment = withConnection(
  GetAssistantPhoneDeployment,
);
export const getAllAssistantPhoneDeployment = withConnection(
  GetAllAssistantPhoneDeployment,
);
export const disableAssistantPhoneDeployment = withConnection(
  DisableAssistantPhoneDeployment,
);

export const createAssistantWebpluginDeployment = withConnection(
  CreateAssistantWebpluginDeployment,
);
export const getAssistantWebpluginDeployment = withConnection(
  GetAssistantWebpluginDeployment,
);
export const getAllAssistantWebpluginDeployment = withConnection(
  GetAllAssistantWebpluginDeployment,
);
export const disableAssistantWebpluginDeployment = withConnection(
  DisableAssistantWebpluginDeployment,
);

export const createAssistantWhatsappDeployment = withConnection(
  CreateAssistantWhatsappDeployment,
);
export const getAssistantWhatsappDeployment = withConnection(
  GetAssistantWhatsappDeployment,
);
export const getAllAssistantWhatsappDeployment = withConnection(
  GetAllAssistantWhatsappDeployment,
);
export const disableAssistantWhatsappDeployment = withConnection(
  DisableAssistantWhatsappDeployment,
);
