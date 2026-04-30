import { pbkdf2Sync, randomBytes } from "node:crypto";
import { PrismaClient, UserRole, UserStatus } from "@prisma/client";

const prisma = new PrismaClient();
const iterations = 120_000;
const keyLength = 64;
const digest = "sha512";

function hashPassword(password: string) {
  const salt = randomBytes(32).toString("hex");
  const derivedKey = pbkdf2Sync(password, salt, iterations, keyLength, digest).toString("hex");
  return `pbkdf2$${iterations}$${keyLength}$${digest}$${salt}$${derivedKey}`;
}

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@investbourse.local";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe_Admin_2026!";
  const fullName = process.env.SEED_ADMIN_FULL_NAME ?? "Administrateur Investbourse";

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      fullName,
      organization: "Investbourse",
      passwordHash: hashPassword(password),
      role: UserRole.SUPERADMIN,
      status: UserStatus.ACTIVE,
    },
    create: {
      fullName,
      organization: "Investbourse",
      email,
      passwordHash: hashPassword(password),
      role: UserRole.SUPERADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: user.id,
      action: "SUPERADMIN_BOOTSTRAPPED",
      entityType: "User",
      entityId: user.id,
      metadata: {
        email: user.email,
        role: user.role,
        source: "database/prisma/seed-admin.ts",
      },
    },
  });

  console.log(`SUPERADMIN ready: ${email}`);
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
