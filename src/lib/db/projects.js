import prisma from '@/lib/prisma';

export async function createProject(userId, data) {
  return prisma.project.create({
    data: {
      userId,
      name: data.name,
      clientName: data.clientName ?? null,
      hourlyRate: data.hourlyRate ?? null,
      color: data.color ?? null,
      isActive: data.isActive ?? true,
    },
  });
}

export async function listProjectsByUser(userId) {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getProjectById(userId, projectId) {
  return prisma.project.findFirst({
    where: { id: projectId, userId },
  });
}

export async function updateProject(userId, projectId, data) {
  const existing = await getProjectById(userId, projectId);
  if (!existing) return null;

  return prisma.project.update({
    where: { id: projectId },
    data: {
      name: data.name ?? existing.name,
      clientName: data.clientName ?? existing.clientName,
      hourlyRate: data.hourlyRate ?? existing.hourlyRate,
      color: data.color ?? existing.color,
      isActive: data.isActive ?? existing.isActive,
    },
  });
}

export async function deleteProject(userId, projectId) {
  const existing = await getProjectById(userId, projectId);
  if (!existing) return false;

  await prisma.project.delete({
    where: { id: projectId },
  });
  return true;
}
