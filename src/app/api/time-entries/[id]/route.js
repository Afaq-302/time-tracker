import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/apiAuth';
import { getProjectById } from '@/lib/db/projects';
import { getTimeEntryById, updateTimeEntry, deleteTimeEntry } from '@/lib/db/timeEntries';

export const runtime = 'nodejs';

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET(request, { params }) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const entry = await getTimeEntryById(user.id, params.id);
  if (!entry) {
    return NextResponse.json({ error: 'Time entry not found.' }, { status: 404 });
  }

  return NextResponse.json({ entry });
}

export async function PATCH(request, { params }) {
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

  if (projectId) {
    const project = await getProjectById(user.id, projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }
  }

  if (entryType && !['timer', 'manual'].includes(entryType)) {
    return NextResponse.json({ error: 'entryType must be timer or manual.' }, { status: 400 });
  }

  const startDate = startAt ? parseDate(startAt) : undefined;
  const endDate = endAt ? parseDate(endAt) : undefined;

  if (startAt && !startDate) {
    return NextResponse.json({ error: 'startAt must be a valid date.' }, { status: 400 });
  }

  if (endAt && !endDate) {
    return NextResponse.json({ error: 'endAt must be a valid date.' }, { status: 400 });
  }

  if (startDate && endDate && endDate < startDate) {
    return NextResponse.json({ error: 'endAt cannot be before startAt.' }, { status: 400 });
  }

  const duration =
    durationSec === undefined || durationSec === null
      ? undefined
      : Number(durationSec);

  if (duration !== undefined && (!Number.isInteger(duration) || duration < 0)) {
    return NextResponse.json({ error: 'durationSec must be a non-negative integer.' }, { status: 400 });
  }

  if (billable !== undefined && typeof billable !== 'boolean') {
    return NextResponse.json({ error: 'billable must be a boolean.' }, { status: 400 });
  }

  const entry = await updateTimeEntry(user.id, params.id, {
    projectId,
    entryType,
    description,
    startAt: startDate,
    endAt: endDate,
    durationSec: duration,
    billable,
  });

  if (!entry) {
    return NextResponse.json({ error: 'Time entry not found.' }, { status: 404 });
  }

  return NextResponse.json({ entry });
}

export async function DELETE(request, { params }) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const deleted = await deleteTimeEntry(user.id, params.id);
  if (!deleted) {
    return NextResponse.json({ error: 'Time entry not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
