'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/auth/profile')
            .then(res => res.json())
            .then(data => {
                setUser(data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-zinc-400">Loading profile...</div>;

    return (
        <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-6">Your Profile</h1>
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-zinc-400">Name</p>
                            <p className="text-lg text-white font-medium">{user?.StaffName}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-400">Role</p>
                            <p className="text-lg text-indigo-400 font-medium">{user?.Role}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-400">Email Address</p>
                            <p className="text-lg text-zinc-100">{user?.EmailAddress}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-400">Mobile No</p>
                            <p className="text-lg text-zinc-100">{user?.MobileNo || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-800">
                        <p className="text-sm font-medium text-zinc-400">Remarks</p>
                        <p className="text-base text-zinc-300 mt-1">{user?.Remarks || 'No remarks available.'}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
