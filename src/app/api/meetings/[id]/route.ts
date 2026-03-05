import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const meeting = await prisma.mOM_Meetings.findUnique({
            where: { MeetingID: Number(id) },
            include: {
                MeetingType: true,
                MOM_MeetingMember: {
                    include: { Staff: true }
                },
                MOM_MeetingDocument: true
            }
        });

        if (!meeting) return NextResponse.json({ message: 'Meeting not found' }, { status: 404 });
        return NextResponse.json(meeting);
    } catch (error) {
        console.error('Error fetching meeting:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const {
            MeetingTitle, MeetingDescription, MeetingDate, MeetingTime,
            MeetingTypeID, Remarks, IsCancelled, CancellationReason
        } = body;

        const dataToUpdate: any = {
            MeetingTitle, MeetingDescription, MeetingTime,
            MeetingTypeID: MeetingTypeID ? Number(MeetingTypeID) : undefined,
            Remarks, IsCancelled, CancellationReason
        };

        if (MeetingDate) dataToUpdate.MeetingDate = new Date(MeetingDate);
        if (IsCancelled && !dataToUpdate.CancellationDateTime) {
            dataToUpdate.CancellationDateTime = new Date();
        }

        const updatedMeeting = await prisma.mOM_Meetings.update({
            where: { MeetingID: Number(id) },
            data: dataToUpdate,
            include: { MeetingType: true }
        });

        return NextResponse.json(updatedMeeting);
    } catch (error) {
        console.error('Error updating meeting:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.mOM_Meetings.delete({
            where: { MeetingID: Number(id) }
        });
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('Error deleting meeting:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
