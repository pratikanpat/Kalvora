# PROJECT SUMMARY — Kalvora (ProposalFlow)

> **Purpose of this file:** Provide a complete AI context snapshot so that any future coding session can immediately understand the system without scanning the entire codebase.
> Last updated: 2026-03-18 (v4 — GST/business fields in profile, enhanced invoice with CGST/SGST, bank details, edit bug fix)

---

## 1. Product Description

**Project:** Kalvora (internal package name: `proposalflow`)

**Purpose:**
A web tool for interior designers to quickly create structured, professional quotation proposals and generate branded PDF documents that can be shared directly with clients.

**Target Users:**
Interior designers and small interior design studios (primarily Indian market — currency formatted in INR).

**Problem it Solves:**
Interior designers typically create quotations manually in Word or Excel. Kalvora gives them a guided, multi-section form to fill in client info, project details, rooms, services, pricing, and timeline — then instantly generates a beautifully designed PDF proposal they can send to the client.

**Core Workflow:**
1. Designer signs up / logs in (email/password or Google OAuth)
2. Completes studio profile (name, logo, branding, payment terms)
3. Creates a new proposal (fills 8-section form)
4. Saves as draft OR generates PDF immediately
5. Shares proposal with client via a public magic link (`/view/[id]`)
6. Client views, leaves comments, and approves/requests changes
7. Designer receives email notifications via Resend on client actions

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router, TypeScript) |
| **Frontend** | React 18, TailwindCSS 3 |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth (email/password + Google OAuth) |
| **PDF Generation** | Browserless.io REST API (`/pdf` endpoint — single HTTP POST, no browser handshake) |
| **Email Notifications** | Resend (transactional emails for approval/feedback) |
| **Storage** | Supabase Storage (buckets: `logos`, `proposals`) |
| **Icons** | Lucide React |
| **Toasts/Notifications** | react-hot-toast |
| **Hosting** | Vercel (inferred from Next.js + Supabase setup) |
| **Styling** | TailwindCSS with custom `glass-card`, `btn-primary`, `input-field` utility classes in `globals.css` |

**Environment variables required (`.env.local`):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (used server-side to bypass RLS in PDF generation API)
- `BROWSERLESS_API_TOKEN` (Browserless.io API key for remote browser PDF generation)
- `RESEND_API_KEY` (Resend API key for transactional email notifications)
- `NEXT_PUBLIC_APP_URL` (production URL for email links — defaults to `https://kalvora.kaliprlabs.in`)

---

## 3. Folder Structure

```
/src
  /app
    /api
      /generate-pdf      → POST API route: generates PDF using Puppeteer, uploads to Supabase Storage
      /respond-proposal  → POST API route (force-dynamic): handles client actions (view, approve, request_changes), sends emails via Resend; on approval, also emails client an invoice link
      /warmup             → Lightweight warm-up endpoint for serverless cold-start reduction
    /completed           → Lists all projects with status 'Completed'
    /create              → Multi-section form to create a new proposal
    /dashboard           → Lists all user projects (with search, status filter, delete)
    /edit/[id]           → Edit an existing project
    /feedback            → Public feedback submission form
    /forgot-password     → Password reset request page (sends email via Supabase Auth)
    /invoice/[id]        → Public invoice page (no auth) — shows itemized invoice from project data, Print/Save as PDF via window.print()
    /login               → Login page (email/password + Google OAuth)
    /signup              → Signup page (email/password + Google OAuth)
    /reset-password      → Set new password page (from email reset link)
    /profile             → Designer studio profile setup/edit page
    /proposals/[id]      → View saved proposal detail, download/re-generate PDF
    /view/[id]           → Public shareable proposal view with approve/comment workflow
    layout.tsx           → Root layout: wraps AuthProvider + Toaster
    page.tsx             → Landing page (hero, features, template showcase, pricing, CTA)
    globals.css          → Global styles, design tokens, custom utility classes
  /components
    AuthProvider.tsx          → React context: session management, exposes useAuth() hook
    DashboardLayout.tsx       → Authenticated page wrapper with sidebar
    LandingNavbar.tsx         → Public navbar (shows Dashboard link if logged in)
    LoadingSpinner.tsx        → Reusable loading UI
    ProfileSetupModal.tsx     → First-time profile setup modal on dashboard
    ProtectedRoute.tsx        → HOC to redirect unauthenticated users to /login
    Sidebar.tsx               → Left nav sidebar for authenticated views (with red dot for incomplete profile)
    StatusBadge.tsx           → Badge component (Draft / Sent / Approved / Completed)
    SuccessModal.tsx          → Post-generation success modal with PDF download/share links
    TemplatePreviewModal.tsx  → Template preview carousel modal on create page
  /lib
    supabase.ts    → Supabase browser client + build-safe server client (service role, returns placeholder when env vars missing) + config checker
    templates.ts   → All 6 PDF HTML templates (48 KB) — raw HTML/CSS strings rendered by Puppeteer

/supabase
  migration.sql          → Initial DB schema (projects, rooms, line_items, proposals tables)
  auth_migration.sql     → Adds user_id to projects, replaces open RLS with per-user policies
  profile_migration.sql  → Creates designer_profiles table; adds extra columns to projects
  feedback_migration.sql → Creates feedback table with public insert policy
  approval_migration.sql → Adds client_viewed_at to projects, creates comments table
  invoice_profile_migration.sql → Adds gstin, pan_number, hsn_sac_code, invoice_due_days, bank_name, bank_account_number, bank_ifsc, upi_id to designer_profiles
  cascade_delete_migration.sql   → Enables ON DELETE CASCADE for projects.user_id
```

