import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { institutionName, date, letterNumber, amount, level } = body;

        // Validate required fields
        if (!institutionName || !date || !letterNumber || !amount || !level) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Create receipt
        const receipt = await prisma.receipt.create({
            data: {
                institutionName,
                date: new Date(date),
                letterNumber,
                amount: parseFloat(amount),
                level
            }
        });

        return NextResponse.json(receipt, { status: 201 });
    } catch (error) {
        console.error('Error creating receipt:', error);
        return NextResponse.json(
            { error: 'Failed to create receipt' },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const institutionName = searchParams.get('institutionName');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        let where = {};

        if (institutionName) {
            where.institutionName = institutionName;
        }

        if (startDate && endDate) {
            // Create date objects at start and end of day
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);

            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            where.date = {
                gte: start,
                lte: end
            };
        }

        const receipts = await prisma.receipt.findMany({
            where,
            orderBy: {
                date: 'asc'
            }
        });

        // Convert dates to ISO strings to avoid serialization issues
        const formattedReceipts = receipts.map(receipt => ({
            ...receipt,
            date: receipt.date instanceof Date ? receipt.date.toISOString() : receipt.date,
            createdAt: receipt.createdAt instanceof Date ? receipt.createdAt.toISOString() : receipt.createdAt
        }));

        return NextResponse.json(formattedReceipts);
    } catch (error) {
        console.error('Error fetching receipts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch receipts', details: error.message },
            { status: 500 }
        );
    }
}
