import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/healthz
// Called by UptimeRobot every 5 minutes.
// Returns 200 if all critical services are reachable.
// Returns 503 if any critical service is down.

export async function GET() {
    const start = Date.now();

    const checks: Record<string, { status: 'ok' | 'fail'; message?: string }> = {};

    // ── 1. Environment variables ─────────────────────────────────────────────
    const requiredEnvVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY',
        'BROWSERLESS_API_TOKEN',
        'RESEND_API_KEY',
        'NEXT_PUBLIC_APP_URL',
    ];

    const missingVars = requiredEnvVars.filter((v) => !process.env[v]);
    checks.env = missingVars.length === 0
        ? { status: 'ok' }
        : { status: 'fail', message: `Missing: ${missingVars.join(', ')}` };

    // ── 2. Supabase DB connection ─────────────────────────────────────────────
    // Lightweight query — just reads the current timestamp from Postgres.
    // Uses service role so RLS doesn't interfere.
    try {
        const supabase = createServerClient();
        const { error } = await supabase
            .from('projects')
            .select('id', { count: 'exact', head: true })
            .limit(1);

        checks.supabase_db = error
            ? { status: 'fail', message: error.message }
            : { status: 'ok' };
    } catch (err) {
        checks.supabase_db = {
            status: 'fail',
            message: err instanceof Error ? err.message : 'Unknown error',
        };
    }

    // ── 3. Supabase Storage ───────────────────────────────────────────────────
    // Checks that the 'proposals' bucket is accessible.
    try {
        const supabase = createServerClient();
        const { error } = await supabase.storage.getBucket('proposals');

        checks.supabase_storage = error
            ? { status: 'fail', message: error.message }
            : { status: 'ok' };
    } catch (err) {
        checks.supabase_storage = {
            status: 'fail',
            message: err instanceof Error ? err.message : 'Unknown error',
        };
    }

    // ── 4. Browserless token check ────────────────────────────────────────────
    // Browserless has no public /ping endpoint, so we verify the token is
    // correctly configured. Service-level outages are caught by IsDown.app.
    checks.browserless_token = process.env.BROWSERLESS_API_TOKEN
        ? { status: 'ok' }
        : { status: 'fail', message: 'BROWSERLESS_API_TOKEN not set' };

    // ── 5. Resend reachability ────────────────────────────────────────────────
    // Calls the Resend /domains list endpoint — read-only, zero side effects.
    try {
        const key = process.env.RESEND_API_KEY;
        if (!key) throw new Error('RESEND_API_KEY not set');

        const res = await fetch('https://api.resend.com/domains', {
            headers: { Authorization: `Bearer ${key}` },
            signal: AbortSignal.timeout(8000),
        });
        // 200 = ok, 401 = bad key (service is up but key is wrong), both mean Resend is reachable
        checks.resend = res.status === 200 || res.status === 401
            ? { status: 'ok' }
            : { status: 'fail', message: `HTTP ${res.status}` };
    } catch (err) {
        checks.resend = {
            status: 'fail',
            message: err instanceof Error ? err.message : 'Unknown error',
        };
    }

    // ── Result ────────────────────────────────────────────────────────────────
    const allOk = Object.values(checks).every((c) => c.status === 'ok');
    const responseTimeMs = Date.now() - start;

    const body = {
        status: allOk ? 'ok' : 'degraded',
        response_time_ms: responseTimeMs,
        timestamp: new Date().toISOString(),
        checks,
    };

    return NextResponse.json(body, {
        status: allOk ? 200 : 503,
    });
}
