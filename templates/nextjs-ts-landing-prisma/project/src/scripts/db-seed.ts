import { PrismaClient, Prisma } from "@prisma/client";


const prisma = new PrismaClient();

async function main() {
    //Create database data
    console.log("Database seeded");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});