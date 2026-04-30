import { prisma } from "@investbourse/db";
import type { ContactRequestInput } from "@investbourse/validators";

export async function listContactRequests() {
  return prisma.contactRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          organization: true,
          role: true,
          status: true,
        },
      },
    },
  });
}

export async function listContactRequestsByUser(userId: string) {
  return prisma.contactRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getContactRequestById(id: string) {
  return prisma.contactRequest.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          organization: true,
          role: true,
          status: true,
        },
      },
    },
  });
}

export async function createContactRequest(input: ContactRequestInput) {
  return prisma.$transaction(async (tx) => {
    const matchingUser = await tx.user.findUnique({
      where: { email: input.email },
      select: { id: true, email: true },
    });

    const contactRequest = await tx.contactRequest.create({
      data: {
        fullName: input.fullName,
        organization: input.organization,
        email: input.email,
        requestType: input.requestType,
        message: input.message,
        status: "NEW",
        userId: matchingUser?.id ?? null,
      },
    });

    await tx.auditLog.create({
      data: {
        actorUserId: matchingUser?.id ?? null,
        action: "CONTACT_REQUEST_CREATED",
        entityType: "ContactRequest",
        entityId: contactRequest.id,
        metadata: {
          email: input.email,
          organization: input.organization,
          requestType: input.requestType,
          linkedUserId: matchingUser?.id ?? null,
        },
      },
    });

    return contactRequest;
  });
}
