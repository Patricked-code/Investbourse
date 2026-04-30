import { prisma } from "@investbourse/db";
import type { ContactRequestInput } from "@investbourse/validators";

export async function listContactRequests() {
  return prisma.contactRequest.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getContactRequestById(id: string) {
  return prisma.contactRequest.findUnique({
    where: { id },
  });
}

export async function createContactRequest(input: ContactRequestInput) {
  return prisma.contactRequest.create({
    data: {
      fullName: input.fullName,
      organization: input.organization,
      email: input.email,
      requestType: input.requestType,
      message: input.message,
      status: "NEW",
    },
  });
}
