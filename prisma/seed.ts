import { generateUserSeeds } from "@/seeds/users.server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const reset = () => Promise.all([prisma.user.deleteMany(), prisma.project.deleteMany()]);

export const seed = async () => Promise.all([generateUserSeeds()]);

seed()
  .then(e=>console.log(JSON.parse(JSON.stringify(e, null, 3))))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => Promise.resolve(prisma.$disconnect()));
