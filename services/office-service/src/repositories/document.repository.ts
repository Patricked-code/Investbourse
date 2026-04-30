import { prisma } from "@investbourse/db";

export type MissionDocumentInput = {
  title: string;
  description?: string | null;
  fileName: string;
  fileUrl: string;
  category?: "NOTE_CADRAGE" | "RAPPORT_ANALYSE" | "GRILLE_SCORING" | "CAHIER_CHARGES" | "CONTRAT" | "LIVRABLE" | "AUTRE";
  visibility?: "INTERNAL_ONLY" | "CLIENT_VISIBLE";
  contactRequestId?: string | null;
  userId?: string | null;
  uploadedByLabel?: string | null;
  actorUserId?: string | null;
};

export async function listMissionDocuments() {
  return prisma.missionDocument.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      contactRequest: true,
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

export async function listMissionDocumentsForUser(userId: string) {
  return prisma.missionDocument.findMany({
    where: {
      userId,
      visibility: "CLIENT_VISIBLE",
    },
    orderBy: { createdAt: "desc" },
    include: {
      contactRequest: true,
    },
  });
}

export async function listMissionDocumentsByContactRequest(contactRequestId: string) {
  return prisma.missionDocument.findMany({
    where: { contactRequestId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createMissionDocument(input: MissionDocumentInput) {
  return prisma.$transaction(async (tx) => {
    const document = await tx.missionDocument.create({
      data: {
        title: input.title,
        description: input.description ?? null,
        fileName: input.fileName,
        fileUrl: input.fileUrl,
        category: input.category ?? "AUTRE",
        visibility: input.visibility ?? "INTERNAL_ONLY",
        contactRequestId: input.contactRequestId ?? null,
        userId: input.userId ?? null,
        uploadedByLabel: input.uploadedByLabel ?? null,
      },
    });

    await tx.auditLog.create({
      data: {
        actorUserId: input.actorUserId ?? null,
        action: "MISSION_DOCUMENT_CREATED",
        entityType: "MissionDocument",
        entityId: document.id,
        metadata: {
          title: document.title,
          category: document.category,
          visibility: document.visibility,
          contactRequestId: document.contactRequestId,
          userId: document.userId,
        },
      },
    });

    return document;
  });
}
