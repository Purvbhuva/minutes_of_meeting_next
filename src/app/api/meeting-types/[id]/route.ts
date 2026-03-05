import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const meetingType = await prisma.mOM_MeetingType.findUnique({
            where: { MeetingTypeID: Number(id) }
        });

        if (!meetingType) {
            return NextResponse.json({ message: 'Meeting Type not found' }, { status: 404 });
        }

        return NextResponse.json(meetingType);
    } catch (error) {
        console.error('Error fetching meeting type:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { MeetingTypeName, Remarks } = body;

        const updatedMeetingType = await prisma.mOM_MeetingType.update({
            where: { MeetingTypeID: Number(id) },
            data: { MeetingTypeName, Remarks }
        });

        return NextResponse.json(updatedMeetingType);
    } catch (error) {
        console.error('Error updating meeting type:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.mOM_MeetingType.delete({
            where: { MeetingTypeID: Number(id) }
        });

        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('Error deleting meeting type:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
