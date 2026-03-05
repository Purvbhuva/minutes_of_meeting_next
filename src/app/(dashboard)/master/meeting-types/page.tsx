'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function MeetingTypesPage() {
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({ MeetingTypeName: '', Remarks: '' });

    const fetchTypes = async () => {
        setLoading(true);
        const res = await fetch('/api/meeting-types');
        const data = await res.json();
        setTypes(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/meeting-types', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (res.ok) {
            toast.success('Meeting Type saved');
            setIsOpen(false);
            fetchTypes();
            setFormData({ MeetingTypeName: '', Remarks: '' });
        } else {
            toast.error('Failed to save Meeting Type');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this meeting type?')) return;
        const res = await fetch(`/api/meeting-types/${id}`, { method: 'DELETE' });
        if (res.ok) {
            toast.success('Deleted successfully');
            fetchTypes();
        } else {
            toast.error('Failed to delete');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Meeting Types</h1>
                    <p className="text-zinc-400">Master configuration for meeting types.</p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Add New</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                        <DialogHeader>
                            <DialogTitle>Create Meeting Type</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Type Name</Label>
                                <Input
                                    id="name"
                                    required
                                    value={formData.MeetingTypeName}
                                    onChange={e => setFormData({ ...formData, MeetingTypeName: e.target.value })}
                                    className="bg-zinc-800 border-zinc-700 placeholder:text-zinc-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="remarks">Remarks (Optional)</Label>
                                <Input
                                    id="remarks"
                                    value={formData.Remarks}
                                    onChange={e => setFormData({ ...formData, Remarks: e.target.value })}
                                    className="bg-zinc-800 border-zinc-700 placeholder:text-zinc-500"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">Save</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border border-zinc-800 rounded-md">
                <Table>
                    <TableHeader className="bg-zinc-900">
                        <TableRow className="border-zinc-800 hover:bg-zinc-900">
                            <TableHead className="text-zinc-400">ID</TableHead>
                            <TableHead className="text-zinc-400">Name</TableHead>
                            <TableHead className="text-zinc-400">Remarks</TableHead>
                            <TableHead className="text-right text-zinc-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-zinc-400 py-6">Loading...</TableCell>
                            </TableRow>
                        ) : types.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-zinc-400 py-6">No meeting types found.</TableCell>
                            </TableRow>
                        ) : (
                            types.map((type: any) => (
                                <TableRow key={type.MeetingTypeID} className="border-zinc-800 hover:bg-zinc-800/50">
                                    <TableCell className="font-medium text-white">{type.MeetingTypeID}</TableCell>
                                    <TableCell className="text-zinc-300">{type.MeetingTypeName}</TableCell>
                                    <TableCell className="text-zinc-400">{type.Remarks || '-'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(type.MeetingTypeID)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
