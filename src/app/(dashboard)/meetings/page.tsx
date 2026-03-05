'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MeetingsPage() {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, active, cancelled

    const fetchMeetings = async () => {
        setLoading(true);
        let url = '/api/meetings';
        if (filter !== 'all') url += `?status=${filter}`;
        const res = await fetch(url);
        const data = await res.json();
        setMeetings(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchMeetings();
    }, [filter]);

    return (
        <div className="max-w-6xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Meetings</h1>
                    <p className="text-zinc-400">View and manage all your meetings.</p>
                </div>
                <Link href="/meetings/create">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Schedule Meeting</Button>
                </Link>
            </div>

            <div className="mb-6 w-48">
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectItem value="all">All Meetings</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="text-zinc-400">Loading meetings...</div>
            ) : meetings.length === 0 ? (
                <div className="text-zinc-400">No meetings found.</div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {meetings.map((m: any) => (
                        <Card key={m.MeetingID} className={`bg-zinc-900 border-zinc-800 ${m.IsCancelled ? 'opacity-70' : ''}`}>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white line-clamp-1">{m.MeetingTitle}</h3>
                                        <p className="text-sm text-zinc-400">{m.MeetingType?.MeetingTypeName || 'General'}</p>
                                    </div>
                                    {m.IsCancelled && (
                                        <span className="px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded-full">Cancelled</span>
                                    )}
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-zinc-300">
                                        <span className="w-5 inline-block text-zinc-500">📅</span>
                                        {new Date(m.MeetingDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center text-sm text-zinc-300">
                                        <span className="w-5 inline-block text-zinc-500">⏱️</span>
                                        {m.MeetingTime}
                                    </div>
                                    <div className="flex items-center text-sm text-zinc-300">
                                        <span className="w-5 inline-block text-zinc-500">👥</span>
                                        {m.MOM_MeetingMember?.length || 0} Members
                                    </div>
                                </div>

                                <Link href={`/meetings/${m.MeetingID}`} className="block w-full">
                                    <Button variant="outline" className="w-full bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white">
                                        View Details
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
