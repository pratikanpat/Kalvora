import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { Resend } from 'resend';
import { getOrCreateShortCodeServer, buildShortUrl } from '@/lib/shortcode';

export const dynamic = 'force-dynamic';

const APP_URL =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, '') ||
    'https://kalvora.kaliprlabs.in';

export async function POST(request: Request) {
    try {
        const { projectId, clientEmail } = await request.json();

        if (!projectId || !clientEmail) {
            return NextResponse.json({ error: 'Missing projectId or clientEmail' }, { status: 400 });
        }

        const supabase = createServerClient();

        // Fetch project details
        const { data: project, error } = await supabase
            .from('projects')
            .select('client_name, project_type, designer_name, status')
            .eq('id', projectId)
            .single();

        if (error || !project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Update status to Sent if still Draft
        if (project.status === 'Draft') {
            await supabase
                .from('projects')
                .update({ status: 'Sent', updated_at: new Date().toISOString() })
                .eq('id', projectId);
        }

        // Send the email
        if (!process.env.RESEND_API_KEY) {
            return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        // Generate short link for the proposal
        const shortCode = await getOrCreateShortCodeServer(projectId, 'view');
        const proposalLink = buildShortUrl(APP_URL, shortCode, 'view', projectId);

        const result = await resend.emails.send({
            from: 'Kalvora <notifications@kalvora.kaliprlabs.in>',
            to: clientEmail,
            subject: `📋 New Proposal from ${project.designer_name || 'your designer'}`,
            html: `
                <div style="font-family:'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#fafafa;border-radius:12px;">
                    <div style="text-align:center;margin-bottom:24px;">
                        <span style="font-size:48px;">📋</span>
                    </div>
                    <h2 style="color:#111;text-align:center;margin:0 0 8px;">Your Proposal is Ready</h2>
                    <p style="color:#555;text-align:center;margin:0 0 8px;">
                        Hi <strong>${project.client_name}</strong>, 
                        <strong>${project.designer_name || 'your designer'}</strong> has prepared a ${project.project_type} proposal for you.
                    </p>
                    <p style="color:#555;text-align:center;margin:0 0 24px;">
                        Click below to view, discuss, and approve it.
                    </p>
                    <div style="text-align:center;">
                        <a href="${proposalLink}" 
                           style="display:inline-block;background:#4f46e5;color:white;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:600;">
                           View Proposal →
                        </a>
                    </div>
                    <p style="color:#999;text-align:center;margin:24px 0 0;font-size:12px;">
                        Sent via Kalvora • Professional Interior Design Proposals
                    </p>
                </div>
            `,
        });

        if (result.error) {
            console.error('Resend API Error details:', result.error);
            return NextResponse.json({ error: result.error.message || 'Failed to send email' }, { status: 500 });
        }

        return NextResponse.json({ success: true, emailResult: result });
    } catch (error) {
        console.error('Error in send-proposal:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
