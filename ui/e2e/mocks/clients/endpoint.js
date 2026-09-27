const {
  fulfillGrpcWeb,
  protobufBoolean,
  protobufBytes,
} = require('../grpc-web');

const ENDPOINT_LIST_PATH = '**/endpoint_api.EndpointService/GetAllEndpoint';
const EMPTY_ENDPOINT_LIST_RESPONSE = Buffer.concat([
  protobufBoolean(2, true),
  protobufBytes(5, Buffer.alloc(0)),
]);

async function installEndpointClientMock(page) {
  await page.route(ENDPOINT_LIST_PATH, route => {
    if (route.request().method() !== 'POST') return route.fallback();
    return fulfillGrpcWeb(route, EMPTY_ENDPOINT_LIST_RESPONSE);
  });
}

module.exports = {
  ENDPOINT_LIST_PATH,
  installEndpointClientMock,
};
