import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Bulk assign members
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const meetingId = Number(id);
        const body = await req.json();
        const { memberIds } = body; // Array of staff IDs

        if (!memberIds || !Array.isArray(memberIds)) {
            return NextResponse.json({ message: 'memberIds array is required' }, { status: 400 });
        }

        // Check existing members
        const existing = await prisma.mOM_MeetingMember.findMany({
            where: { MeetingID: meetingId }
        });
        const existingStaffIds = existing.map(m => m.StaffID);

        const membersToAdd = memberIds
            .filter(id => !existingStaffIds.includes(id))
            .map(id => ({ MeetingID: meetingId, StaffID: id, IsPresent: false }));

        if (membersToAdd.length > 0) {
            await prisma.mOM_MeetingMember.createMany({
                data: membersToAdd
            });
        }

        const updatedMembers = await prisma.mOM_MeetingMember.findMany({
            where: { MeetingID: meetingId },
            include: { Staff: true }
        });

        return NextResponse.json(updatedMembers, { status: 201 });
    } catch (error) {
        console.error('Error assigning members:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// Update specific member attendance/remarks
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { MeetingMemberID, IsPresent, Remarks } = body;

        const updatedMember = await prisma.mOM_MeetingMember.update({
            where: { MeetingMemberID: Number(MeetingMemberID) },
            data: { IsPresent, Remarks }
        });

        return NextResponse.json(updatedMember);
    } catch (error) {
        console.error('Error updating member:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const memberId = searchParams.get('memberId');

        if (!memberId) return NextResponse.json({ message: 'memberId is required' }, { status: 400 });

        await prisma.mOM_MeetingMember.delete({
            where: { MeetingMemberID: Number(memberId) }
        });

        return NextResponse.json({ message: 'Removed successfully' });
    } catch (error) {
        console.error('Error removing member:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
