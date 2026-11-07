import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'edge';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { name, firm, spatial, scope, email, phone, notes } = await request.json();

        if (!name || !email) {
            return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
        }

        const html = `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #FDFCFB; padding: 32px; border-radius: 12px; border: 1px solid #E8DDD0;">
                <div style="border-left: 3px solid #C87A53; padding-left: 16px; margin-bottom: 24px;">
                    <p style="font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #C87A53; margin: 0 0 4px;">
                        New Studio Enquiry · Kalvora
                    </p>
                    <h1 style="font-size: 20px; font-weight: 300; color: #1A1512; margin: 0;">
                        ${firm || 'Unknown Studio'}
                    </h1>
                </div>

                <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #57534E;">
                    <tr style="border-bottom: 1px solid #E8DDD0;">
                        <td style="padding: 10px 0; font-weight: 600; color: #1A1512; width: 160px;">Name</td>
                        <td style="padding: 10px 0;">${name}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #E8DDD0;">
                        <td style="padding: 10px 0; font-weight: 600; color: #1A1512;">Studio / Firm</td>
                        <td style="padding: 10px 0;">${firm || '—'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #E8DDD0;">
                        <td style="padding: 10px 0; font-weight: 600; color: #1A1512;">Email</td>
                        <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #C87A53;">${email}</a></td>
                    </tr>
                    <tr style="border-bottom: 1px solid #E8DDD0;">
                        <td style="padding: 10px 0; font-weight: 600; color: #1A1512;">Phone</td>
                        <td style="padding: 10px 0;">${phone || '—'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #E8DDD0;">
                        <td style="padding: 10px 0; font-weight: 600; color: #1A1512;">Spatial Focus</td>
                        <td style="padding: 10px 0;">${spatial || '—'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #E8DDD0;">
                        <td style="padding: 10px 0; font-weight: 600; color: #1A1512;">Project Scope</td>
                        <td style="padding: 10px 0;">${scope || '—'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; font-weight: 600; color: #1A1512; vertical-align: top;">Notes</td>
                        <td style="padding: 10px 0; white-space: pre-wrap;">${notes || '—'}</td>
                    </tr>
                </table>

                <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #E8DDD0; font-size: 11px; color: #78716C;">
                    Received via Kalvora Landing Page · Studio Relations Form
                </div>
            </div>
        `;

        const result = await resend.emails.send({
            from: 'Kalvora Studio Relations <notifications@kalvora.kaliprlabs.in>',
            to: 'kalvora@kaliprlabs.in',
            replyTo: email,
            subject: `Studio Enquiry — ${firm || name}`,
            html,
        });

        if (result.error) {
            console.error('Resend error:', result.error);
            return NextResponse.json({ error: result.error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Contact API error:', err);
        return NextResponse.json({ error: 'Failed to send. Please try again.' }, { status: 500 });
    }
}
