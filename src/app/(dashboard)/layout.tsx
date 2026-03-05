'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        toast.success('Logged out');
        router.push('/login');
        router.refresh();
    };

    const navItems = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Meetings', href: '/meetings' },
        { name: 'Master: Meeting Types', href: '/master/meeting-types' },
        { name: 'Master: Staff', href: '/master/staff' },
        { name: 'Profile', href: '/profile' },
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col h-auto md:h-screen sticky top-0">
                <div className="p-6">
                    <h2 className="text-2xl font-bold tracking-tight text-white">MOM System</h2>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-4 py-2 rounded-md transition-colors ${pathname.startsWith(item.href)
                                    ? 'bg-indigo-600 text-white font-medium'
                                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-zinc-800">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                        onClick={handleLogout}
                    >
                        Sign Out
                    </Button>
                </div>
            </aside>
            <main className="flex-1 p-6 md:p-10 overflow-auto">
                {children}
            </main>
        </div>
    );
}
