require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Starting database seeding...');

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const user = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            email: 'admin@southernprovince.gov.lk',
            password: hashedPassword
        }
    });

    console.log('Created user:', { username: user.username, email: user.email });

    // Create sample receipts
    const sampleReceipts = [
        {
            institutionName: 'Galle Divisional Secretariat',
            date: new Date('2024-01-15'),
            letterNumber: 'GDS/2024/001',
            amount: 150000.00,
            level: 'Divisional'
        },
        {
            institutionName: 'Matara Divisional Secretariat',
            date: new Date('2024-01-20'),
            letterNumber: 'MDS/2024/002',
            amount: 225000.50,
            level: 'Divisional'
        },
        {
            institutionName: 'Hambantota Divisional Secretariat',
            date: new Date('2024-02-05'),
            letterNumber: 'HDS/2024/003',
            amount: 180000.75,
            level: 'Divisional'
        },
        {
            institutionName: 'Galle Divisional Secretariat',
            date: new Date('2024-02-10'),
            letterNumber: 'GDS/2024/004',
            amount: 95000.00,
            level: 'Grama Niladhari'
        }
    ];

    for (const receipt of sampleReceipts) {
        await prisma.receipt.create({
            data: receipt
        });
    }

    console.log(`Created ${sampleReceipts.length} sample receipts`);
    console.log('Database seeding completed!');
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
