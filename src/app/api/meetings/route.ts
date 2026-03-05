import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status'); // e.g., 'cancelled', 'active'

        let whereClause = {};
        if (status === 'cancelled') {
            whereClause = { IsCancelled: true };
        } else if (status === 'active') {
            whereClause = { IsCancelled: false };
        }

        const meetings = await prisma.mOM_Meetings.findMany({
            where: whereClause,
            include: {
                MeetingType: true,
                MOM_MeetingMember: { include: { Staff: true } },
                MOM_MeetingDocument: true
            },
            orderBy: [
                { MeetingDate: 'desc' },
                { MeetingTime: 'desc' }
            ]
        });

        return NextResponse.json(meetings);
    } catch (error) {
        console.error('Error fetching meetings:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            MeetingTitle,
            MeetingDescription,
            MeetingDate,
            MeetingTime,
            MeetingTypeID,
            Remarks,
            Members // Array of StaffIDs
        } = body;

        if (!MeetingTitle || !MeetingDate || !MeetingTime || !MeetingTypeID) {
            return NextResponse.json({ message: 'Missing required meeting details' }, { status: 400 });
        }

        const newMeeting = await prisma.mOM_Meetings.create({
            data: {
                MeetingTitle,
                MeetingDescription,
                MeetingDate: new Date(MeetingDate),
                MeetingTime,
                MeetingTypeID: Number(MeetingTypeID),
                Remarks,
                MOM_MeetingMember: Members && Members.length > 0 ? {
                    create: Members.map((staffId: number) => ({
                        StaffID: staffId,
                        IsPresent: false
                    }))
                } : undefined
            },
            include: {
                MeetingType: true,
                MOM_MeetingMember: true
            }
        });

        return NextResponse.json(newMeeting, { status: 201 });
    } catch (error) {
        console.error('Error creating meeting:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
