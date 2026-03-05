'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function MeetingDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [meeting, setMeeting] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState<File | null>(null);

    const fetchMeeting = async () => {
        setLoading(true);
        const res = await fetch(`/api/meetings/${params.id}`);
        if (res.ok) {
            setMeeting(await res.json());
        } else {
            toast.error('Meeting not found');
            router.push('/meetings');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMeeting();
    }, [params.id]);

    const toggleAttendance = async (memberId: number, currentPresence: boolean) => {
        const res = await fetch(`/api/meetings/${params.id}/members`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ MeetingMemberID: memberId, IsPresent: !currentPresence })
        });
        if (res.ok) {
            toast.success('Attendance updated');
            fetchMeeting();
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`/api/meetings/${params.id}/upload`, {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            toast.success('Document uploaded');
            setFile(null);
            fetchMeeting();
        } else {
            toast.error('Upload failed');
        }
    };

    const handleDeleteDoc = async (docId: number) => {
        if (!confirm('Delete this document?')) return;
        const res = await fetch(`/api/documents/${docId}`, { method: 'DELETE' });
        if (res.ok) {
            toast.success('Deleted');
            fetchMeeting();
        }
    };

    const cancelMeeting = async () => {
        const reason = prompt('Reason for cancellation?');
        if (reason === null) return;

        const res = await fetch(`/api/meetings/${params.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ IsCancelled: true, CancellationReason: reason })
        });

        if (res.ok) {
            toast.success('Meeting cancelled');
            fetchMeeting();
        }
    };

    if (loading) return <div className="text-zinc-400">Loading details...</div>;
    if (!meeting) return null;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        {meeting.MeetingTitle}
                        {meeting.IsCancelled && (
                            <Badge variant="destructive" className="bg-red-900/50 text-red-500">Cancelled</Badge>
                        )}
                    </h1>
                    <p className="text-zinc-400 mt-1">
                        {new Date(meeting.MeetingDate).toLocaleDateString()} at {meeting.MeetingTime} &bull; {meeting.MeetingType?.MeetingTypeName}
                    </p>
                </div>
                {!meeting.IsCancelled && (
                    <Button variant="destructive" onClick={cancelMeeting} className="bg-red-600 hover:bg-red-700">
                        Cancel Meeting
                    </Button>
                )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-white">Attendance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border border-zinc-800 rounded-md">
                                <Table>
                                    <TableHeader className="bg-zinc-950 text-zinc-400">
                                        <TableRow className="border-zinc-800">
                                            <TableHead>Staff Name</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {meeting.MOM_MeetingMember.map((m: any) => (
                                            <TableRow key={m.MeetingMemberID} className="border-zinc-800 text-zinc-300">
                                                <TableCell>{m.Staff.StaffName}</TableCell>
                                                <TableCell>
                                                    {m.IsPresent ? (
                                                        <Badge className="bg-emerald-900/30 text-emerald-400">Present</Badge>
                                                    ) : (
                                                        <Badge className="bg-zinc-800 text-zinc-400">Absent</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white"
                                                        onClick={() => toggleAttendance(m.MeetingMemberID, m.IsPresent)}
                                                        disabled={meeting.IsCancelled}
                                                    >
                                                        Mark {m.IsPresent ? 'Absent' : 'Present'}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-white">Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-zinc-400">Description</p>
                                <p className="text-sm text-white">{meeting.MeetingDescription || 'None'}</p>
                            </div>
                            {meeting.IsCancelled && (
                                <div>
                                    <p className="text-sm text-red-400">Cancellation Reason</p>
                                    <p className="text-sm text-white">{meeting.CancellationReason}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-white">Documents</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!meeting.IsCancelled && (
                                <form onSubmit={handleUpload} className="flex gap-2 mb-4">
                                    <Input
                                        type="file"
                                        onChange={e => setFile(e.target.files?.[0] || null)}
                                        className="bg-zinc-800 border-zinc-700 text-white cursor-pointer file:text-white file:bg-zinc-700 file:border-0"
                                    />
                                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 shrink-0">Upload</Button>
                                </form>
                            )}

                            <div className="space-y-2">
                                {meeting.MOM_MeetingDocument.map((doc: any) => (
                                    <div key={doc.MeetingDocumentID} className="flex items-center justify-between p-2 bg-zinc-800 rounded">
                                        <a href={doc.DocumentPath} target="_blank" className="text-indigo-400 text-sm hover:underline">
                                            {doc.DocumentName}
                                        </a>
                                        {!meeting.IsCancelled && (
                                            <button onClick={() => handleDeleteDoc(doc.MeetingDocumentID)} className="text-red-400 text-sm hover:text-red-300">
                                                Drop
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {meeting.MOM_MeetingDocument.length === 0 && (
                                    <p className="text-sm text-zinc-500 text-center">No documents attached.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
