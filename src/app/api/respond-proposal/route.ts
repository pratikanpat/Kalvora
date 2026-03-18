import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

/** Production URL — used in all email links. Env var takes priority, else hardcoded prod URL. */
const APP_URL =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, '') ||
    'https://kalvora.kaliprlabs.in';

export async function POST(request: Request) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const emailDebug: Record<string, unknown> = {};
    try {
        const body = await request.json();
        const { projectId, action, comment, clientName, projectName } = body;

        if (!projectId || !action) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const supabase = createServerClient();

        // Fetch the project (include client_email for invoice emails)
        const { data: project, error: projectError } = await supabase
            .from('projects')
            .select('status, user_id, client_email, client_name')
            .eq('id', projectId)
            .single();

        if (projectError || !project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Get the designer's LOGIN email from Supabase Auth (the email they signed up with)
        let designerEmail: string | null = null;
        if (project.user_id) {
            const { data: userData, error: userError } = await supabase.auth.admin.getUserById(project.user_id);
            designerEmail = userData?.user?.email || null;
            emailDebug.user_id = project.user_id;
            emailDebug.designerEmail = designerEmail;
            if (userError) {
                emailDebug.userLookupError = String(userError);
                console.error('Failed to look up designer user:', userError);
            }
        } else {
            emailDebug.issue = 'project.user_id is null';
        }

        emailDebug.hasResendKey = !!process.env.RESEND_API_KEY;

        // Also try the profile email as a fallback
        let profileEmail: string | null = null;
        if (project.user_id) {
            const { data: profile } = await supabase
                .from('designer_profiles')
                .select('email')
                .eq('user_id', project.user_id)
                .single();
            profileEmail = profile?.email || null;
            emailDebug.profileEmail = profileEmail;
        }

        // Use designer auth email, fallback to profile email
        const targetEmail = designerEmail || profileEmail;
        emailDebug.targetEmail = targetEmail;

        // ─── 1. Mark as viewed ───────────────────────────────────────────
        if (action === 'viewed') {
            await supabase
                .from('projects')
                .update({ client_viewed_at: new Date().toISOString() })
                .eq('id', projectId);

            return NextResponse.json({ success: true, message: 'View recorded' });
        }

        // ─── 2. Approve ─────────────────────────────────────────────────
        if (action === 'approve') {
            await supabase
                .from('projects')
                .update({
                    status: 'Approved',
                    updated_at: new Date().toISOString(),
                })
                .eq('id', projectId);

            // Email the designer
            if (targetEmail && process.env.RESEND_API_KEY) {
                try {
                    const result = await resend.emails.send({
                        from: 'Kalvora <notifications@kalvora.kaliprlabs.in>',
                        to: targetEmail,
                        subject: `🎉 Proposal Approved by ${clientName}`,
                        html: `
                            <div style="font-family:'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#fafafa;border-radius:12px;">
                                <div style="text-align:center;margin-bottom:24px;">
                                    <span style="font-size:48px;">🎉</span>
                                </div>
                                <h2 style="color:#111;text-align:center;margin:0 0 8px;">Proposal Approved!</h2>
                                <p style="color:#555;text-align:center;margin:0 0 24px;">
                                    <strong>${clientName}</strong> approved your proposal for <strong>${projectName}</strong>.
                                </p>
                                <div style="text-align:center;">
                                    <a href="${APP_URL}/proposals/${projectId}" 
                                       style="display:inline-block;background:#4f46e5;color:white;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:600;">
                                       View in Dashboard →
                                    </a>
                                </div>
                            </div>
                        `,
                    });
                    emailDebug.approvalEmailResult = result;
                    console.log('Approval email sent:', JSON.stringify(result));
                } catch (emailError) {
                    emailDebug.approvalEmailError = String(emailError);
                    console.error('Failed to send approval email:', emailError);
                }
            } else {
                emailDebug.approvalSkipped = { hasEmail: !!targetEmail, hasKey: !!process.env.RESEND_API_KEY };
                console.warn('Approval email skipped:', emailDebug.approvalSkipped);
            }

            // Email the client an invoice link
            const clientEmail = project.client_email;
            if (clientEmail && process.env.RESEND_API_KEY) {
                try {
                    const result = await resend.emails.send({
                        from: 'Kalvora <notifications@kalvora.kaliprlabs.in>',
                        to: clientEmail,
                        subject: `📄 Your Invoice for ${projectName}`,
                        html: `
                            <div style="font-family:'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#fafafa;border-radius:12px;">
                                <div style="text-align:center;margin-bottom:24px;">
                                    <span style="font-size:48px;">📄</span>
                                </div>
                                <h2 style="color:#111;text-align:center;margin:0 0 8px;">Your Invoice is Ready</h2>
                                <p style="color:#555;text-align:center;margin:0 0 8px;">
                                    Hi <strong>${clientName}</strong>, your proposal for <strong>${projectName}</strong> has been approved.
                                </p>
                                <p style="color:#555;text-align:center;margin:0 0 24px;">
                                    You can view and download your invoice below.
                                </p>
                                <div style="text-align:center;">
                                    <a href="${APP_URL}/invoice/${projectId}" 
                                       style="display:inline-block;background:#059669;color:white;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:600;">
                                       View Invoice →
                                    </a>
                                </div>
                                <p style="color:#999;text-align:center;margin:24px 0 0;font-size:12px;">
                                    Generated with Kalvora • Professional Interior Design Proposals
                                </p>
                            </div>
                        `,
                    });
                    emailDebug.invoiceEmailResult = result;
                    console.log('Invoice email sent:', JSON.stringify(result));
                } catch (emailError) {
                    emailDebug.invoiceEmailError = String(emailError);
                    console.error('Failed to send invoice email to client:', emailError);
                }
            }

            return NextResponse.json({ success: true, message: 'Proposal approved', _debug: emailDebug });
        }

        // ─── 3. Request Changes (comment only — does NOT change status) ─
        if (action === 'request_changes') {
            // Save the comment to the database
            if (comment) {
                const { error: commentError } = await supabase
                    .from('comments')
                    .insert([{
                        project_id: projectId,
                        content: comment,
                        author_type: 'Client',
                    }]);

                if (commentError) {
                    console.error('Failed to save comment:', commentError);
                    return NextResponse.json({ error: 'Failed to save comment' }, { status: 500 });
                }
            }

            // Email the designer about the feedback
            if (targetEmail && process.env.RESEND_API_KEY) {
                try {
                    const result = await resend.emails.send({
                        from: 'Kalvora <notifications@kalvora.kaliprlabs.in>',
                        to: targetEmail,
                        subject: `📝 ${clientName} requested changes`,
                        html: `
                            <div style="font-family:'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#fafafa;border-radius:12px;">
                                <div style="text-align:center;margin-bottom:24px;">
                                    <span style="font-size:48px;">📝</span>
                                </div>
                                <h2 style="color:#111;text-align:center;margin:0 0 8px;">Changes Requested</h2>
                                <p style="color:#555;text-align:center;margin:0 0 24px;">
                                    <strong>${clientName}</strong> has feedback on your proposal for <strong>${projectName}</strong>.
                                </p>
                                ${comment ? `
                                <div style="background:#fff;border:1px solid #e5e7eb;border-left:4px solid #f59e0b;padding:16px 20px;border-radius:8px;margin:0 0 24px;">
                                    <p style="color:#333;font-size:14px;margin:0;white-space:pre-wrap;">${comment}</p>
                                </div>` : ''}
                                <div style="text-align:center;">
                                    <a href="${APP_URL}/proposals/${projectId}" 
                                       style="display:inline-block;background:#4f46e5;color:white;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:600;">
                                       View in Dashboard →
                                    </a>
                                </div>
                            </div>
                        `,
                    });
                    emailDebug.feedbackEmailResult = result;
                    console.log('Feedback email sent:', JSON.stringify(result));
                } catch (emailError) {
                    emailDebug.feedbackEmailError = String(emailError);
                    console.error('Failed to send change request email:', emailError);
                }
            } else {
                emailDebug.feedbackSkipped = { hasEmail: !!targetEmail, hasKey: !!process.env.RESEND_API_KEY };
                console.warn('Feedback email skipped:', emailDebug.feedbackSkipped);
            }

            return NextResponse.json({ success: true, message: 'Changes requested', _debug: emailDebug });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Error in respond-proposal:', error);
        return NextResponse.json({ error: 'Internal server error', _debug: emailDebug }, { status: 500 });
    }
}
