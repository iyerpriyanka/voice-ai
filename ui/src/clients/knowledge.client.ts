import {
  ConnectionConfig,
  Criteria,
  CreateKnowledge,
  CreateKnowledgeDocument,
  CreateKnowledgeDocumentResponse,
  CreateKnowledgeRequest,
  CreateKnowledgeTag,
  DeleteKnowledgeDocumentSegment,
  GetAllKnowledgeBases,
  GetAllKnowledgeDocument,
  GetAllKnowledgeDocumentSegment,
  GetAllKnowledgeLog,
  GetAllKnowledgeLogRequest,
  GetKnowledgeBase,
  GetKnowledgeLog,
  GetKnowledgeLogRequest,
  IndexKnowledgeDocument,
  Paginate,
  ServiceError,
  UpdateKnowledgeDetail,
  UpdateKnowledgeDocumentSegment,
} from '@rapidaai/react';
import type {
  BaseResponse,
  CreateKnowledgeResponse,
  DocumentContent,
  GetAllKnowledgeDocumentResponse,
  GetAllKnowledgeDocumentSegmentResponse,
  GetAllKnowledgeLogResponse,
  GetAllKnowledgeResponse,
  GetKnowledgeLogResponse,
  GetKnowledgeResponse,
  IndexKnowledgeDocumentResponse,
} from '@rapidaai/react';

import { connectionConfig } from '@/configs';
import { ApiAuth, createApiMetadata, withConnection } from './connection';

type ClientCriteria = {
  key: string;
  value: string;
  logic: string;
};

type KnowledgeClientCallback<TResponse> = (
  error: ServiceError | null,
  response: TResponse | null,
) => void;

type CreateKnowledgeDocumentArgs = Parameters<typeof CreateKnowledgeDocument>;

export type ListKnowledgeBasesParams = {
  page: number;
  pageSize: number;
  criteria: ClientCriteria[];
  auth: ApiAuth;
  callback: KnowledgeClientCallback<GetAllKnowledgeResponse>;
};

export type GetKnowledgeBaseDetailParams = {
  knowledgeId: string;
  auth: ApiAuth;
  callback: KnowledgeClientCallback<GetKnowledgeResponse>;
};

export type UpdateKnowledgeBaseDetailParams = {
  knowledgeId: string;
  name: string;
  description: string;
  auth: ApiAuth;
  callback: KnowledgeClientCallback<GetKnowledgeResponse>;
};

export type CreateKnowledgeBaseTagParams = {
  knowledgeId: string;
  tags: string[];
  auth: ApiAuth;
  callback: KnowledgeClientCallback<GetKnowledgeResponse>;
};

export type CreateKnowledgeBaseParams = {
  embeddingModelProviderName: string;
  embeddingModelOptions: unknown[];
  name: string;
  description: string;
  tags: string[];
  auth: ApiAuth;
};

export type ListKnowledgeDocumentsParams = {
  knowledgeId: string;
  page: number;
  pageSize: number;
  criteria: ClientCriteria[];
  auth: ApiAuth;
  callback: KnowledgeClientCallback<GetAllKnowledgeDocumentResponse>;
};

export type IndexKnowledgeDocumentsParams = {
  knowledgeId: string;
  knowledgeDocumentIds: string[];
  indexType: string;
  auth: ApiAuth;
  callback: KnowledgeClientCallback<IndexKnowledgeDocumentResponse>;
};

export type ListKnowledgeDocumentSegmentsParams = {
  knowledgeId: string;
  page: number;
  pageSize: number;
  criteria: ClientCriteria[];
  auth: ApiAuth;
  callback: KnowledgeClientCallback<GetAllKnowledgeDocumentSegmentResponse>;
};

