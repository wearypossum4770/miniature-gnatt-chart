import { PrismaClient } from "@prisma/client";
import { generateUserSeeds } from "@/seeds/users.server";

const prisma = new PrismaClient();

export const reset = () => Promise.all([prisma.user.deleteMany(), prisma.project.deleteMany()]);

export const seed = () => Promise.all([generateUserSeeds()]);

seed()
  .then()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => Promise.resolve(prisma.$disconnect()));
