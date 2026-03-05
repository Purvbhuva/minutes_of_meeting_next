'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function CreateMeetingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [types, setTypes] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState<number[]>([]);

    const [formData, setFormData] = useState({
        MeetingTitle: '',
        MeetingDescription: '',
        MeetingDate: '',
        MeetingTime: '',
        MeetingTypeID: '',
        Remarks: ''
    });

    useEffect(() => {
        fetch('/api/meeting-types').then(r => r.json()).then(setTypes);
        fetch('/api/staff').then(r => r.json()).then(setStaffList);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch('/api/meetings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                Members: selectedStaff
            })
        });

        if (res.ok) {
            toast.success('Meeting scheduled successfully');
            router.push('/meetings');
        } else {
            toast.error('Failed to schedule meeting');
        }
        setLoading(false);
    };

    const toggleStaff = (id: number) => {
        if (selectedStaff.includes(id)) {
            setSelectedStaff(selectedStaff.filter(s => s !== id));
        } else {
            setSelectedStaff([...selectedStaff, id]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-white">Schedule Meeting</h1>
                <p className="text-zinc-400">Create a new meeting and invite participants.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-white">Meeting Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title" required
                                        value={formData.MeetingTitle}
                                        onChange={e => setFormData({ ...formData, MeetingTitle: e.target.value })}
                                        className="bg-zinc-800 border-zinc-700 text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Date</Label>
                                        <Input
                                            id="date" type="date" required
                                            value={formData.MeetingDate}
                                            onChange={e => setFormData({ ...formData, MeetingDate: e.target.value })}
                                            className="bg-zinc-800 border-zinc-700 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="time">Time</Label>
                                        <Input
                                            id="time" type="time" required
                                            value={formData.MeetingTime}
                                            onChange={e => setFormData({ ...formData, MeetingTime: e.target.value })}
                                            className="bg-zinc-800 border-zinc-700 text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type">Meeting Type</Label>
                                    <Select value={formData.MeetingTypeID} onValueChange={(v) => setFormData({ ...formData, MeetingTypeID: v })}>
                                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                            {types.map((t: any) => (
                                                <SelectItem key={t.MeetingTypeID} value={t.MeetingTypeID.toString()}>
                                                    {t.MeetingTypeName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="desc">Description</Label>
                                    <Input
                                        id="desc"
                                        value={formData.MeetingDescription}
                                        onChange={e => setFormData({ ...formData, MeetingDescription: e.target.value })}
                                        className="bg-zinc-800 border-zinc-700 text-white"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-white">Participants</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                                    {staffList.map((s: any) => (
                                        <label key={s.StaffID} className="flex items-center space-x-3 p-2 rounded hover:bg-zinc-800 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedStaff.includes(s.StaffID)}
                                                onChange={() => toggleStaff(s.StaffID)}
                                                className="form-checkbox h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-zinc-900"
                                            />
                                            <span className="text-zinc-300 text-sm">{s.StaffName}</span>
                                        </label>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-zinc-800">
                                    <p className="text-sm text-zinc-400">{selectedStaff.length} selected</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Create Meeting'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="w-full bg-transparent border-zinc-700 text-white hover:bg-zinc-800 mt-2"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