export type CreateKnowledgeDocumentsParams = {
  knowledgeId: string;
  documentSource: CreateKnowledgeDocumentArgs[2];
  datasource: CreateKnowledgeDocumentArgs[3];
  documentType: CreateKnowledgeDocumentArgs[4];
  preProcessing: CreateKnowledgeDocumentArgs[5];
  contents: DocumentContent[];
  separator: string;
  maxChunkSize: number;
  chunkOverlap: number;
  auth: ApiAuth;
  callback: KnowledgeClientCallback<CreateKnowledgeDocumentResponse>;
};

export type ListKnowledgeLogsParams = {
  projectId: string;
  page: number;
  pageSize: number;
  criteria: ClientCriteria[];
  auth: ApiAuth;
};

export type GetKnowledgeActivityLogParams = {
  projectId: string;
  activityId: string;
  auth: ApiAuth;
};

export type DeleteKnowledgeDocumentSegmentParams = {
  documentId: string;
  segmentIndex: string;
  reason: string;
  auth: ApiAuth;
  callback: KnowledgeClientCallback<BaseResponse>;
};

export type UpdateKnowledgeDocumentSegmentEntitiesParams = {
  documentId: string;
  segmentIndex: string;
  organizations: string[];
  dates: string[];
  products: string[];
  events: string[];
  people: string[];
  times: string[];
  quantities: string[];
  locations: string[];
  industries: string[];
  documentName: string;
  auth: ApiAuth;
  callback: KnowledgeClientCallback<BaseResponse>;
};

const createDebuggerMetadata = ({ projectId, token, userId }: ApiAuth) =>
  ConnectionConfig.WithDebugger({
    authorization: token,
    userId,
    projectId,
  });

const createPaginate = (page: number, pageSize: number): Paginate => {
  const paginate = new Paginate();
  paginate.setPage(page);
  paginate.setPagesize(pageSize);
  return paginate;
};

const createCriteria = ({ key, value, logic }: ClientCriteria): Criteria => {
  const criteria = new Criteria();
  criteria.setKey(key);
  criteria.setValue(value);
  criteria.setLogic(logic);
  return criteria;
};

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

export const listKnowledgeBases = ({
  page,
  pageSize,
  criteria,
  auth,
  callback,
}: ListKnowledgeBasesParams): void => {
  GetAllKnowledgeBases(
    connectionConfig,
    page,
    pageSize,
    criteria,
    callback,
    createApiMetadata(auth),
  );
};

export const getKnowledgeBaseDetail = ({
  knowledgeId,
  auth,
  callback,
}: GetKnowledgeBaseDetailParams): void => {
  GetKnowledgeBase(
    connectionConfig,
    knowledgeId,
    callback,
    createDebuggerMetadata(auth),
  );
};

export const updateKnowledgeBaseDetail = ({
  knowledgeId,
  name,
  description,
  auth,
  callback,
}: UpdateKnowledgeBaseDetailParams): void => {
  UpdateKnowledgeDetail(
    connectionConfig,
    knowledgeId,
    name,
    description,
    callback,
    createApiMetadata(auth),
  );
};

export const createKnowledgeBaseTag = ({
  knowledgeId,
  tags,
  auth,
  callback,
}: CreateKnowledgeBaseTagParams): void => {
  CreateKnowledgeTag(
    connectionConfig,
    knowledgeId,
    tags,
    callback,
    createApiMetadata(auth),
  );
};

export const createKnowledgeBase = ({
  embeddingModelProviderName,
  embeddingModelOptions,
  name,
  description,
  tags,
  auth,
}: CreateKnowledgeBaseParams): Promise<CreateKnowledgeResponse> => {
  const request = new CreateKnowledgeRequest();
  request.setEmbeddingmodelprovidername(embeddingModelProviderName);
  request.setKnowledgeembeddingmodeloptionsList(embeddingModelOptions as never);
  request.setName(name);
  request.setDescription(description);
  request.setTagsList(tags);

  return CreateKnowledge(
    connectionConfig,
    request,
    ConnectionConfig.WithDebugger({
      authorization: auth.token,
      userId: auth.userId,
      projectId: auth.projectId,
    }),
  );
};

