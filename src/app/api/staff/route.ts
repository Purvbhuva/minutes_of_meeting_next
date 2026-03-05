import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const staffList = await prisma.mOMStaff.findMany({
            select: {
                StaffID: true,
                StaffName: true,
                MobileNo: true,
                EmailAddress: true,
                Role: true,
                Remarks: true,
                Created: true,
                Modified: true,
            },
            orderBy: { StaffName: 'asc' }
        });
        return NextResponse.json(staffList);
    } catch (error) {
        console.error('Error fetching staff:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { StaffName, MobileNo, EmailAddress, Password, Role, Remarks } = body;

        if (!StaffName || !EmailAddress || !Password) {
            return NextResponse.json({ message: 'StaffName, EmailAddress, Password are required' }, { status: 400 });
        }

        const existingUser = await prisma.mOMStaff.findUnique({
            where: { EmailAddress }
        });

        if (existingUser) {
            return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        const newStaff = await prisma.mOMStaff.create({
            data: {
                StaffName,
                MobileNo,
                EmailAddress,
                Password: hashedPassword,
                Role: Role || 'STAFF',
                Remarks
            },
            select: {
                StaffID: true,
                StaffName: true,
                EmailAddress: true,
                Role: true,
            }
        });

        return NextResponse.json(newStaff, { status: 201 });
    } catch (error) {
        console.error('Error creating staff:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
