const {
  fulfillGrpcWeb,
  protobufBoolean,
  protobufBytes,
} = require('../grpc-web');

const ACTIVITY_LIST_PATHS = [
  '**/integration_api.AuditLoggingService/GetAllAuditLog',
  '**/assistant_api.AssistantService/GetAllAssistantHTTPLog',
  '**/assistant_api.AssistantService/GetAllAssistantToolLog',
  '**/assistant_api.AssistantService/GetAllMessage',
  '**/observability_api.ObservabilityService/GetAllTelemetry',
];

const EMPTY_ACTIVITY_LIST_RESPONSE = Buffer.concat([
  protobufBoolean(2, true),
  protobufBytes(5, Buffer.alloc(0)),
]);

async function installActivityClientMock(page) {
  for (const path of ACTIVITY_LIST_PATHS) {
    await page.route(path, route => {
      if (route.request().method() !== 'POST') return route.fallback();
      return fulfillGrpcWeb(route, EMPTY_ACTIVITY_LIST_RESPONSE);
    });
  }
}

module.exports = {
  ACTIVITY_LIST_PATHS,
  installActivityClientMock,
};
