import { prisma, UserRole, UserStatus } from "@investbourse/db";

export async function listUsersForAdministration() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
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

export async function getUserForAdministration(id: string) {
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

export async function updateUserRoleAndStatus(input: {
  id: string;
  role?: "USER" | "ADMIN" | "SUPERADMIN";
  status?: "PENDING_VERIFICATION" | "ACTIVE" | "DISABLED";
  actorUserId?: string | null;
}) {
  const data: { role?: UserRole; status?: UserStatus } = {};

  if (input.role) data.role = input.role as UserRole;
  if (input.status) data.status = input.status as UserStatus;

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: input.id },
      data,
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

    await tx.auditLog.create({
      data: {
        actorUserId: input.actorUserId ?? null,
        action: "USER_ADMIN_UPDATED",
        entityType: "User",
        entityId: input.id,
        metadata: {
          role: input.role ?? null,
          status: input.status ?? null,
        },
      },
    });

    return user;
  });
}
