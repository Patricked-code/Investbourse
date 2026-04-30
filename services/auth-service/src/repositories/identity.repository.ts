import { prisma, UserRole, UserStatus } from "@investbourse/db";
import type { UserRegistrationInput } from "@investbourse/validators";
import { hashPassword, verifyPassword } from "../lib/password.js";

export async function registerIdentity(input: UserRegistrationInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });

  if (existing) {
    return { ok: false as const, error: "USER_ALREADY_EXISTS" };
  }

  const user = await prisma.user.create({
    data: {
      fullName: input.fullName,
      organization: input.organization,
      email: input.email,
      passwordHash: hashPassword(input.password),
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      fullName: true,
      organization: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: user.id,
      action: "USER_REGISTERED",
      entityType: "User",
      entityId: user.id,
      metadata: { email: user.email, role: user.role, status: user.status },
    },
  });

  return { ok: true as const, data: user };
}

export async function authenticateIdentity(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { ok: false as const, error: "INVALID_CREDENTIALS" };
  }

  if (user.status !== UserStatus.ACTIVE) {
    return { ok: false as const, error: "USER_NOT_ACTIVE" };
  }

  await prisma.auditLog.create({
    data: {
      actorUserId: user.id,
      action: "USER_LOGIN_SUCCESS",
      entityType: "User",
      entityId: user.id,
      metadata: { email: user.email, role: user.role },
    },
  });

  return {
    ok: true as const,
    data: {
      id: user.id,
      fullName: user.fullName,
      organization: user.organization,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
}

export async function getIdentityById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      organization: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
