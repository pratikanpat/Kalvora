import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { minimalTemplate, luxuryTemplate, modernTemplate, blueprintTemplate, editorialTemplate, highContrastTemplate } from '@/lib/templates';
import type { TemplateData } from '@/lib/templates';

export const maxDuration = 30;

const BROWSERLESS_TOKEN = process.env.BROWSERLESS_API_TOKEN;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { project_id } = body;

        if (!project_id) {
            return NextResponse.json({ error: 'project_id is required' }, { status: 400 });
        }

        if (!BROWSERLESS_TOKEN) {
            console.error('BROWSERLESS_API_TOKEN is not set');
            return NextResponse.json({ error: 'PDF service is not configured' }, { status: 500 });
        }

        const supabase = createServerClient();

        // 1. Fetch project, rooms, and line items IN PARALLEL
        const [projectResult, roomsResult, lineItemsResult] = await Promise.all([
            supabase.from('projects').select('*').eq('id', project_id).single(),
            supabase.from('rooms').select('name, square_footage').eq('project_id', project_id),
            supabase.from('line_items').select('item_name, quantity, unit_price').eq('project_id', project_id),
        ]);

        if (projectResult.error || !projectResult.data) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const project = projectResult.data;
        const rooms = roomsResult.data;
        const lineItems = lineItemsResult.data;

        // 2. Build template data
        const templateData: TemplateData = {
            client_name: project.client_name,
            client_email: project.client_email || '',
            client_phone: project.client_phone || '',
            project_address: project.project_address || '',
            project_type: project.project_type,
            designer_name: project.designer_name || '',
            designer_email: project.designer_email || '',
            designer_phone: project.designer_phone || '',
            logo_url: project.logo_url || '',
            accent_color: project.accent_color || '#4263eb',
            notes: project.notes || '',
            payment_terms: project.payment_terms || '',
            tax_rate: project.tax_rate || 0,
            created_at: project.created_at,
            rooms: rooms || [],
            line_items: lineItems || [],
            studio_name: project.designer_name || '',
            project_size: project.project_size || '',
            services_included: project.services_included || [],
            quotation_validity: project.quotation_validity || 30,
            estimated_start_date: project.estimated_start_date || '',
            estimated_timeline: project.estimated_timeline || '',
        };

        // 3. Select template
        let html: string;
        switch (project.template) {
            case 'luxury':
                html = luxuryTemplate(templateData);
                break;
            case 'modern':
                html = modernTemplate(templateData);
                break;
            case 'blueprint':
                html = blueprintTemplate(templateData);
                break;
            case 'editorial':
                html = editorialTemplate(templateData);
                break;
            case 'highcontrast':
                html = highContrastTemplate(templateData);
                break;
            default:
                html = minimalTemplate(templateData);
        }

        // 4. Generate PDF via Browserless REST API + count proposals IN PARALLEL
        //    REST /pdf is much faster than WebSocket — single HTTP POST, no browser handshake
        const sanitizedClientName = project.client_name
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '');

        const [pdfResponse, proposalCountResult] = await Promise.all([
            fetch(`https://chrome.browserless.io/pdf?token=${BROWSERLESS_TOKEN}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    html,
                    options: {
                        format: 'A4',
                        printBackground: true,
                        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
                    },
                }),
            }),
            supabase
                .from('proposals')
                .select('*', { count: 'exact', head: true })
                .eq('project_id', project_id),
        ]);

        if (!pdfResponse.ok) {
            const errText = await pdfResponse.text();
            console.error('Browserless PDF error:', pdfResponse.status, errText);
            return NextResponse.json(
                { error: `PDF generation failed (${pdfResponse.status})` },
                { status: 500 }
            );
        }

        const pdfArrayBuffer = await pdfResponse.arrayBuffer();
        const pdfUint8 = new Uint8Array(pdfArrayBuffer);

        // 5. Upload PDF to Supabase Storage
        const proposalNumber = (proposalCountResult.count || 0) + 1;
        const downloadFileName = `${sanitizedClientName}_proposal_${proposalNumber}.pdf`;
        const storageFileName = `${sanitizedClientName}_proposal_${proposalNumber}_${Date.now()}.pdf`;

        const { error: uploadError } = await supabase.storage
            .from('proposals')
            .upload(storageFileName, pdfUint8, {
                contentType: 'application/pdf',
                upsert: true,
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return NextResponse.json({ error: 'Failed to upload PDF' }, { status: 500 });
        }

        // 6. Get public URL
        const { data: urlData } = supabase.storage.from('proposals').getPublicUrl(storageFileName);
        const pdfUrl = urlData.publicUrl;

        // 7. Save proposal record + update project status IN PARALLEL
        const dbOps: Promise<unknown>[] = [
            Promise.resolve(supabase.from('proposals').insert({ project_id, pdf_url: pdfUrl })),
        ];

        if (project.status === 'Draft') {
            dbOps.push(
                Promise.resolve(
                    supabase
                        .from('projects')
                        .update({ status: 'Sent', updated_at: new Date().toISOString() })
                        .eq('id', project_id)
                )
            );
        }

        await Promise.all(dbOps);

        return NextResponse.json({ pdf_url: pdfUrl, download_filename: downloadFileName });

    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        );
    }
}


