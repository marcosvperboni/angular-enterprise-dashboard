import { JwtPayload } from '../models/auth.model';

function base64UrlEncode(value: string): string {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(value: string): string {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(value.length + ((4 - (value.length % 4)) % 4), '=');
  return atob(padded);
}

/** Builds a structurally valid (unsigned) JWT for the mock authentication API. */
export function createMockJwt(payload: JwtPayload): string {
  const header = base64UrlEncode(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const body = base64UrlEncode(JSON.stringify(payload));
  return `${header}.${body}.mock-signature`;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const [, body] = token.split('.');
    return JSON.parse(base64UrlDecode(body)) as JwtPayload;
  } catch {
    return null;
  }
}

export function isJwtExpired(payload: JwtPayload): boolean {
  return Date.now() >= payload.exp * 1000;
}
