import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get unique institution names
        const receipts = await prisma.receipt.findMany({
            select: {
                institutionName: true
            },
            distinct: ['institutionName'],
            orderBy: {
                institutionName: 'asc'
            }
        });

        const institutions = receipts.map(r => r.institutionName);

        return NextResponse.json(institutions);
    } catch (error) {
        console.error('Error fetching institutions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch institutions' },
            { status: 500 }
        );
    }
}
