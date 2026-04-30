import { prisma } from "@investbourse/db";
import type { OfficeMessageInput } from "@investbourse/validators";

export async function getWorkDashboard() {
  const [total, open, review, answered, archived] = await Promise.all([
    prisma.officeMessage.count(),
    prisma.officeMessage.count({ where: { status: "OPEN" } }),
    prisma.officeMessage.count({ where: { status: "REVIEW" } }),
    prisma.officeMessage.count({ where: { status: "ANSWERED" } }),
    prisma.officeMessage.count({ where: { status: "ARCHIVED" } }),
  ]);

  return { total, open, review, answered, archived };
}

export async function listWorkItems() {
  return prisma.officeMessage.findMany({
    orderBy: { updatedAt: "desc" },
    include: { contactRequest: true },
  });
}

export async function createWorkItem(input: OfficeMessageInput) {
  return prisma.officeMessage.create({
    data: {
      contactRequestId: input.contactRequestId,
      status: input.status,
      priority: input.priority,
      assignedToLabel: input.assignedTo ?? null,
      note: input.note ?? null,
    },
    include: { contactRequest: true },
  });
}
