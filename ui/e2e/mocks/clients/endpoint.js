const {
  fulfillGrpcWeb,
  protobufBoolean,
  protobufBytes,
  protobufString,
  protobufUnsignedInteger,
} = require('../grpc-web');

const ENDPOINT_LIST_PATH = '**/endpoint_api.EndpointService/GetAllEndpoint';
const ENDPOINT_DETAIL_PATH = '**/endpoint_api.EndpointService/GetEndpoint';
const ENDPOINT_ID = '2301664620831571968';
const ENDPOINT_PROVIDER_MODEL_ID = '2301664620831571999';
const EMPTY_ENDPOINT_LIST_RESPONSE = Buffer.concat([
  protobufBoolean(2, true),
  protobufBytes(5, Buffer.alloc(0)),
]);

const ENDPOINT_PROVIDER_MODEL = Buffer.concat([
  protobufUnsignedInteger(1, ENDPOINT_PROVIDER_MODEL_ID),
  protobufString(4, 'OpenAI'),
  protobufString(12, 'active'),
  protobufUnsignedInteger(19, ENDPOINT_ID),
  protobufString(20, 'GPT endpoint'),
]);

const ENDPOINT = Buffer.concat([
  protobufUnsignedInteger(1, ENDPOINT_ID),
  protobufString(2, 'active'),
  protobufString(3, 'project'),
  protobufUnsignedInteger(9, ENDPOINT_PROVIDER_MODEL_ID),
  protobufBytes(10, ENDPOINT_PROVIDER_MODEL),
  protobufString(16, 'English'),
  protobufString(18, 'Customer support analysis'),
  protobufString(19, 'Analyze completed support conversations.'),
]);

const ENDPOINT_DETAIL_RESPONSE = Buffer.concat([
  protobufBoolean(2, true),
  protobufBytes(3, ENDPOINT),
]);

async function installEndpointClientMock(page) {
  await page.route(ENDPOINT_LIST_PATH, route => {
    if (route.request().method() !== 'POST') return route.fallback();
    return fulfillGrpcWeb(route, EMPTY_ENDPOINT_LIST_RESPONSE);
  });
  await page.route(ENDPOINT_DETAIL_PATH, route => {
    if (route.request().method() !== 'POST') return route.fallback();
    return fulfillGrpcWeb(route, ENDPOINT_DETAIL_RESPONSE);
  });
}

module.exports = {
  ENDPOINT_DETAIL_PATH,
  ENDPOINT_LIST_PATH,
  installEndpointClientMock,
};
