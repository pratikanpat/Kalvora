import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function isConfigured(): boolean {
    return !!(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder'));
}

// Browser client (uses anon key)
// persistSession: true (default) — stores tokens in localStorage
// autoRefreshToken: true (default) — Supabase's internal refresh timer
// detectSessionInUrl: true — needed for OAuth redirects (Google login)
export const supabase: SupabaseClient = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key',
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        },
    }
);

// Helper to check if Supabase is properly configured
export function checkSupabaseConfig(): { configured: boolean; message: string } {
    if (!isConfigured()) {
        return {
            configured: false,
            message:
                'Supabase is not configured. Please create a .env.local file with your Supabase credentials:\n\n' +
                'NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co\n' +
                'NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key\n' +
                'SUPABASE_SERVICE_ROLE_KEY=your-service-role-key\n\n' +
                'Then restart the dev server (npm run dev).',
        };
    }
    return { configured: true, message: '' };
}

// Server-side client with service role key (for API routes)
// Cached as singleton to reuse across requests within the same process
let serverClient: SupabaseClient | null = null;

export function createServerClient() {
    if (serverClient) return serverClient;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceRoleKey) {
        console.error(
            'Missing Supabase server credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
        );
        return createClient(
            url || 'https://placeholder.supabase.co',
            serviceRoleKey || 'placeholder-key'
        );
    }

    serverClient = createClient(url, serviceRoleKey);
    return serverClient;
}
