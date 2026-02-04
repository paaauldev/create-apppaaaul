import { db } from "@/lib/db";

async function main() {
    //Create database data
    console.log("Database seeded");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
}).finally(async () => {
    await db.$disconnect();
});