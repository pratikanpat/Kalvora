import { supabase } from './supabase';
import { createServerClient } from './supabase';

/**
 * Generates a short, readable code like "KV-R7x3mQ"
 * Uses base62 (a-z, A-Z, 0-9) for compactness
 */
function generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `KV-${result}`;
}

/**
 * Get or create a short code for a project (client-side, uses anon key).
 * Returns the short code string.
 */
export async function getOrCreateShortCode(
    projectId: string,
    linkType: 'view' | 'invoice' = 'view'
): Promise<string> {
    // Check if a short code already exists
    const { data: existing } = await supabase
        .from('short_codes')
        .select('code')
        .eq('project_id', projectId)
        .eq('link_type', linkType)
        .single();

    if (existing?.code) return existing.code;

    // Generate a new unique code with retry
    for (let attempt = 0; attempt < 5; attempt++) {
        const code = generateCode();
        const { data, error } = await supabase
            .from('short_codes')
            .insert({ code, project_id: projectId, link_type: linkType })
            .select('code')
            .single();

        if (!error && data?.code) return data.code;

        // If it was a unique constraint violation, retry with a new code
        if (error?.code === '23505') continue;

        // For any other error (e.g. RLS), break and fall back
        console.error('Short code creation error:', error);
        break;
    }

    // Fallback: return the UUID-based path (still works)
    return '';
}

/**
 * Server-side: Get or create a short code (uses service role, bypasses RLS).
 */
export async function getOrCreateShortCodeServer(
    projectId: string,
    linkType: 'view' | 'invoice' = 'view'
): Promise<string> {
    const sb = createServerClient();

    const { data: existing } = await sb
        .from('short_codes')
        .select('code')
        .eq('project_id', projectId)
        .eq('link_type', linkType)
        .single();

    if (existing?.code) return existing.code;

    for (let attempt = 0; attempt < 5; attempt++) {
        const code = generateCode();
        const { data, error } = await sb
            .from('short_codes')
            .insert({ code, project_id: projectId, link_type: linkType })
            .select('code')
            .single();

        if (!error && data?.code) return data.code;
        if (error?.code === '23505') continue;

        console.error('Server short code creation error:', error);
        break;
    }

    return '';
}

/**
 * Look up a short code and return the project_id and link_type.
 */
export async function resolveShortCode(
    code: string
): Promise<{ projectId: string; linkType: string } | null> {
    const { data, error } = await supabase
        .from('short_codes')
        .select('project_id, link_type')
        .eq('code', code)
        .single();

    if (error || !data) return null;
    return { projectId: data.project_id, linkType: data.link_type };
}

/**
 * Build the short URL for a proposal or invoice.
 * Falls back to full UUID URL if short code creation fails.
 */
export function buildShortUrl(
    origin: string,
    code: string,
    linkType: 'view' | 'invoice',
    projectId: string
): string {
    if (code) {
        const prefix = linkType === 'invoice' ? 'i' : 'p';
        return `${origin}/${prefix}/${code}`;
    }
    // Fallback to full URL
    const path = linkType === 'invoice' ? 'invoice' : 'view';
    return `${origin}/${path}/${projectId}`;
}
