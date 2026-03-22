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

        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

        // Run all queries in parallel
        const [
            usersRes,
            projectsRes,
            feedbackRes,
            recentUsersRes,
            recentProjectsRes,
        ] = await Promise.all([
            // Total users
            supabase.auth.admin.listUsers({ perPage: 1000 }),
            // All projects
            supabase.from('projects').select('id, status, created_at'),
            // All feedback
            supabase.from('feedback').select('id, feedback_type, created_at'),
            // This week's users
            supabase.auth.admin.listUsers({ perPage: 1000 }),
            // This week's projects
            supabase.from('projects').select('id, created_at').gte('created_at', weekAgo),
        ]);

        const allUsers = usersRes.data?.users || [];
        const allProjects = projectsRes.data || [];
        const allFeedback = feedbackRes.data || [];
        const recentProjects = recentProjectsRes.data || [];

        // Count users signed up this week
        const recentUsers = allUsers.filter(u => u.created_at && new Date(u.created_at) >= new Date(weekAgo));

        // Projects by status
        const statusCounts: Record<string, number> = {};
        for (const p of allProjects) {
            statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
        }

        // Feedback by type
        const feedbackCounts: Record<string, number> = {};
        for (const f of allFeedback) {
            const type = f.feedback_type || 'unknown';
            feedbackCounts[type] = (feedbackCounts[type] || 0) + 1;
        }

        return NextResponse.json({
            totalUsers: allUsers.length,
            totalProjects: allProjects.length,
            totalFeedback: allFeedback.length,
            signupsThisWeek: recentUsers.length,
            proposalsThisWeek: recentProjects.length,
            projectsByStatus: statusCounts,
            feedbackByType: feedbackCounts,
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
