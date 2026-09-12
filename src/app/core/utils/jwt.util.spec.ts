import { Role } from '../models/role.enum';
import { createMockJwt, decodeJwt, isJwtExpired } from './jwt.util';

describe('jwt.util', () => {
  const basePayload = {
    sub: 'admin@dashboard.com',
    name: 'Ana Almeida',
    email: 'admin@dashboard.com',
    role: Role.Admin,
    iat: Math.floor(Date.now() / 1000),
  };

  it('encodes and decodes a payload round-trip', () => {
    const token = createMockJwt({ ...basePayload, exp: basePayload.iat + 3600 });
    const decoded = decodeJwt(token);

    expect(decoded).toEqual({ ...basePayload, exp: basePayload.iat + 3600 });
  });

  it('returns null for a malformed token', () => {
    expect(decodeJwt('not-a-valid-token')).toBeNull();
  });

  it('treats a token past its exp as expired', () => {
    const expiredPayload = { ...basePayload, exp: Math.floor(Date.now() / 1000) - 10 };
    expect(isJwtExpired(expiredPayload)).toBe(true);
  });

  it('treats a token with a future exp as valid', () => {
    const validPayload = { ...basePayload, exp: Math.floor(Date.now() / 1000) + 3600 };
    expect(isJwtExpired(validPayload)).toBe(false);
  });
});
