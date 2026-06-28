const crypto = require('crypto');
const { jwtSecret, tokenExpiresInSeconds } = require('../config');

function base64Url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(input) {
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  const padding = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
  return Buffer.from(input + padding, 'base64').toString('utf8');
}

function sign(data) {
  return crypto
    .createHmac('sha256', jwtSecret)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function generateToken(payload) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  const finalPayload = {
    ...payload,
    iat: now,
    exp: now + tokenExpiresInSeconds
  };

  const encodedHeader = base64Url(JSON.stringify(header));
  const encodedPayload = base64Url(JSON.stringify(finalPayload));
  const signature = sign(`${encodedHeader}.${encodedPayload}`);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyToken(token) {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Format token tidak valid');
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const expectedSignature = sign(`${encodedHeader}.${encodedPayload}`);

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    throw new Error('Signature token tidak valid');
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload));
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp && payload.exp < now) {
    throw new Error('Token sudah kedaluwarsa');
  }

  return payload;
}

module.exports = { generateToken, verifyToken };
