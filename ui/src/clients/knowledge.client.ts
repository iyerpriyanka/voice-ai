import {
  CreateKnowledge,
  CreateKnowledgeDocument,
  CreateKnowledgeTag,
  DeleteKnowledgeDocumentSegment,
  GetAllKnowledgeBases,
  GetAllKnowledgeDocument,
  GetAllKnowledgeDocumentSegment,
  GetAllKnowledgeLog,
  GetKnowledgeBase,
  GetKnowledgeLog,
  IndexKnowledgeDocument,
  UpdateKnowledgeDetail,
  UpdateKnowledgeDocumentSegment,
} from '@rapidaai/react';

import { withConnection } from './connection';

export const createKnowledge = withConnection(CreateKnowledge);
export const getAllKnowledgeBases = withConnection(GetAllKnowledgeBases);
export const getKnowledgeBase = withConnection(GetKnowledgeBase);
export const updateKnowledgeDetail = withConnection(UpdateKnowledgeDetail);
export const createKnowledgeTag = withConnection(CreateKnowledgeTag);

export const createKnowledgeDocument = withConnection(CreateKnowledgeDocument);
export const getAllKnowledgeDocument = withConnection(GetAllKnowledgeDocument);
export const indexKnowledgeDocument = withConnection(IndexKnowledgeDocument);

export const getAllKnowledgeDocumentSegment = withConnection(
  GetAllKnowledgeDocumentSegment,
);
export const updateKnowledgeDocumentSegment = withConnection(
  UpdateKnowledgeDocumentSegment,
);
export const deleteKnowledgeDocumentSegment = withConnection(
  DeleteKnowledgeDocumentSegment,
);

export const getKnowledgeLog = withConnection(GetKnowledgeLog);
export const getAllKnowledgeLog = withConnection(GetAllKnowledgeLog);
