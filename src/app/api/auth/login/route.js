import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getUserByEmail, publicUser } from '@/lib/db/users';
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/session';

export const runtime = 'nodejs';

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required.' },
      { status: 400 }
    );
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const token = await signSession({
    uid: user.id,
    email: user.email,
    name: user.name,
  });

  const response = NextResponse.json({ user: publicUser(user) });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });

  return response;
}