---

## 4. Core Features Implemented

### 1. Authentication (Login / Signup)
- Email/password auth via Supabase Auth.
- **Google OAuth** sign-in/sign-up on both login and signup pages.
- **Forgot Password** flow: email input → Supabase sends reset link → `/reset-password` page lets user set a new password.
- Session persisted via `AuthProvider` (`useAuth()` hook).
- All dashboard/create/edit/profile routes are protected — redirects to `/login` if unauthenticated.
- Landing page shows a "Dashboard" button in hero when user is logged in.

### 2. Studio Profile
- Designer fills in studio name, logo, email, phone, website, Instagram, address, default accent colour, and payment terms.
- **Business & Tax Details** section: GSTIN, PAN number, HSN/SAC code (default: 9971), Invoice Due Days.
- **Payment / Bank Details** section: Bank Name, Account Number, IFSC Code, UPI ID.
- Profile read from `designer_profiles` table (one row per user).
- Data auto-populates into new proposals (logo, designer name, payment terms, accent colour).
- Business/bank details auto-populate into invoices (GSTIN, bank transfer info, UPI).
- Sidebar shows a red dot indicator if profile is incomplete. Dot disappears after profile is saved.
- Profile page defaults to read-only view; "Edit" button enables editing mode.
- Cancel button reverts all fields to the last saved state (snapshot-based revert).

### 3. Create Proposal (8-section form at `/create`)
| Section | Fields |
|---|---|
| 1. Client Info | name*, email, phone, address |
| 2. Project Details | type (Residential/Commercial/Office/Retail)*, size (sq.ft) |
| 3. Rooms | room name + sq.ft (optional, multiple, quick-add buttons) |
| 4. Services Included | checkboxes (7 defaults + custom), shown in PDF |
| 5. Pricing Table | line items (name, qty, unit price), subtotal, tax %, grand total live calc |
| 6. Timeline | estimated start date, timeline description |
| 7. Notes & Terms | payment terms (from profile default), quotation validity days, internal notes |
| 8. Template | pick one of 6 PDF templates (with preview modal) |

- Two actions: **Save as Draft** (status = "Draft") or **Generate & Send** (saves + generates PDF immediately, status = "Sent").
- Profile data fetched on mount to auto-populate payment terms.

### 4. PDF Generation
- Triggered via `POST /api/generate-pdf` with `project_id` (max duration: 30s).
- Server-side API route uses `createServerClient()` (service role) to fetch all project data (project, rooms, line_items) in parallel.
- Fills data into an HTML template string from `src/lib/templates.ts`.
- Generates PDF via **Browserless REST API** (`POST https://chrome.browserless.io/pdf`) — single HTTP POST with HTML + print options, no WebSocket or browser handshake.
- Generated PDF uploaded to Supabase Storage bucket `proposals`.
- PDF URL saved to `proposals` table with `project_id` reference.
- Returns `pdf_url` and `download_filename` to the client.

### 5. 6 PDF Templates
All templates are fully self-contained HTML/CSS strings in `src/lib/templates.ts`:
| Key | Name | Style |
|---|---|---|
| `minimal` | Minimal | Clean white, Inter font, blue accent |
| `luxury` | Luxury | Dark + gold, Playfair Display serif |
| `modern` | Professional | Bold indigo header bar, geometric |
| `blueprint` | Blueprint | Navy + grid background, technical |
| `editorial` | Editorial | Warm ivory, magazine-style whitespace |
| `highcontrast` | High Contrast | Dark + indigo, SaaS-inspired |

