import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@investbourse/db";
import { hashPassword } from "../lib/password.js";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { ok: true as const, data: { requested: true, resetToken: null } };
  }

  const resetToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(resetToken);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

  await prisma.$transaction(async (tx) => {
    await tx.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    await tx.auditLog.create({
      data: {
        actorUserId: user.id,
        action: "PASSWORD_RESET_REQUESTED",
        entityType: "User",
        entityId: user.id,
        metadata: { email: user.email, expiresAt },
      },
    });
  });

  return { ok: true as const, data: { requested: true, resetToken } };
}

export async function confirmPasswordReset(input: { token: string; password: string }) {
  const tokenHash = hashToken(input.token);

  const reset = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!reset || reset.usedAt || reset.expiresAt < new Date()) {
    return { ok: false as const, error: "INVALID_OR_EXPIRED_TOKEN" };
  }

  const updatedUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: reset.userId },
      data: { passwordHash: hashPassword(input.password), status: "ACTIVE" },
      select: { id: true, email: true, fullName: true, role: true, status: true },
    });

    await tx.passwordResetToken.update({
      where: { id: reset.id },
      data: { usedAt: new Date() },
    });

    await tx.auditLog.create({
      data: {
        actorUserId: user.id,
        action: "PASSWORD_RESET_CONFIRMED",
        entityType: "User",
        entityId: user.id,
        metadata: { email: user.email },
      },
    });

    return user;
  });

  return { ok: true as const, data: updatedUser };
}