export const listKnowledgeDocuments = ({
  knowledgeId,
  page,
  pageSize,
  criteria,
  auth,
  callback,
}: ListKnowledgeDocumentsParams): void => {
  GetAllKnowledgeDocument(
    connectionConfig,
    knowledgeId,
    page,
    pageSize,
    criteria,
    callback,
    ConnectionConfig.WithDebugger({
      authorization: auth.token,
      projectId: auth.projectId,
      userId: auth.userId,
    }),
  );
};

export const indexKnowledgeDocuments = ({
  knowledgeId,
  knowledgeDocumentIds,
  indexType,
  auth,
  callback,
}: IndexKnowledgeDocumentsParams): void => {
  IndexKnowledgeDocument(
    connectionConfig,
    knowledgeId,
    knowledgeDocumentIds,
    indexType,
    ConnectionConfig.WithDebugger({
      authorization: auth.token,
      projectId: auth.projectId,
      userId: auth.userId,
    }),
    callback,
  );
};

export const listKnowledgeDocumentSegments = ({
  knowledgeId,
  page,
  pageSize,
  criteria,
  auth,
  callback,
}: ListKnowledgeDocumentSegmentsParams): void => {
  GetAllKnowledgeDocumentSegment(
    connectionConfig,
    knowledgeId,
    page,
    pageSize,
    criteria,
    callback,
    createApiMetadata(auth),
  );
};

export const createKnowledgeDocuments = ({
  knowledgeId,
  documentSource,
  datasource,
  documentType,
  preProcessing,
  contents,
  separator,
  maxChunkSize,
  chunkOverlap,
  auth,
  callback,
}: CreateKnowledgeDocumentsParams): void => {
  CreateKnowledgeDocument(
    connectionConfig,
    knowledgeId,
    documentSource,
    datasource,
    documentType,
    preProcessing,
    contents,
    separator,
    maxChunkSize,
    chunkOverlap,
    callback,
    ConnectionConfig.WithDebugger({
      authorization: auth.token,
      userId: auth.userId,
      projectId: auth.projectId,
    }),
  );
};

export const listKnowledgeLogs = ({
  projectId,
  page,
  pageSize,
  criteria,
  auth,
}: ListKnowledgeLogsParams): Promise<GetAllKnowledgeLogResponse> => {
  const request = new GetAllKnowledgeLogRequest();
  request.setProjectid(projectId);
  request.setPaginate(createPaginate(page, pageSize));
  criteria.forEach(item => request.addCriterias(createCriteria(item)));

  return GetAllKnowledgeLog(
    connectionConfig,
    request,
    createDebuggerMetadata(auth),
  );
};

export const getKnowledgeActivityLog = ({
  projectId,
  activityId,
  auth,
}: GetKnowledgeActivityLogParams): Promise<GetKnowledgeLogResponse> => {
  const request = new GetKnowledgeLogRequest();
  request.setId(activityId);
  request.setProjectid(projectId);

  return GetKnowledgeLog(
    connectionConfig,
    request,
    createDebuggerMetadata(auth),
  );
};

export const deleteKnowledgeDocumentSegmentByReason = ({
  documentId,
  segmentIndex,
  reason,
  auth,
  callback,
}: DeleteKnowledgeDocumentSegmentParams): void => {
  DeleteKnowledgeDocumentSegment(
    connectionConfig,
    documentId,
    segmentIndex,
    reason,
    callback,
    createApiMetadata(auth),
  );
};

export const updateKnowledgeDocumentSegmentEntities = ({
  documentId,
  segmentIndex,
  organizations,
  dates,
  products,
  events,
  people,
  times,
  quantities,
  locations,
  industries,
  documentName,
  auth,
  callback,
}: UpdateKnowledgeDocumentSegmentEntitiesParams): void => {
  UpdateKnowledgeDocumentSegment(
    connectionConfig,
    documentId,
    segmentIndex,
    organizations,
    dates,
    products,
    events,
    people,
    times,
    quantities,
    locations,
    industries,
    documentName,
    callback,
    createApiMetadata(auth),
  );
};