### 6. Dashboard
- Lists all user's projects filtered by `user_id`.
- Searchable by client name or project type.
- **Status filter dropdown** to filter by Draft, Sent, Approved, or Completed.
- **"Viewed" indicator** shows when a client has opened the magic link.
- Project cards/table show client name, type, date, status badge.
- Quick delete (with confirm dialog).
- Profile setup modal shown on first login if no profile exists.
- Route prefetching for instant navigation.

### 6b. Completed Projects Page (`/completed`)
- Dedicated page showing only projects with status `Completed`.
- Accessible via sidebar link.

### 7. Proposal Detail Page (`/proposals/[id]`)
- Shows full proposal details.
- Can download/view previously generated PDF.
- Can re-generate PDF.

### 8. Public Proposal View & Client Approval (`/view/[id]`)
- No authentication required (frictionless magic link).
- Shareable link for client to view the proposal.
- **Client Approval Workflow:**
  - Sticky "Approve Proposal" button at bottom of page.
  - **Confirmation Modal**: Clicking "Approve Proposal" opens a confirmation popup asking "Approve this Proposal?" with Cancel and "✓ Yes, Approve & Get Invoice" buttons.
  - On confirm: approves the proposal, notifies the designer via email, sends the client an invoice email, and redirects to `/invoice/[id]`.
  - Inline **Discussion section** with persistent comment history (timestamps + author badges).
  - Clients can send feedback via comments; designer is notified via email (Resend).
  - Comments do NOT change the project status — they are purely for discussion.
- Tracks `client_viewed_at` timestamp when the link is first opened.

### 9. Invoice Page (`/invoice/[id]`)
- Public page (no auth required) — accessible after approval or via email link.
- Displays: Invoice number (auto-generated), Invoice Date, **Due Date** (calculated from `invoice_due_days`), From (designer/studio info + **GSTIN**), Bill To (client info), project details, line items table with **HSN/SAC column**, totals with **CGST/SGST breakdown** (when GST registered), payment terms.
- **Payment Details** section showing Bank Name, Account Number, IFSC, and UPI ID (from designer profile).
- **Status badge**: Shows "Unpaid" (replaces the old "Approved" badge).
- "Print / Save as PDF" button (uses `window.print()` with print-optimized CSS).
- After approval, client receives an email with a link to this page.

### 10. Feedback Page
- Public form (no auth required) to submit name, email, and message.
- Stored in `feedback` table.

---

## 5. Database Schema

### Table: `projects`
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → auth.users (added in auth migration) |
| client_name | TEXT | Required |
| client_email | TEXT | |
| client_phone | TEXT | |
| project_address | TEXT | |
| project_type | TEXT | Residential/Commercial/Office/Retail |
| project_size | TEXT | sq.ft (added in profile migration) |
| designer_name | TEXT | Copied from profile at save time |
| designer_email | TEXT | |
| designer_phone | TEXT | |
| logo_url | TEXT | Supabase Storage URL |
| accent_color | TEXT | Default `#4263eb` |
| notes | TEXT | |
| payment_terms | TEXT | |
| template | TEXT | One of 6 template keys |
| tax_rate | NUMERIC | Percentage |
| status | TEXT | `Draft` / `Sent` / `Approved` / `Completed` |
| client_viewed_at | TIMESTAMPTZ | Set when client opens magic link |
| quotation_validity | INTEGER | Days (default 30) |
| estimated_start_date | TEXT | |
| estimated_timeline | TEXT | |
| services_included | TEXT[] | Array of service names |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### Table: `rooms`
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| project_id | UUID | FK → projects (cascade delete) |
| name | TEXT | |
| square_footage | NUMERIC | |
| created_at | TIMESTAMPTZ | |

### Table: `line_items`
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| project_id | UUID | FK → projects (cascade delete) |
| item_name | TEXT | |
| quantity | NUMERIC | |
| unit_price | NUMERIC | |
| created_at | TIMESTAMPTZ | |

### Table: `proposals`
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| project_id | UUID | FK → projects (cascade delete) |
| pdf_url | TEXT | Supabase Storage public URL |
| created_at | TIMESTAMPTZ | |

### Table: `designer_profiles`
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → auth.users, UNIQUE |
| studio_name | TEXT | |
| designer_name | TEXT | |
| logo_url | TEXT | Supabase Storage `logos` bucket |
| email | TEXT | |
| phone | TEXT | |
| website | TEXT | |
| instagram | TEXT | |
| studio_address | TEXT | |
| default_accent_color | TEXT | Default `#4263eb` |
| default_payment_terms | TEXT | |
| gstin | TEXT | GST Identification Number (15-char) |
| pan_number | TEXT | PAN (optional, for non-GST designers) |
| hsn_sac_code | TEXT | Default HSN/SAC code, typically `9971` |
| invoice_due_days | INTEGER | Default days until invoice due (default 7) |
| bank_name | TEXT | Bank name for invoice payment details |
| bank_account_number | TEXT | Bank account number |
| bank_ifsc | TEXT | IFSC code |
| upi_id | TEXT | UPI ID for digital payments |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### Table: `feedback`
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| name | TEXT | |
| email | TEXT | |
| message | TEXT | |
| created_at | TIMESTAMPTZ | |

