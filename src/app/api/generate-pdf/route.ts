import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { minimalTemplate, luxuryTemplate, modernTemplate } from '@/lib/templates';
import type { TemplateData } from '@/lib/templates';

export const maxDuration = 60; // Allow up to 60s for PDF generation

// Cache the resolved Chrome executable path across requests
let cachedChromePath: string | null = null;

async function findChromePath(): Promise<string> {
    if (cachedChromePath) return cachedChromePath;

    const chromePaths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    ];

    const fs = await import('fs');
    for (const p of chromePaths) {
        if (fs.existsSync(p)) {
            cachedChromePath = p;
            return p;
        }
    }

    throw new Error('Chrome/Chromium not found. Please install Google Chrome or set up @sparticuz/chromium.');
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { project_id } = body;

        if (!project_id) {
            return NextResponse.json({ error: 'project_id is required' }, { status: 400 });
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
            default:
                html = minimalTemplate(templateData);
        }

        // 4. Generate PDF with Puppeteer
        let browser;
        try {
            let puppeteer;

            try {
                // Try serverless chromium first
                const chromium = (await import('@sparticuz/chromium')).default;
                puppeteer = (await import('puppeteer-core')).default;

                browser = await puppeteer.launch({
                    args: [...chromium.args, '--disable-gpu', '--disable-dev-shm-usage'],
                    defaultViewport: chromium.defaultViewport,
                    executablePath: await chromium.executablePath(),
                    headless: true,
                });
            } catch {
                // Fallback: use local Chrome with cached path
                puppeteer = (await import('puppeteer-core')).default;
                const executablePath = await findChromePath();

                browser = await puppeteer.launch({
                    executablePath,
                    headless: true,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-gpu',
                        '--disable-dev-shm-usage',
                        '--disable-extensions',
                    ],
                });
            }

            const page = await browser.newPage();
            // Use 'domcontentloaded' — HTML is fully self-contained (inline CSS, base64 logo)
            // No need to wait for network idle, saving ~1-3 seconds
            await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 15000 });
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: { top: '0', right: '0', bottom: '0', left: '0' },
            });

            await browser.close();
            browser = null;

            // 5. Count proposals + upload PDF in parallel-friendly sequence
            const sanitizedClientName = project.client_name
                .toLowerCase()
                .replace(/\s+/g, '_')
                .replace(/[^a-z0-9_]/g, '');

            const { count: proposalCount } = await supabase
                .from('proposals')
                .select('*', { count: 'exact', head: true })
                .eq('project_id', project_id);

            const proposalNumber = (proposalCount || 0) + 1;
            const downloadFileName = `${sanitizedClientName}_proposal_${proposalNumber}.pdf`;
            const storageFileName = `${sanitizedClientName}_proposal_${proposalNumber}_${Date.now()}.pdf`;
            const pdfUint8 = new Uint8Array(pdfBuffer);

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
            const dbOps = [
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

        } catch (pdfError) {
            console.error('PDF generation error:', pdfError);
            return NextResponse.json(
                { error: `PDF generation failed: ${pdfError instanceof Error ? pdfError.message : 'Unknown error'}` },
                { status: 500 }
            );
        } finally {
            if (browser) {
                try { await browser.close(); } catch { /* ignore */ }
            }
        }

    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
