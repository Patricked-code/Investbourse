import { prisma } from "@investbourse/db";

export type ClientMessageInput = {
  subject: string;
  body: string;
  senderType?: "CLIENT" | "ADMIN" | "SYSTEM";
  senderLabel: string;
  contactRequestId?: string | null;
  userId?: string | null;
  actorUserId?: string | null;
};

export async function listClientMessages() {
  return prisma.clientMessage.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, fullName: true, email: true, organization: true, role: true, status: true } },
      contactRequest: true,
    },
  });
}

export async function listClientMessagesForUser(userId: string) {
  return prisma.clientMessage.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { contactRequest: true },
  });
}

export async function listClientMessagesByContactRequest(contactRequestId: string) {
  return prisma.clientMessage.findMany({
    where: { contactRequestId },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { id: true, fullName: true, email: true, organization: true } } },
  });
}

export async function createClientMessage(input: ClientMessageInput) {
  return prisma.$transaction(async (tx) => {
    const message = await tx.clientMessage.create({
      data: {
        subject: input.subject,
        body: input.body,
        senderType: input.senderType ?? "CLIENT",
        senderLabel: input.senderLabel,
        contactRequestId: input.contactRequestId ?? null,
        userId: input.userId ?? null,
      },
    });

    await tx.auditLog.create({
      data: {
        actorUserId: input.actorUserId ?? input.userId ?? null,
        action: "CLIENT_MESSAGE_CREATED",
        entityType: "ClientMessage",
        entityId: message.id,
        metadata: {
          subject: message.subject,
          senderType: message.senderType,
          contactRequestId: message.contactRequestId,
          userId: message.userId,
        },
      },
    });

    return message;
  });
}
