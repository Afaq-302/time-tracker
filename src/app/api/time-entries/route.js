import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/apiAuth';
import { createTimeEntry, listTimeEntriesByUser } from '@/lib/db/timeEntries';
import { getProjectById } from '@/lib/db/projects';

export const runtime = 'nodejs';

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET(request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const entries = await listTimeEntriesByUser(user.id);
  return NextResponse.json({ entries });
}

export async function POST(request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const {
    projectId,
    entryType,
    description,
    startAt,
    endAt,
    durationSec,
    billable,
  } = body;

  if (!projectId || typeof projectId !== 'string') {
    return NextResponse.json({ error: 'projectId is required.' }, { status: 400 });
  }

  if (entryType && !['timer', 'manual'].includes(entryType)) {
    return NextResponse.json({ error: 'entryType must be timer or manual.' }, { status: 400 });
  }

  const project = await getProjectById(user.id, projectId);
  if (!project) {
    return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
  }

  const startDate = parseDate(startAt);
  const endDate = endAt ? parseDate(endAt) : null;

  if (!startDate) {
    return NextResponse.json({ error: 'startAt must be a valid date.' }, { status: 400 });
  }

  if (endAt && !endDate) {
    return NextResponse.json({ error: 'endAt must be a valid date.' }, { status: 400 });
  }

  if (endDate && endDate < startDate) {
    return NextResponse.json({ error: 'endAt cannot be before startAt.' }, { status: 400 });
  }

  const duration = Number(durationSec);
  if (!Number.isInteger(duration) || duration < 0) {
    return NextResponse.json({ error: 'durationSec must be a non-negative integer.' }, { status: 400 });
  }

  if (typeof billable !== 'boolean') {
    return NextResponse.json({ error: 'billable must be a boolean.' }, { status: 400 });
  }

  const entry = await createTimeEntry(user.id, {
    projectId,
    entryType: entryType ?? 'timer',
    description,
    startAt: startDate,
    endAt: endDate,
    durationSec: duration,
    billable,
  });

  return NextResponse.json({ entry }, { status: 201 });
}
