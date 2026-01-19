import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/apiAuth';
import { getProjectById, updateProject, deleteProject } from '@/lib/db/projects';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const project = await getProjectById(user.id, params.id);
  if (!project) {
    return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
  }

  return NextResponse.json({ project });
}

export async function PATCH(request, { params }) {
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

  const parsedRate =
    hourlyRate === undefined || hourlyRate === null
      ? undefined
      : Number(hourlyRate);

  if (parsedRate !== undefined && Number.isNaN(parsedRate)) {
    return NextResponse.json({ error: 'hourlyRate must be a number.' }, { status: 400 });
  }

  const project = await updateProject(user.id, params.id, {
    name,
    clientName,
    hourlyRate: parsedRate,
    color,
    isActive,
  });

  if (!project) {
    return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
  }

  return NextResponse.json({ project });
}

export async function DELETE(request, { params }) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const deleted = await deleteProject(user.id, params.id);
  if (!deleted) {
    return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
