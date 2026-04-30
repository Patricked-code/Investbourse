import { prisma } from "@investbourse/db";
import type { OfficeMessageInput } from "@investbourse/validators";

export async function getWorkDashboard() {
  const [total, open, review, answered, archived, auditCount] = await Promise.all([
    prisma.officeMessage.count(),
    prisma.officeMessage.count({ where: { status: "OPEN" } }),
    prisma.officeMessage.count({ where: { status: "REVIEW" } }),
    prisma.officeMessage.count({ where: { status: "ANSWERED" } }),
    prisma.officeMessage.count({ where: { status: "ARCHIVED" } }),
    prisma.auditLog.count({ where: { entityType: "OfficeMessage" } }),
  ]);

  return { total, open, review, answered, archived, auditCount };
}

export async function listWorkItems() {
  return prisma.officeMessage.findMany({
    orderBy: { updatedAt: "desc" },
    include: { contactRequest: true },
  });
}

export async function listWorkItemsByContactRequest(contactRequestId: string) {
  return prisma.officeMessage.findMany({
    where: { contactRequestId },
    orderBy: { updatedAt: "desc" },
    include: { contactRequest: true },
  });
}

export async function listAuditItemsByContactRequest(contactRequestId: string) {
  return prisma.auditLog.findMany({
    where: {
      entityType: "ContactRequest",
      entityId: contactRequestId,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function listRecentAuditItems() {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function createWorkItem(input: OfficeMessageInput) {
  return prisma.$transaction(async (tx) => {
    const officeMessage = await tx.officeMessage.create({
      data: {
        contactRequestId: input.contactRequestId,
        status: input.status,
        priority: input.priority,
        assignedToLabel: input.assignedTo ?? null,
        note: input.note ?? null,
      },
      include: { contactRequest: true },
    });

    await tx.auditLog.create({
      data: {
        action: "OFFICE_MESSAGE_CREATED",
        entityType: "ContactRequest",
        entityId: input.contactRequestId,
        metadata: {
          officeMessageId: officeMessage.id,
          status: input.status,
          priority: input.priority,
          assignedTo: input.assignedTo ?? null,
          hasNote: Boolean(input.note),
        },
      },
    });

    return officeMessage;
  });
}
