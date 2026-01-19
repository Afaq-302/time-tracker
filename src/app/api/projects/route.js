import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/apiAuth';
import { createProject, listProjectsByUser } from '@/lib/db/projects';

export const runtime = 'nodejs';

export async function GET(request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const projects = await listProjectsByUser(user.id);
  return NextResponse.json({ projects });
}

export async function POST(request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const {
    name,
    clientName,
    hourlyRate,
    color,
    isActive,
  } = body;

  if (!name || typeof name !== 'string') {
    return NextResponse.json({ error: 'Project name is required.' }, { status: 400 });
  }

  const parsedRate =
    hourlyRate === undefined || hourlyRate === null
      ? null
      : Number(hourlyRate);

  if (parsedRate !== null && Number.isNaN(parsedRate)) {
    return NextResponse.json({ error: 'hourlyRate must be a number.' }, { status: 400 });
  }

  const project = await createProject(user.id, {
    name,
    clientName,
    hourlyRate: parsedRate,
    color,
    isActive,
  });

  return NextResponse.json({ project }, { status: 201 });
}
