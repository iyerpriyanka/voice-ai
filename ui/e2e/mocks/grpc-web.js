function encodeVarint(value) {
  const bytes = [];
  let remaining = BigInt(value);

  do {
    let byte = Number(remaining & 0x7fn);
    remaining >>= 7n;
    if (remaining > 0n) byte |= 0x80;
    bytes.push(byte);
  } while (remaining > 0n);

  return Buffer.from(bytes);
}

function protobufBoolean(fieldNumber, value) {
  if (!value) return Buffer.alloc(0);
  return Buffer.concat([encodeVarint(fieldNumber << 3), encodeVarint(1)]);
}

function protobufUnsignedInteger(fieldNumber, value) {
  if (value === 0) return Buffer.alloc(0);
  return Buffer.concat([encodeVarint(fieldNumber << 3), encodeVarint(value)]);
}

function protobufBytes(fieldNumber, value) {
  return Buffer.concat([
    encodeVarint((fieldNumber << 3) | 2),
    encodeVarint(value.length),
    value,
  ]);
}

function protobufString(fieldNumber, value) {
  return protobufBytes(fieldNumber, Buffer.from(value));
}

function grpcWebBody(message) {
  const dataHeader = Buffer.alloc(5);
  dataHeader.writeUInt32BE(message.length, 1);

  const trailers = Buffer.from('grpc-status: 0\r\n');
  const trailerHeader = Buffer.alloc(5);
  trailerHeader[0] = 0x80;
  trailerHeader.writeUInt32BE(trailers.length, 1);

  return Buffer.concat([dataHeader, message, trailerHeader, trailers]);
}

function fulfillGrpcWeb(route, message) {
  return route.fulfill({
    status: 200,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-expose-headers': 'grpc-status, grpc-message',
      'content-type': 'application/grpc-web+proto',
    },
    body: grpcWebBody(message),
  });
}

async function installGrpcWebPreflightMock(page) {
  for (const origin of [
    'https://api-01.in.rapida.ai/**',
    'https://assistant-01.in.rapida.ai/**',
  ]) {
    await page.route(origin, async route => {
      const request = route.request();
      if (request.method() !== 'OPTIONS') return route.fallback();

      return route.fulfill({
        status: 204,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'POST, OPTIONS',
          'access-control-allow-headers':
            (await request.headerValue('access-control-request-headers')) ||
            '*',
          'access-control-max-age': '600',
        },
      });
    });
  }
}

module.exports = {
  fulfillGrpcWeb,
  installGrpcWebPreflightMock,
  protobufBoolean,
  protobufBytes,
  protobufString,
  protobufUnsignedInteger,
};
