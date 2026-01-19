import prisma from '@/lib/prisma';

export const defaultSettings = {
  timeFormat: '24h',
  weekStartDay: 1,
  theme: 'system',
  defaultBillable: true,
};

export async function getSettings(userId) {
  return prisma.userSettings.findUnique({
    where: { userId },
  });
}

export async function upsertSettings(userId, data) {
  return prisma.userSettings.upsert({
    where: { userId },
    update: {
      timeFormat: data.timeFormat ?? undefined,
      weekStartDay: data.weekStartDay ?? undefined,
      theme: data.theme ?? undefined,
      defaultBillable: data.defaultBillable ?? undefined,
    },
    create: {
      userId,
      ...defaultSettings,
      ...data,
    },
  });
}
