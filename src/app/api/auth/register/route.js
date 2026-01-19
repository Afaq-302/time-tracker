import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { createUser, getUserByEmail, publicUser } from '@/lib/db/users';
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/session';

export const runtime = 'nodejs';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: 'Name, email, and password are required.' },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email.' }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: 'Password must be at least 6 characters.' },
      { status: 400 }
    );
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    return NextResponse.json(
      { error: 'Email already in use.' },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  let user;
  try {
    user = await createUser({ name, email, passwordHash });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already in use.' },
        { status: 409 }
      );
    }
    throw error;
  }

  if (!user) {
    return NextResponse.json(
      { error: 'Email already in use.' },
      { status: 409 }
    );
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
