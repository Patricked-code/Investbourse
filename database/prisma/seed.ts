import { PrismaClient, UserRole, UserStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.seoPage.upsert({
    where: { slug: "/" },
    update: {},
    create: {
      slug: "/",
      title: "Conseil en investissements boursiers institutionnels UEMOA",
      metaTitle: "Investbourse | Conseil en investissements boursiers institutionnels UEMOA",
      description: "Conseil en investissements boursiers pour institutionnels UEMOA : analyse de marchés, sélection OPCVM, appels d’offres, analyse de partenaires et gouvernance.",
      schemaType: "FinancialService",
      h1: "Conseil en investissements boursiers pour investisseurs institutionnels UEMOA",
      h2: "Analyse, sélection, appels d’offres et suivi des décisions d’investissement",
      h3: "Une approche construite pour les comités d’investissement",
      h4: "Traçabilité, gouvernance et transparence des recommandations",
      h5: "Cabinet sans réception de fonds ni conservation de titres",
      keywords: ["UEMOA", "OPCVM", "conseil investissement", "institutionnels"],
      isPublished: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@investbourse.local" },
    update: {},
    create: {
      fullName: "Administrateur Investbourse",
      organization: "Investbourse",
      email: "admin@investbourse.local",
      role: UserRole.SUPERADMIN,
      status: UserStatus.ACTIVE,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
