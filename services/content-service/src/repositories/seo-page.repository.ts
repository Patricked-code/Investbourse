import { prisma } from "@investbourse/db";
import type { SeoPageInput } from "@investbourse/validators";

export async function listSeoPages() {
  return prisma.seoPage.findMany({
    orderBy: { slug: "asc" },
  });
}

export async function getSeoPageBySlug(slug: string) {
  return prisma.seoPage.findUnique({
    where: { slug },
  });
}

export async function upsertSeoPage(input: SeoPageInput) {
  return prisma.seoPage.upsert({
    where: { slug: input.slug },
    update: {
      title: input.title,
      metaTitle: input.metaTitle,
      description: input.description,
      schemaType: input.schemaType,
      h1: input.h1,
      h2: input.h2,
      h3: input.h3,
      h4: input.h4,
      h5: input.h5,
      keywords: input.keywords,
      isPublished: input.isPublished,
    },
    create: {
      slug: input.slug,
      title: input.title,
      metaTitle: input.metaTitle,
      description: input.description,
      schemaType: input.schemaType,
      h1: input.h1,
      h2: input.h2,
      h3: input.h3,
      h4: input.h4,
      h5: input.h5,
      keywords: input.keywords,
      isPublished: input.isPublished,
    },
  });
}
