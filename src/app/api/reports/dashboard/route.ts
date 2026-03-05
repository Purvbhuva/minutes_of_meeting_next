import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const totalMeetings = await prisma.mOM_Meetings.count();
        const activeMeetings = await prisma.mOM_Meetings.count({ where: { IsCancelled: false } });
        const cancelledMeetings = await prisma.mOM_Meetings.count({ where: { IsCancelled: true } });

        const totalStaff = await prisma.mOM_Staff.count();
        const totalDocuments = await prisma.mOM_MeetingDocument.count();

        const upcomingMeetings = await prisma.mOM_Meetings.findMany({
            where: {
                IsCancelled: false,
                MeetingDate: { gte: new Date() }
            },
            orderBy: [
                { MeetingDate: 'asc' },
                { MeetingTime: 'asc' }
            ],
            take: 5
        });

        return NextResponse.json({
            metrics: {
                totalMeetings,
                activeMeetings,
                cancelledMeetings,
                totalStaff,
                totalDocuments
            },
            upcomingMeetings
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
