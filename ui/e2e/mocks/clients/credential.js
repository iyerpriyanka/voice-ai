const {
  fulfillGrpcWeb,
  protobufBoolean,
  protobufBytes,
} = require('../grpc-web');

const CREDENTIAL_LIST_PATH =
  '**/vault_api.VaultService/GetAllOrganizationCredential';
const PROJECT_CREDENTIAL_LIST_PATH =
  '**/web_api.ProjectService/GetAllProjectCredential';
const EMPTY_CREDENTIAL_LIST_RESPONSE = Buffer.concat([
  protobufBoolean(2, true),
  protobufBytes(5, Buffer.alloc(0)),
]);

async function installCredentialClientMock(page) {
  for (const path of [CREDENTIAL_LIST_PATH, PROJECT_CREDENTIAL_LIST_PATH]) {
    await page.route(path, route => {
      if (route.request().method() !== 'POST') return route.fallback();
      return fulfillGrpcWeb(route, EMPTY_CREDENTIAL_LIST_RESPONSE);
    });
  }
}

module.exports = {
  CREDENTIAL_LIST_PATH,
  PROJECT_CREDENTIAL_LIST_PATH,
  installCredentialClientMock,
};
