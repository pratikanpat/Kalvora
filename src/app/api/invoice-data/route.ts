import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/invoice-data?projectId=xxx
 * 
 * Public endpoint — fetches all invoice data using the service role
 * (bypasses RLS) so the invoice page works regardless of RLS config.
 * Only returns data for non-Draft projects.
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');

        if (!projectId) {
            return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
        }

        const supabase = createServerClient();

        // Fetch project — only if it's not a Draft (public-facing)
        const { data: project, error: projectError } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .in('status', ['Sent', 'Approved', 'Paid', 'Completed'])
            .single();

        if (projectError || !project) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        // Fetch related data in parallel
        const [roomsRes, itemsRes, milestonesRes] = await Promise.all([
            supabase.from('rooms').select('*').eq('project_id', projectId),
            supabase.from('line_items').select('*').eq('project_id', projectId),
            supabase
                .from('payment_milestones')
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: true }),
        ]);

        // Fetch designer profile if user_id exists
        let designerProfile = null;
        if (project.user_id) {
            const { data: profile } = await supabase
                .from('designer_profiles')
                .select(
                    'studio_name, studio_address, email, phone, gstin, pan_number, hsn_sac_code, invoice_due_days, bank_name, bank_account_number, bank_ifsc, upi_id'
                )
                .eq('user_id', project.user_id)
                .single();
            designerProfile = profile;
        }

        return NextResponse.json({
            project: {
                ...project,
                rooms: roomsRes.data || [],
                line_items: itemsRes.data || [],
            },
            milestones: milestonesRes.data || [],
            designerProfile,
        });
    } catch (error) {
        console.error('Error fetching invoice data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
