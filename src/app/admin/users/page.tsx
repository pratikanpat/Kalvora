'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import {
    Users, Loader2, Calendar, Mail, FileText, Building2
} from 'lucide-react';

interface UserEntry {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string | null;
    studio_name: string | null;
    designer_name: string | null;
    proposals_count: number;
}

export default function AdminUsersPage() {
    const { session } = useAuth();
    const [users, setUsers] = useState<UserEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.access_token) return;

        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/admin/users', {
                    headers: { Authorization: `Bearer ${session.access_token}` },
                });
                if (!res.ok) throw new Error('Failed');
                const data = await res.json();
                setUsers(data.users || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [session]);

    const formatDate = (d: string | null) => {
        if (!d) return '-';
        return new Date(d).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    const timeAgo = (d: string | null) => {
        if (!d) return 'Never';
        const diff = Date.now() - new Date(d).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        if (days < 7) return `${days}d ago`;
        return formatDate(d);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white mb-1">Users</h1>
                <p className="text-[#5a5a70] text-sm">{users.length} registered users</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={28} className="animate-spin text-amber-400" />
                </div>
            ) : users.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <Users size={40} className="text-[#2a2a40] mx-auto mb-3" />
                    <p className="text-[#5a5a70] text-sm">No users yet</p>
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden md:block glass-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#1a1a2e]">
                                        <th className="text-left px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-[#5a5a70]">User</th>
                                        <th className="text-left px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-[#5a5a70]">Studio</th>
                                        <th className="text-center px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-[#5a5a70]">Proposals</th>
                                        <th className="text-left px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-[#5a5a70]">Signed Up</th>
                                        <th className="text-left px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-[#5a5a70]">Last Active</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1a1a2e]">
                                    {users.map(user => (
                                        <tr key={user.id} className="hover:bg-[#1a1a2e]/50 transition-colors">
                                            <td className="px-5 py-4">
                                                <div>
                                                    <p className="text-sm font-medium text-white">
                                                        {user.designer_name || 'No name'}
                                                    </p>
                                                    <p className="text-xs text-[#5a5a70] flex items-center gap-1 mt-0.5">
                                                        <Mail size={10} /> {user.email}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="text-sm text-[#8888a0]">
                                                    {user.studio_name || (
                                                        <span className="text-[#3a3a50] italic">Not set</span>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <span className={`inline-flex items-center gap-1 text-sm font-semibold ${
                                                    user.proposals_count > 0 ? 'text-white' : 'text-[#3a3a50]'
                                                }`}>
                                                    <FileText size={12} className={user.proposals_count > 0 ? 'text-blue-400' : 'text-[#3a3a50]'} />
                                                    {user.proposals_count}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="text-sm text-[#8888a0]">{formatDate(user.created_at)}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="text-sm text-[#5a5a70]">{timeAgo(user.last_sign_in_at)}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-3">
                        {users.map(user => (
                            <div key={user.id} className="glass-card p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="text-sm font-medium text-white">
                                            {user.designer_name || 'No name'}
                                        </p>
                                        <p className="text-xs text-[#5a5a70]">{user.email}</p>
                                    </div>
                                    <span className="text-xs font-semibold text-white flex items-center gap-1 bg-[#1a1a2e] px-2 py-1 rounded-lg">
                                        <FileText size={10} className="text-blue-400" />
                                        {user.proposals_count}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-3 text-[11px] text-[#5a5a70]">
                                    {user.studio_name && (
                                        <span className="flex items-center gap-1">
                                            <Building2 size={10} /> {user.studio_name}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <Calendar size={10} /> {formatDate(user.created_at)}
                                    </span>
                                    <span>Last: {timeAgo(user.last_sign_in_at)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
