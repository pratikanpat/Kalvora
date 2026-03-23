# PROJECT SUMMARY — Kalvora (ProposalFlow)

> **Purpose of this file:** Provide a complete AI context snapshot so that any future coding session can immediately understand the system without scanning the entire codebase.
> Last updated: 2026-03-23 (v11 — Mobile responsiveness, input validation, scroll-to-top fix)

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
5. Shares proposal with client via a short link (`/p/KV-xxxxx` → `/view/[id]`)
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
      /invoice-data      → GET API route (force-dynamic): returns all invoice data using service role (bypasses RLS), for the public invoice page
      /respond-proposal  → POST API route (force-dynamic): handles client actions (view, approve, request_changes), sends emails via Resend; on approval, auto-creates payment milestones and emails client an invoice link
      /send-proposal     → POST API route: emails proposal link to client, updates status Draft→Sent
      /analytics         → GET API route (force-dynamic): returns 4 dashboard stats (total proposals, approval rate, avg deal size, active projects) for authenticated user
      /warmup             → Lightweight warm-up endpoint for serverless cold-start reduction
      /admin/stats       → GET API route (force-dynamic): returns admin overview metrics (total users, projects by status, feedback by type, weekly stats)
      /admin/feedback     → GET API route (force-dynamic): returns all feedback entries with optional type filter
      /admin/users        → GET API route (force-dynamic): returns all users with profiles and proposal counts
    /admin               → Hidden admin dashboard (Overview, Feedback, Users) — protected by ADMIN_EMAILS env var
    /admin/feedback      → Admin feedback viewer with type filters and expandable detail rows
    /admin/users         → Admin users list with studio names, proposal counts, last active
    /try                 → Zero-auth demo page: enter client name + project type + budget → instant proposal preview with template switcher
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
    /p/[code]            → Short link redirect for proposals (resolves KV-xxxxx → /view/[id])
    /i/[code]            → Short link redirect for invoices (resolves KV-xxxxx → /invoice/[id])
    layout.tsx           → Root layout: wraps AuthProvider + Toaster
    page.tsx             → Landing page (pain-first hero, before/after, 4-step workflow, features, templates, who it's for, FAQ, pricing, final CTA)
    globals.css          → Global styles, design tokens, custom utility classes
  /components
    AuthProvider.tsx          → React context: session management, exposes useAuth() hook
    DashboardLayout.tsx       → Authenticated page wrapper with sidebar
    LandingNavbar.tsx         → Public navbar (shows Dashboard link if logged in)
    LoadingSpinner.tsx        → Reusable loading UI
    ProfileSetupModal.tsx     → First-time profile setup modal on dashboard
    ProtectedRoute.tsx        → HOC to redirect unauthenticated users to /login
    LogoutFeedbackModal.tsx   → Modal shown on logout to capture friction feedback
    Sidebar.tsx               → Left nav sidebar for authenticated views (with red dot for incomplete profile, logout → feedback modal)
    AdminGuard.tsx            → Admin route protector: checks email against NEXT_PUBLIC_ADMIN_EMAILS, redirects non-admins to /dashboard
    StatusBadge.tsx           → Badge component (Draft / Sent / Approved / Completed)
    PaymentMilestones.tsx     → Payment milestone management (add/edit/delete/mark paid) with default presets (30/40/30)
    SuccessModal.tsx          → Post-generation success modal with PDF download/share links
    TemplatePreviewModal.tsx  → Template preview carousel modal on create page
  /lib
    supabase.ts    → Supabase browser client + build-safe server client (service role, returns placeholder when env vars missing) + config checker
    shortcode.ts   → Short link generation and resolution (KV-xxxxx codes), client-side + server-side variants
    validators.ts  → Centralized input validation (email, phone, GSTIN, PAN, IFSC, bank account, UPI ID, HSN/SAC, numeric range)
    templates.ts   → All 6 PDF HTML templates (48 KB) — raw HTML/CSS strings rendered by Puppeteer

/supabase
  migration.sql          → Initial DB schema (projects, rooms, line_items, proposals tables)
  auth_migration.sql     → Adds user_id to projects, replaces open RLS with per-user policies
  profile_migration.sql  → Creates designer_profiles table; adds extra columns to projects
  feedback_migration.sql → Creates feedback table with structured columns (v2: prior_tools, ease_rating, best_feature, frustrations, feature_wish, pmf_answer, feedback_type, user_id)
  approval_migration.sql → Adds client_viewed_at to projects, creates comments table
  invoice_profile_migration.sql → Adds gstin, pan_number, hsn_sac_code, invoice_due_days, bank_name, bank_account_number, bank_ifsc, upi_id to designer_profiles
  cascade_delete_migration.sql   → Enables ON DELETE CASCADE for projects.user_id
  payment_milestones_migration.sql → Creates payment_milestones table for tracking advance/mid/final payments
  short_links_migration.sql → Creates short_codes table, fixes RLS for public proposal access (all non-Draft statuses), adds public read policies for rooms/line_items/proposals/payment_milestones/comments
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
| 3. Rooms | room name + sq.ft (optional, multiple, **project-type-specific** quick-add buttons) |
| 4. Services Included | checkboxes (7 defaults + custom), shown in PDF |
| 5. Pricing Table | line items (name, qty, unit price), **project-type-specific** quick-add presets, subtotal, tax %, grand total live calc |
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
- **Redirect loading overlay**: After approval, shows a full-screen spinner with "Preparing Your Invoice" while redirecting to `/invoice/[id]`.

### 9. Invoice Page (`/invoice/[id]`)
- Public page (no auth required) — accessible after approval or via email link.
- **Data fetched via `/api/invoice-data`** (server-side, service role) — bypasses RLS so the page always works regardless of anon RLS config.
- Displays: Invoice number (auto-generated), Invoice Date, **Due Date** (calculated from `invoice_due_days`), From (designer/studio info + **GSTIN**), Bill To (client info), project details, line items table with **HSN/SAC column**, totals with **CGST/SGST breakdown** (when GST registered), payment terms.
- **Payment Details** section showing Bank Name, Account Number, IFSC, and UPI ID (from designer profile).
- **Status badge**: Shows "Unpaid" (replaces the old "Approved" badge).
- "Print / Save as PDF" button (uses `window.print()` with print-optimized CSS).
- After approval, client receives an email with a link to this page.
- **Designer access**: "View Invoice" and "Copy Invoice Link" buttons appear on `/proposals/[id]` for Approved/Paid/Completed projects.

### 10. Feedback System

**Structured Feedback Page (`/feedback`):**
- Guided form with PMF-grade questions to capture actionable insights.
- Fields: Name*, Email, Prior Tools (multi-select), Ease Rating (1–5 scale), Best Feature, Frustrations, Feature Wish, PMF Question ("How disappointed would you be if Kalvora disappeared?")*, Additional Thoughts.
- Validates required fields (name, ease rating, PMF answer) before submission.
- Stores structured data in `feedback` table with `feedback_type = 'structured'`.

**Public Feedback Page (`/public-feedback`):**
- Standalone page for non-registered visitors (no auth required).
- One focused question: "What almost stopped you from trying Kalvora today?"
- 6 selectable blocker options (multi-select): "Didn't understand what it does", "Looks too basic", "I already use another tool", "No pricing clarity", "Need more features first", "Just browsing".
- Open text area for additional thoughts.
- Optional name and email fields.
- Stores feedback in `feedback` table with `feedback_type = 'public_landing'` and `user_id = null`.
- Landing page CTA routes logged-out users to `/public-feedback`, logged-in users to `/feedback`.
- Footer "Feedback" link also points to `/public-feedback`.

**Logout Feedback Modal (`LogoutFeedbackModal.tsx`):**
- Triggered when a user clicks "Log out" in the Sidebar (intercepts logout flow).
- Asks one friction question: "What almost stopped you from creating a proposal today?"
- Two actions: "Skip & Log out" (no feedback) or "Submit & Log out" (saves feedback with `feedback_type = 'logout_trigger'`).
- Feedback silently fails if insert errors — never blocks the logout.

### 11. Distribution & Sharing (Growth Features — Phase 1)

**WhatsApp Share Button:**
- Added to proposals detail page (`/proposals/[id]`).
- Opens `wa.me/?text=` with pre-filled message containing the shareable proposal link.

**"Powered by Kalvora" Viral CTA:**
- Public view (`/view/[id]`) and invoice (`/invoice/[id]`) pages now show a clickable CTA footer: *"This proposal was created with KALVORA — Create yours in 60 seconds →"*
- Links to the Kalvora landing page. On invoice, hidden during print.

**Pain-First Landing Page:**
- Hero: "Stop Chasing Clients on WhatsApp With Word Docs" with trust strip.
- Before/After comparison section.
- 4-step workflow (Fill → Template → WhatsApp → Auto Invoice).
- Who It's For (Freelancers, Studios, Architects, Home Staging).
- FAQ accordion (5 questions).
- Pricing: "Free during early access. Pro at ₹999/mo — early users lock in 50% off."
- Final CTA: "Your next proposal is 60 seconds away."

**Email to Client (`POST /api/send-proposal`):**
- Sends a branded email to the client with a short proposal link (e.g., `https://kalvora.kaliprlabs.in/p/KV-R7x3mQ`) via Resend.
- Auto-updates project status from Draft to Sent.
- Button available on proposals detail page.

### 12. Short Link System

**Short Codes (`short_codes` table + `src/lib/shortcode.ts`):**
- All shareable links now use short, readable codes like `KV-R7x3mQ` instead of raw UUIDs.
- Format: `https://kalvora.kaliprlabs.in/p/KV-R7x3mQ` (proposals) or `/i/KV-R7x3mQ` (invoices).
- Short codes are 8 characters: `KV-` prefix + 6 base62 alphanumeric chars.
- Codes are generated on-demand and cached in the `short_codes` table.
- Two redirect routes: `/p/[code]` → `/view/[id]` and `/i/[code]` → `/invoice/[id]`.
- Falls back to full UUID URLs if short code generation fails.
- Server-side variant (`getOrCreateShortCodeServer`) used in API routes (bypasses RLS).
- Client-side variant (`getOrCreateShortCode`) used in frontend components.
- All link generation points updated: proposals page, SuccessModal, dashboard WhatsApp reminders, send-proposal email, respond-proposal email.

### 13. Dashboard Intelligence (Growth Features — Phase 2)

**Updated Status Pipeline (`ProjectPipeline.tsx`):**
- Now 6-step: Draft → Sent → Viewed → Approved → Paid → Completed.
- "Viewed" is a virtual step — status stays "Sent" but `client_viewed_at` is set.
- `clientViewedAt` prop passed from dashboard and proposals pages.

**Action Prompt Cards:**
- Shown at top of dashboard project list when relevant.
- "X proposals awaiting response" (Sent, not viewed) — amber card.
- "X viewed — awaiting approval" (Sent + viewed) — blue card.
- "X invoices pending payment" (Approved) — emerald card.
- Each card is clickable → filters the project list to that status.

**Follow-up Reminders:**
- Inline nudges for proposals "Sent" 3+ days ago with no client view.
- Shows "No response in X days — Remind [Client Name]?" with WhatsApp reminder button.

**Duplicate Proposal:**
- One-click button on proposals detail page (`/proposals/[id]`).
- Clones project data, rooms, and line_items with new UUID and "Draft" status.
- Redirects to edit page for the new copy.

### 14. Revenue Enablers (Growth Features — Phase 3)

**Payment Milestone Tracking (`PaymentMilestones.tsx`):**
- Dedicated component on proposals detail page (`/proposals/[id]`).
- Table: Label | Amount | Due Date | Status (Paid/Unpaid).
- Default presets button: creates Advance (30%), Mid-project (40%), Final (30%) milestones based on grand total.
- Inline add custom milestone form (label, amount, due date).
- "Mark as Paid" button per row, delete button.
- Paid/pending totals shown in header.
- Read-only "Payment Schedule" table also shown on invoice page (`/invoice/[id]`).

**Auto-Invoice After Approval:**
- When a client approves a proposal via `/view/[id]`, the `respond-proposal` API route automatically creates default payment milestones (30/40/30 of grand total) if none exist.
- Fetches line_items + tax_rate to compute exact grand total.
- Non-blocking: if milestone creation fails, approval still succeeds.

**Simple Analytics Strip (Dashboard):**
- 4-stat card strip at top of dashboard: Total Proposals, Approval Rate, Avg Deal Size, Active Projects.
- Data fetched from `GET /api/analytics` (authenticated, server-side).
- Approval Rate = (Approved + Paid + Completed) / (Sent + Approved + Paid + Completed) × 100.
- Avg Deal Size = average grand_total (with tax) across approved/paid/completed projects.
- Active Projects = count of non-Draft, non-Completed projects.

### 15. Hidden Admin Dashboard (`/admin`)

**Access Control:**
- Protected by `ADMIN_EMAILS` environment variable (comma-separated email whitelist).
- `AdminGuard.tsx` component checks logged-in user's email against `NEXT_PUBLIC_ADMIN_EMAILS`.
- Non-admin users are silently redirected to `/dashboard`. No links to admin exist anywhere on the site.
- API routes verify admin email server-side using `ADMIN_EMAILS` env var.

**Overview Page (`/admin`):**
- 4 metric cards: Total Users, Total Proposals, Total Feedback, Approval Rate.
- Weekly stats: signups this week, proposals this week.
- Proposals by Status bar chart (Draft/Sent/Approved/Paid/Completed).
- Feedback by Source breakdown (Structured, Logout Modal, Public Landing).

**Feedback Viewer (`/admin/feedback`):**
- Table of all feedback entries across all users and visitors.
- Filter by feedback type (All / Structured / Logout / Public Landing).
- Expandable detail rows showing ease rating, best feature, frustrations, feature wish, PMF answer.
- Color-coded type badges, newest-first sorting.

**Users List (`/admin/users`):**
- Table of all registered users with designer name, email, studio name, proposal count, signup date, last active.
- Desktop table view + responsive mobile cards.

**Admin Layout:**
- Separate amber-themed sidebar (distinct from user sidebar) with Overview, Feedback, Users navigation.
- "Back to Dashboard" link in sidebar footer.
- Mobile tab bar for responsive access.

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
| message | TEXT | Nullable (structured feedback may not include it) |
| prior_tools | TEXT[] | Array of tool names the user used before Kalvora |
| ease_rating | INTEGER | 1–5 scale |
| best_feature | TEXT | Free-text favorite feature |
| frustrations | TEXT | Free-text pain points |
| feature_wish | TEXT | Free-text dream feature |
| pmf_answer | TEXT | `very_disappointed` / `somewhat_disappointed` / `not_disappointed` |
| feedback_type | TEXT | `structured` (form) or `logout_trigger` (modal). Default: `structured` |
| user_id | UUID | Optional FK to auth.users |
| created_at | TIMESTAMPTZ | |

### Table: `comments`
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| project_id | UUID | FK → projects |
| content | TEXT | Comment body |
| author_type | TEXT | `Client` or `Designer` |
| created_at | TIMESTAMPTZ | |

### Table: `payment_milestones`
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| project_id | UUID | FK → projects (cascade delete), NOT NULL |
| label | TEXT | e.g. 'Advance', 'Mid-project', 'Final' |
| amount | NUMERIC | Default 0 |
| due_date | DATE | Optional |
| paid_at | TIMESTAMPTZ | Set when marked as paid |
| created_at | TIMESTAMPTZ | |

### Table: `short_codes`
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| code | VARCHAR(12) | Unique, e.g. `KV-R7x3mQ` |
| project_id | UUID | FK → projects (cascade delete) |
| link_type | VARCHAR(10) | `view` or `invoice` |
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
- Supabase RLS policy allows **public** SELECT on `projects` where `status IN ('Sent', 'Approved', 'Paid', 'Completed')`.
- Public read policies also exist on `rooms`, `line_items`, `proposals`, `payment_milestones`, and `comments` tables — scoped to projects with shareable statuses.
- The `/view/[id]` page uses this to display the proposal without requiring login.
- All shared links use short codes (e.g., `/p/KV-R7x3mQ`) that redirect to full `/view/[id]` routes.

### RLS Strategy
- All tables use Row Level Security.
- `projects` — users can only CRUD their own rows (`user_id = auth.uid()`). Public SELECT allowed for non-Draft statuses.
- `rooms`, `line_items`, `proposals`, `payment_milestones` — access is gated via project ownership check + public read for shared proposals.
- `comments` — public INSERT/SELECT via "Allow all" policy + additional public read for shared proposals.
- `short_codes` — public SELECT (anyone can resolve a code), INSERT restricted to authenticated project owners.
- `designer_profiles` — fully user-scoped.
- `feedback` — public INSERT, authenticated SELECT.
- Server API routes use the **service role key** which bypasses RLS (needed for cross-user PDF generation).

---

### 16. Mobile Responsiveness & Input Validation

**Mobile / Tablet Responsiveness:**
- Touch-friendly tap targets: all inputs, selects, and buttons enforce 44px minimum height on mobile (Apple/Google HIG).
- Font size 16px on mobile inputs prevents iOS auto-zoom on focus.
- Tablet-specific adjustments (42px input height for 769–1024px screens).
- Safe area insets for notched phones (iPhone X+).
- Action buttons on create/edit pages stack vertically on mobile (`flex-col sm:flex-row`).
- Profile header wraps cleanly on small screens (`flex-col sm:flex-row`).
- Glass card border-radius slightly reduced on mobile for better fit.

**Input Validation (`src/lib/validators.ts`):**
- Centralized validation utility with regex-based validators.
- All validators return `{ valid: boolean, message?: string }` for inline error display.
- Validators: `validateEmail`, `validatePhone` (Indian 10-digit), `validateGSTIN` (15-char), `validatePAN` (10-char), `validateIFSC` (11-char), `validateBankAccount` (9–18 digits), `validateUpiId`, `validateHsnSac` (4–8 digits), `validateNumericRange`.
- Profile page: validates all banking/tax fields on save, shows inline red error messages, blocks save on invalid data.
- Create/Edit pages: validates client email and phone format before submission.
- Login/Signup pages: validates email format before submission.

**Scroll to Top After Profile Save:**
- After successful profile save, page smoothly scrolls to top via `window.scrollTo({ top: 0, behavior: 'smooth' })`.

---

## 7. Current Limitations

- **No payment tracking** — ~~No way to record partial payments or payment milestones.~~ **RESOLVED in Phase 3** — Payment milestones now track advance/mid/final payments.
- **No project analytics** — ~~No dashboard stats.~~ **RESOLVED in Phase 3** — Analytics strip shows total proposals, approval rate, avg deal size, active projects.
- **No short URLs** — ~~All shared links used raw UUIDs.~~ **RESOLVED** — Short link system with `KV-xxxxx` codes and `/p/`, `/i/` redirect routes.
- **No input validation** — ~~Banking credentials and contact fields had no constraints.~~ **RESOLVED** — Centralized validators for email, phone, GSTIN, PAN, IFSC, bank account, UPI, HSN/SAC.
- **No revision history** — Editing a project replaces data; there is no versioning of proposals.
- **No multi-user team access** — Each account is a single designer; no shared studio/team workspace.
- **PDF is regenerated on demand** — No auto-versioning; re-generating overwrites the previous PDF record in the `proposals` table.
- **Currency is hard-coded to INR** — `en-IN` locale and `₹` symbol. Not multi-currency.

---

## 8. Product Roadmap (Inferred)

Based on the product direction and current gaps:

1. **Stripe Subscription & Billing** — Monetize with Free/Pro/Business tiers.
2. **Revision history** — Keep old PDF versions, allow the designer to compare drafts.
3. **Multi-currency support** — Allow designers to select currency during proposal creation.
4. **Team / studio accounts** — Multiple designers under one studio account.
5. **Client portal** — Dedicated login for clients to see all their proposals and invoices.
6. **AI-Powered Scope Generator** — Paste a client brief → AI auto-fills rooms, services, and line items.
