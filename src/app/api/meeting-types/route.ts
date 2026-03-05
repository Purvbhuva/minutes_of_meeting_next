import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const meetingTypes = await prisma.mOM_MeetingType.findMany({
            orderBy: { MeetingTypeName: 'asc' }
        });
        return NextResponse.json(meetingTypes);
    } catch (error) {
        console.error('Error fetching meeting types:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { MeetingTypeName, Remarks } = body;

        if (!MeetingTypeName) {
            return NextResponse.json({ message: 'MeetingTypeName is required' }, { status: 400 });
        }

        const newMeetingType = await prisma.mOM_MeetingType.create({
            data: {
                MeetingTypeName,
                Remarks
            }
        });

        return NextResponse.json(newMeetingType, { status: 201 });
    } catch (error) {
        console.error('Error creating meeting type:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
