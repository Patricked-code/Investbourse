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
  actorRole?: "USER" | "ADMIN" | "SUPERADMIN";
}) {
  const data: { role?: UserRole; status?: UserStatus } = {};
  if (input.role) data.role = input.role as UserRole;
  if (input.status) data.status = input.status as UserStatus;

  return prisma.$transaction(async (tx) => {
    const target = await tx.user.findUnique({
      where: { id: input.id },
      select: { id: true, role: true, status: true },
    });

    if (!target) throw new Error("USER_NOT_FOUND");

    const actorRole = input.actorRole ?? "ADMIN";

    if ((input.role === "SUPERADMIN" || target.role === "SUPERADMIN") && actorRole !== "SUPERADMIN") {
      throw new Error("PRIVILEGED_ROLE_UPDATE_REQUIRES_SUPERADMIN");
    }

    if (input.actorUserId === input.id && input.role && input.role !== target.role) {
      throw new Error("SELF_ROLE_CHANGE_FORBIDDEN");
    }

    if (target.role === "SUPERADMIN" && input.status === "DISABLED") {
      const activeSuperAdmins = await tx.user.count({ where: { role: "SUPERADMIN", status: "ACTIVE" } });
      if (activeSuperAdmins <= 1) throw new Error("LAST_ACTIVE_SUPERADMIN_CANNOT_BE_DISABLED");
    }

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
          previousRole: target.role,
          previousStatus: target.status,
        },
      },
    });

    return user;
  });
}
