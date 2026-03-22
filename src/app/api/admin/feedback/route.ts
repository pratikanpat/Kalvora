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

        // Parse query params
        const { searchParams } = new URL(request.url);
        const feedbackType = searchParams.get('type');

        // Build query
        let query = supabase
            .from('feedback')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(200);

        if (feedbackType && feedbackType !== 'all') {
            query = query.eq('feedback_type', feedbackType);
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json({ feedback: data || [] });
    } catch (error) {
        console.error('Admin feedback error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
