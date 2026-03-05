import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as jose from 'jose';

export async function GET(req: Request) {
    try {
        const cookieHeader = req.headers.get('cookie');
        const token = cookieHeader?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-development');
        const { payload } = await jose.jwtVerify(token, secret);

        if (!payload || !payload.id) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        const user = await prisma.mOMStaff.findUnique({
            where: { StaffID: payload.id as number },
            select: {
                StaffID: true,
                StaffName: true,
                EmailAddress: true,
                MobileNo: true,
                Role: true,
                Remarks: true,
            }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);

    } catch (error) {
        console.error('Profile error:', error);
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
}
