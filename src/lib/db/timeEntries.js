import prisma from '@/lib/prisma';

export async function createTimeEntry(userId, data) {
  return prisma.timeEntry.create({
    data: {
      userId,
      projectId: data.projectId,
      entryType: data.entryType ?? 'timer',
      description: data.description ?? null,
      startAt: data.startAt,
      endAt: data.endAt ?? null,
      durationSec: data.durationSec,
      billable: data.billable,
    },
  });
}

export async function listTimeEntriesByUser(userId) {
  return prisma.timeEntry.findMany({
    where: { userId },
    orderBy: { startAt: 'desc' },
  });
}

export async function listTimeEntriesByProject(userId, projectId) {
  return prisma.timeEntry.findMany({
    where: { userId, projectId },
    orderBy: { startAt: 'desc' },
  });
}

export async function getTimeEntryById(userId, entryId) {
  return prisma.timeEntry.findFirst({
    where: { id: entryId, userId },
  });
}

export async function updateTimeEntry(userId, entryId, data) {
  const existing = await getTimeEntryById(userId, entryId);
  if (!existing) return null;

  return prisma.timeEntry.update({
    where: { id: entryId },
    data: {
      projectId: data.projectId ?? existing.projectId,
      entryType: data.entryType ?? existing.entryType,
      description: data.description ?? existing.description,
      startAt: data.startAt ?? existing.startAt,
      endAt: data.endAt ?? existing.endAt,
      durationSec: data.durationSec ?? existing.durationSec,
      billable: data.billable ?? existing.billable,
    },
  });
}

export async function deleteTimeEntry(userId, entryId) {
  const existing = await getTimeEntryById(userId, entryId);
  if (!existing) return false;

  await prisma.timeEntry.delete({
    where: { id: entryId },
  });
  return true;
}
