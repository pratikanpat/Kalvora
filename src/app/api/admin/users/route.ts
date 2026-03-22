import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

async function verifyAdmin(request: Request) {
    const supabase = createServerClient();
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return null;

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;

    const email = user.email?.toLowerCase() || '';
    if (!ADMIN_EMAILS.includes(email)) return null;

    return { user, supabase };
}

export async function GET(request: Request) {
    try {
        const auth = await verifyAdmin(request);
        if (!auth) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        const { supabase } = auth;

        // Get all users via admin API
        const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
        if (usersError) throw usersError;

        const users = usersData?.users || [];

        // Get all designer profiles
        const { data: profiles } = await supabase
            .from('designer_profiles')
            .select('user_id, studio_name, designer_name, email, phone');

        // Get proposal counts per user
        const { data: projects } = await supabase
            .from('projects')
            .select('user_id, id');

        // Build user-to-profile map
        const profileMap: Record<string, typeof profiles extends (infer T)[] | null ? T : never> = {};
        for (const p of (profiles || [])) {
            profileMap[p.user_id] = p;
        }

        // Build user-to-proposal-count map
        const proposalCounts: Record<string, number> = {};
        for (const p of (projects || [])) {
            proposalCounts[p.user_id] = (proposalCounts[p.user_id] || 0) + 1;
        }

        // Combine data
        const enrichedUsers = users.map(u => ({
            id: u.id,
            email: u.email,
            created_at: u.created_at,
            last_sign_in_at: u.last_sign_in_at,
            studio_name: profileMap[u.id]?.studio_name || null,
            designer_name: profileMap[u.id]?.designer_name || null,
            proposals_count: proposalCounts[u.id] || 0,
        }));

        // Sort by created_at descending
        enrichedUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return NextResponse.json({ users: enrichedUsers });
    } catch (error) {
        console.error('Admin users error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
