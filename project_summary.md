# PROJECT SUMMARY — Kalvora (ProposalFlow)

> **Purpose of this file:** Provide a complete AI context snapshot so that any future coding session can immediately understand the system without scanning the entire codebase.
> Last updated: 2026-03-12

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
1. Designer signs up / logs in
2. Completes studio profile (name, logo, branding, payment terms)
3. Creates a new proposal (fills 8-section form)
4. Saves as draft OR generates PDF immediately
5. Shares proposal with client via a public link (`/view/[id]`)
6. Client views the proposal (read-only public page)

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router, TypeScript) |
| **Frontend** | React 18, TailwindCSS 3 |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth (email/password) |
| **PDF Generation** | Puppeteer Core + Browserless.io (remote browser via WebSocket) |
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

---

## 3. Folder Structure

```
/src
  /app
    /api
      /generate-pdf      → POST API route: generates PDF using Puppeteer, uploads to Supabase Storage
    /create              → Multi-section form to create a new proposal
    /dashboard           → Lists all user projects (with search + delete)
    /edit/[id]           → Edit an existing project
    /feedback            → Public feedback submission form
    /login               → Login page (Supabase Auth)
    /signup              → Signup page (Supabase Auth)
    /profile             → Designer studio profile setup/edit page
    /proposals/[id]      → View saved proposal detail, download/re-generate PDF
    /view/[id]           → Public shareable proposal view (no auth required, only for 'Sent' status)
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
    StatusBadge.tsx           → Badge component (Draft / Sent / Approved)
    SuccessModal.tsx          → Post-generation success modal with PDF download/share links
    TemplatePreviewModal.tsx  → Template preview carousel modal on create page
  /lib
    supabase.ts    → Supabase browser client + server client (service role) + config checker
    templates.ts   → All 6 PDF HTML templates (48 KB) — raw HTML/CSS strings rendered by Puppeteer

/supabase
  migration.sql          → Initial DB schema (projects, rooms, line_items, proposals tables)
  auth_migration.sql     → Adds user_id to projects, replaces open RLS with per-user policies
  profile_migration.sql  → Creates designer_profiles table; adds extra columns to projects
  feedback_migration.sql → Creates feedback table with public insert policy
```

---

## 4. Core Features Implemented

### 1. Authentication (Login / Signup)
- Email/password auth via Supabase Auth.
- Session persisted via `AuthProvider` (`useAuth()` hook).
- All dashboard/create/edit/profile routes are protected — redirects to `/login` if unauthenticated.
- Landing page shows a "Dashboard" button in hero when user is logged in.

### 2. Studio Profile
- Designer fills in studio name, logo, email, phone, website, Instagram, address, default accent colour, and payment terms.
- Profile read from `designer_profiles` table (one row per user).
- Data auto-populates into new proposals (logo, designer name, payment terms, accent colour).
- Sidebar shows a red dot indicator if profile is incomplete. Dot disappears after profile is saved.
- Profile page defaults to read-only view; "Edit" button enables editing mode.

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
- Triggered via `POST /api/generate-pdf` with `project_id`.
- Server-side API route uses `createServerClient()` (service role) to fetch all project data (project, rooms, line_items, designer_profiles).
- Fills data into an HTML template string from `src/lib/templates.ts`.
- Renders using Puppeteer Core + `@sparticuz/chromium` (serverless-safe).
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
- Project cards/table show client name, type, date, status badge.
- Quick delete (with confirm dialog).
- Profile setup modal shown on first login if no profile exists.
- Route prefetching for instant navigation.

### 7. Proposal Detail Page (`/proposals/[id]`)
- Shows full proposal details.
- Can download/view previously generated PDF.
- Can re-generate PDF.

### 8. Public Proposal View (`/view/[id]`)
- No authentication required.
- Only accessible if project status = "Sent" (enforced by Supabase RLS policy).
- Shareable link for client to view the proposal.

### 9. Feedback Page
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
| status | TEXT | `Draft` / `Sent` |
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
2. Uses `createServerClient()` (service role, bypasses RLS) to fetch project + rooms + line_items + designer profile.
3. Selects the HTML template based on `project.template`.
4. Fills all data into the template string (string interpolation).
5. Connects to Browserless.io remote browser via WebSocket (`puppeteer.connect()`).
6. Renders the HTML, generates A4 PDF buffer.
7. Disconnects from browser (Browserless manages lifecycle).
8. Uploads PDF to Supabase Storage bucket `proposals`.
9. Inserts record into `proposals` table.
10. Returns `{ pdf_url, download_filename }` to the client.

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

- **No invoice generation** — There is no separate invoice flow. The PDF is always a "quotation/proposal."
- **No client approval workflow** — Clients can only view the proposal; there is no approve/reject or e-signature mechanism.
- **No payment tracking** — No way to record partial payments or payment milestones.
- **No project analytics** — No dashboard stats (revenue, projects per month, conversion rate, etc.).
- **No email sending** — The app generates a shareable link but does not send the proposal via email.
- **No revision history** — Editing a project replaces data; there is no versioning of proposals.
- **No multi-user team access** — Each account is a single designer; no shared studio/team workspace.
- **PDF is regenerated on demand** — No auto-versioning; re-generating overwrites the previous PDF record in the `proposals` table.
- **Currency is hard-coded to INR** — `en-IN` locale and `₹` symbol. Not multi-currency.

---

## 8. Product Roadmap (Inferred)

Based on the product direction and current gaps:

1. **Client approval system** — Add a "Approve" / "Request changes" button on the public view, notify designer via email.
2. **Invoice generator** — After approval, generate a formal invoice from the same project data.
3. **Email delivery** — Send proposal/invoice directly from the app to the client's email.
4. **Payment tracking** — Record advance, mid-project, and final payment milestones.
5. **Project analytics dashboard** — Revenue trends, project counts, template usage stats.
6. **Revision history** — Keep old PDF versions, allow the designer to compare drafts.
7. **Multi-currency support** — Allow designers to select currency during proposal creation.
8. **Team / studio accounts** — Multiple designers under one studio account.
9. **Client portal** — Dedicated login for clients to see all their proposals and invoices.
10. **Proposal templates library** — Reusable project templates (pre-filled line items for common project types).
