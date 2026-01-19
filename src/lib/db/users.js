import prisma from '@/lib/prisma';

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export async function createUser({ name, email, passwordHash }) {
  return prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizeEmail(email),
      passwordHash,
    },
  });
}

export async function getUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email: normalizeEmail(email) },
  });
}

export async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export function publicUser(user) {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}
