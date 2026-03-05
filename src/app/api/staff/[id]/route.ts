import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const staff = await prisma.mOM_Staff.findUnique({
            where: { StaffID: Number(id) },
            select: {
                StaffID: true,
                StaffName: true,
                MobileNo: true,
                EmailAddress: true,
                Role: true,
                Remarks: true,
                Created: true,
                Modified: true,
            }
        });

        if (!staff) {
            return NextResponse.json({ message: 'Staff not found' }, { status: 404 });
        }

        return NextResponse.json(staff);
    } catch (error) {
        console.error('Error fetching staff:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { StaffName, MobileNo, EmailAddress, Password, Role, Remarks } = body;

        const dataToUpdate: any = { StaffName, MobileNo, EmailAddress, Role, Remarks };

        if (Password) {
            dataToUpdate.Password = await bcrypt.hash(Password, 10);
        }

        const updatedStaff = await prisma.mOM_Staff.update({
            where: { StaffID: Number(id) },
            data: dataToUpdate,
            select: {
                StaffID: true,
                StaffName: true,
                EmailAddress: true,
                Role: true,
            }
        });

        return NextResponse.json(updatedStaff);
    } catch (error) {
        console.error('Error updating staff:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.mOM_Staff.delete({
            where: { StaffID: Number(id) }
        });

        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('Error deleting staff:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
