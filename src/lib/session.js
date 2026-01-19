import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'tt-session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'dev-secret-change-me'
);

export async function signSession(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifySession(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}
