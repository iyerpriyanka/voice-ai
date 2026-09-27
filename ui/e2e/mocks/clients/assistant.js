const {
  fulfillGrpcWeb,
  protobufBoolean,
  protobufBytes,
} = require('../grpc-web');

const ASSISTANT_LIST_PATH = '**/assistant_api.AssistantService/GetAllAssistant';
const EMPTY_ASSISTANT_LIST_RESPONSE = Buffer.concat([
  protobufBoolean(2, true),
  protobufBytes(5, Buffer.alloc(0)),
]);

async function installAssistantClientMock(page) {
  await page.route(ASSISTANT_LIST_PATH, route => {
    if (route.request().method() !== 'POST') return route.fallback();
    return fulfillGrpcWeb(route, EMPTY_ASSISTANT_LIST_RESPONSE);
  });
}

module.exports = {
  ASSISTANT_LIST_PATH,
  installAssistantClientMock,
};
