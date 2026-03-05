'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function StaffPage() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        StaffName: '', MobileNo: '', EmailAddress: '', Password: '', Role: 'STAFF', Remarks: ''
    });

    const fetchStaff = async () => {
        setLoading(true);
        const res = await fetch('/api/staff');
        const data = await res.json();
        setStaff(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/staff', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (res.ok) {
            toast.success('Staff saved');
            setIsOpen(false);
            fetchStaff();
            setFormData({ StaffName: '', MobileNo: '', EmailAddress: '', Password: '', Role: 'STAFF', Remarks: '' });
        } else {
            const errorData = await res.json();
            toast.error(errorData.message || 'Failed to save staff');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to remove this staff member?')) return;
        const res = await fetch(`/api/staff/${id}`, { method: 'DELETE' });
        if (res.ok) {
            toast.success('Deleted successfully');
            fetchStaff();
        } else {
            toast.error('Failed to delete');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Staff Management</h1>
                    <p className="text-zinc-400">Master configuration for staff members.</p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Add Staff</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create Staff Member</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name" required
                                    value={formData.StaffName}
                                    onChange={e => setFormData({ ...formData, StaffName: e.target.value })}
                                    className="bg-zinc-800 border-zinc-700"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email" type="email" required
                                        value={formData.EmailAddress}
                                        onChange={e => setFormData({ ...formData, EmailAddress: e.target.value })}
                                        className="bg-zinc-800 border-zinc-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Mobile No</Label>
                                    <Input
                                        id="phone"
                                        value={formData.MobileNo}
                                        onChange={e => setFormData({ ...formData, MobileNo: e.target.value })}
                                        className="bg-zinc-800 border-zinc-700"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Initial Password</Label>
                                <Input
                                    id="password" type="password" required
                                    value={formData.Password}
                                    onChange={e => setFormData({ ...formData, Password: e.target.value })}
                                    className="bg-zinc-800 border-zinc-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select value={formData.Role} onValueChange={(val) => setFormData({ ...formData, Role: val })}>
                                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-800 text-white border-zinc-700">
                                        <SelectItem value="ADMIN">Administrator</SelectItem>
                                        <SelectItem value="CONVENER">Convener</SelectItem>
                                        <SelectItem value="STAFF">Staff</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="remarks">Remarks</Label>
                                <Input
                                    id="remarks"
                                    value={formData.Remarks}
                                    onChange={e => setFormData({ ...formData, Remarks: e.target.value })}
                                    className="bg-zinc-800 border-zinc-700"
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
                        <TableRow className="border-zinc-800">
                            <TableHead className="text-zinc-400">Name</TableHead>
                            <TableHead className="text-zinc-400">Role</TableHead>
                            <TableHead className="text-zinc-400">Email</TableHead>
                            <TableHead className="text-zinc-400">Mobile</TableHead>
                            <TableHead className="text-right text-zinc-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-zinc-400 py-6">Loading...</TableCell>
                            </TableRow>
                        ) : staff.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-zinc-400 py-6">No staff members found.</TableCell>
                            </TableRow>
                        ) : (
                            staff.map((s: any) => (
                                <TableRow key={s.StaffID} className="border-zinc-800 hover:bg-zinc-800/50">
                                    <TableCell className="font-medium text-white">{s.StaffName}</TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 bg-zinc-800 text-indigo-300 rounded text-xs">
                                            {s.Role}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-zinc-300">{s.EmailAddress}</TableCell>
                                    <TableCell className="text-zinc-400">{s.MobileNo || '-'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(s.StaffID)}>Delete</Button>
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
