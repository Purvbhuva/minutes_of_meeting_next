'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/reports/dashboard')
            .then(res => res.json())
            .then(data => {
                setMetrics(data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-zinc-400">Loading dashboard data...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Overview</h1>
                <p className="text-zinc-400">Welcome back to the MOM System.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Total Meetings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{metrics?.metrics?.totalMeetings || 0}</div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Active Meetings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-500">{metrics?.metrics?.activeMeetings || 0}</div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Total Staff</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{metrics?.metrics?.totalStaff || 0}</div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-400">{metrics?.metrics?.totalDocuments || 0}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-white">Upcoming Meetings</h2>
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-0">
                        {metrics?.upcomingMeetings?.length === 0 ? (
                            <div className="p-6 text-zinc-400">No upcoming meetings scheduled.</div>
                        ) : (
                            <div className="divide-y divide-zinc-800">
                                {metrics?.upcomingMeetings?.map((m: any) => (
                                    <div key={m.MeetingID} className="p-4 flex justify-between items-center hover:bg-zinc-800/50 transition-colors">
                                        <div>
                                            <h3 className="font-medium text-zinc-100">{m.MeetingTitle}</h3>
                                            <p className="text-sm text-zinc-400">
                                                {new Date(m.MeetingDate).toLocaleDateString()} at {m.MeetingTime}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
