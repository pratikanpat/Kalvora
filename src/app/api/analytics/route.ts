import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const supabase = createServerClient();

        // Get user from auth header
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch all user's projects
        const { data: projects, error: projError } = await supabase
            .from('projects')
            .select('id, status, grand_total')
            .eq('user_id', user.id);

        if (projError) throw projError;

        const allProjects = projects || [];

        // Compute stats
        const totalProposals = allProjects.length;
        const activeProjects = allProjects.filter(
            p => p.status !== 'Draft' && p.status !== 'Completed'
        ).length;

        const sentOrBeyond = allProjects.filter(
            p => ['Sent', 'Approved', 'Paid', 'Completed'].includes(p.status)
        ).length;
        const approvedOrCompleted = allProjects.filter(
            p => ['Approved', 'Paid', 'Completed'].includes(p.status)
        ).length;
        const approvalRate = sentOrBeyond > 0
            ? Math.round((approvedOrCompleted / sentOrBeyond) * 100)
            : 0;

        // For average deal size, fetch line_items for approved/completed projects
        let avgDealSize = 0;
        const approvedProjectIds = allProjects
            .filter(p => ['Approved', 'Paid', 'Completed'].includes(p.status))
            .map(p => p.id);

        if (approvedProjectIds.length > 0) {
            // Fetch tax_rate + line items for approved projects
            const { data: approvedProjects } = await supabase
                .from('projects')
                .select('id, tax_rate')
                .in('id', approvedProjectIds);

            const { data: lineItems } = await supabase
                .from('line_items')
                .select('project_id, quantity, unit_price')
                .in('project_id', approvedProjectIds);

            if (approvedProjects && lineItems) {
                const projectTotals: Record<string, number> = {};

                // Compute subtotals per project
                for (const item of lineItems) {
                    if (!projectTotals[item.project_id]) projectTotals[item.project_id] = 0;
                    projectTotals[item.project_id] += item.quantity * item.unit_price;
                }

                // Apply tax rates
                let totalRevenue = 0;
                for (const proj of approvedProjects) {
                    const subtotal = projectTotals[proj.id] || 0;
                    totalRevenue += subtotal + (subtotal * ((proj.tax_rate || 0) / 100));
                }

                avgDealSize = Math.round(totalRevenue / approvedProjectIds.length);
            }
        }

        return NextResponse.json({
            totalProposals,
            approvalRate,
            avgDealSize,
            activeProjects,
        });
    } catch (error) {
        console.error('Analytics error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
