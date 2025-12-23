require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearDatabase() {
    console.log('Clearing database...');

    try {
        // Delete all receipts
        const deletedReceipts = await prisma.receipt.deleteMany({});
        console.log(`Deleted ${deletedReceipts.count} receipts`);

        // Delete all users
        const deletedUsers = await prisma.user.deleteMany({});
        console.log(`Deleted ${deletedUsers.count} users`);

        console.log('Database cleared successfully!');
    } catch (error) {
        console.error('Error clearing database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearDatabase();