### Table: `comments`
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| project_id | UUID | FK → projects |
| content | TEXT | Comment body |
| author_type | TEXT | `Client` or `Designer` |
| created_at | TIMESTAMPTZ | |

**Supabase Storage Buckets:**
- `logos` — public, stores designer studio logos
- `proposals` — public, stores generated PDF files

---

## 6. Important Logic / System Architecture

### Authentication Flow
- `AuthProvider` wraps the entire app in `layout.tsx`. It sets up a Supabase `onAuthStateChange` listener to keep `user` state fresh.
- `ProtectedRoute` component checks `user`; if null, redirects to `/login`.
- `DashboardLayout` and `Sidebar` are only rendered in authenticated routes.

### Proposal Creation Flow
1. User fills the 8-section form at `/create`.
2. On submit, the client fetches the designer profile from `designer_profiles`.
3. Saves project row → in parallel inserts rooms and line_items.
4. If "Generate" is clicked: calls `POST /api/generate-pdf` with `project_id`.

### PDF Generation Flow (Server-Side API Route)
1. `POST /api/generate-pdf` receives `project_id`.
2. Uses `createServerClient()` (service role, bypasses RLS) to fetch project + rooms + line_items **in parallel**.
3. Selects the HTML template based on `project.template`.
4. Fills all data into the template string (string interpolation).
5. Sends HTML to **Browserless REST API** (`POST /pdf`) — single HTTP POST, no WebSocket.
6. Receives A4 PDF buffer in response.
7. Uploads PDF to Supabase Storage bucket `proposals` (parallel with proposal count query).
8. Inserts record into `proposals` table (parallel with status update if Draft).
9. Returns `{ pdf_url, download_filename }` to the client.

### Profile Auto-Population
When creating a new proposal, the form fetches `designer_profiles` on mount and pre-fills `payment_terms`. On save, it copies `studio_name`, `designer_name`, `email`, `phone`, `logo_url`, and `accent_color` from the profile snapshot into the `projects` row. This ensures PDFs always show the correct branding even if the profile changes later.

### Public Proposal Sharing
- Project status is set to `"Sent"` when PDF is generated.
- Supabase RLS policy allows **public** SELECT on `projects` where `status = 'Sent'`.
- The `/view/[id]` page uses this to display the proposal without requiring login.

### RLS Strategy
- All tables use Row Level Security.
- `projects` — users can only CRUD their own rows (`user_id = auth.uid()`).
- `rooms`, `line_items`, `proposals` — access is gated via project ownership check.
- `designer_profiles` — fully user-scoped.
- `feedback` — public INSERT, authenticated SELECT.
- Server API routes use the **service role key** which bypasses RLS (needed for cross-user PDF generation).

---

## 7. Current Limitations

- **No payment tracking** — No way to record partial payments or payment milestones.
- **No project analytics** — No dashboard stats (revenue, projects per month, conversion rate, etc.).
- **No revision history** — Editing a project replaces data; there is no versioning of proposals.
- **No multi-user team access** — Each account is a single designer; no shared studio/team workspace.
- **PDF is regenerated on demand** — No auto-versioning; re-generating overwrites the previous PDF record in the `proposals` table.
- **Currency is hard-coded to INR** — `en-IN` locale and `₹` symbol. Not multi-currency.

---

## 8. Product Roadmap (Inferred)

Based on the product direction and current gaps:

1. **Stripe Subscription & Billing** — Monetize with Free/Pro/Business tiers.
2. **Invoice generator** — After approval, generate a formal invoice from the same project data.
3. **Payment tracking** — Record advance, mid-project, and final payment milestones.
4. **Project analytics dashboard** — Revenue trends, project counts, template usage stats.
5. **Revision history** — Keep old PDF versions, allow the designer to compare drafts.
6. **Multi-currency support** — Allow designers to select currency during proposal creation.
7. **Team / studio accounts** — Multiple designers under one studio account.
8. **Client portal** — Dedicated login for clients to see all their proposals and invoices.
9. **WhatsApp Integration** — Share proposals via WhatsApp (critical for Indian market).
10. **AI-Powered Scope Generator** — Paste a client brief → AI auto-fills rooms, services, and line items.
