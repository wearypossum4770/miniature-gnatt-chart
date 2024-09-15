import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const reset = () => Promise.all([
	prisma.user.deleteMany()
])

export const seed = () => Promise.all([])

seed()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => Promise.resolve(prisma.$disconnect()));
