import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const documentId = Number(id);

        const document = await prisma.mOM_MeetingDocument.findUnique({
            where: { MeetingDocumentID: documentId }
        });

        if (!document) {
            return NextResponse.json({ message: 'Document not found' }, { status: 404 });
        }

        // Try to delete file from filesystem
        if (document.DocumentPath) {
            const fileName = document.DocumentPath.replace('/uploads/', '');
            const filePath = join(process.cwd(), 'public', 'uploads', fileName);
            try {
                await unlink(filePath);
            } catch (e) {
                console.error('File not found on disk, skipping delete', e);
            }
        }

        await prisma.mOM_MeetingDocument.delete({
            where: { MeetingDocumentID: documentId }
        });

        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('Error deleting document:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
