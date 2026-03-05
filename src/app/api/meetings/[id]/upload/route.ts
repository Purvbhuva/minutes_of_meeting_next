import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const remarks = formData.get('remarks') as string;
        const meetingId = Number(id);

        if (!file) {
            return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Provide a valid dir structure or ensure "public/uploads" exists before this point in reality.
        // For now assuming `/public/uploads` might need to be created statically or mapped.
        const uniqueName = `${Date.now()}-${file.name}`;
        const path = join(process.cwd(), 'public', 'uploads', uniqueName);

        // We would need to ensure directory exists, simplistic demo code:
        // await mkdir(join(process.cwd(), 'public', 'uploads'), { recursive: true });

        // Note: in a real application, you'd save this to an S3 bucket or similar.
        await writeFile(path, buffer);

        const newDocument = await prisma.mOM_MeetingDocument.create({
            data: {
                MeetingID: meetingId,
                DocumentName: file.name,
                DocumentPath: `/uploads/${uniqueName}`,
                Remarks: remarks || null
            }
        });

        return NextResponse.json(newDocument, { status: 201 });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
