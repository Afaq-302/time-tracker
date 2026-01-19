import { NextResponse } from 'next/server';
import { verifySession, SESSION_COOKIE } from '@/lib/session';
import { getUserById, publicUser } from '@/lib/db/users';

export const runtime = 'nodejs';

export async function GET(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const session = await verifySession(token);
  if (!session?.uid) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await getUserById(session.uid);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user: publicUser(user) });
}
