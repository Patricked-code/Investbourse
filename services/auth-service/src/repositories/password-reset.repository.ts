import { createHash, randomBytes } from "node:crypto";
import { loadServiceEnv } from "@investbourse/config";
import { passwordResetEmail, sendEmail } from "@investbourse/email";
import { prisma } from "@investbourse/db";
import { hashPassword } from "../lib/password.js";

function hashToken(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function requestPasswordReset(email: string) {
  const env = loadServiceEnv();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { ok: true as const, data: { requested: true, devToken: null } };
  }

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);
  const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const resetUrl = `${baseUrl}/compte/nouveau-mot-de-passe?token=${encodeURIComponent(rawToken)}`;

  await prisma.$transaction(async (tx) => {
    await tx.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt } });
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

  const message = passwordResetEmail({ resetUrl, fullName: user.fullName });
  await sendEmail({ to: user.email, ...message });

  const exposeDevToken = env.NODE_ENV !== "production" && env.PASSWORD_RESET_TOKEN_EXPOSE_IN_DEV;
  return { ok: true as const, data: { requested: true, devToken: exposeDevToken ? rawToken : null } };
}

export async function confirmPasswordReset(input: { token: string; password: string }) {
  const tokenHash = hashToken(input.token);
  const reset = await prisma.passwordResetToken.findUnique({ where: { tokenHash }, include: { user: true } });

  if (!reset || reset.usedAt || reset.expiresAt < new Date()) {
    return { ok: false as const, error: "INVALID_OR_EXPIRED_TOKEN" };
  }

  const updatedUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: reset.userId },
      data: { passwordHash: hashPassword(input.password), status: "ACTIVE" },
      select: { id: true, email: true, fullName: true, role: true, status: true },
    });

    await tx.passwordResetToken.update({ where: { id: reset.id }, data: { usedAt: new Date() } });
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
