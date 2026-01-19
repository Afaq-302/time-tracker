import { verifySession, SESSION_COOKIE } from '@/lib/session';
import { getUserById } from '@/lib/db/users';

export async function getAuthUser(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await verifySession(token);
  if (!session?.uid) return null;

  return getUserById(session.uid);
}
