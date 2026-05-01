# KALVORA — Product Requirements Document (PRD)

> **Document type:** Product Requirements Document (Living Document)  
> **Version:** 2.0  
> **Last updated:** 2026-04-27  
> **Status:** Active — Early Access (Pre-Revenue)  
> **Product URL:** [https://kalvora.kaliprlabs.in](https://kalvora.kaliprlabs.in)  
> **Parent Company:** Kalipr Labs  
> **Author:** Product & Engineering, Kalipr Labs  
> **Audience:** Founders, developers, designers, investors, and new team members

> [!NOTE]
> This is a **living document**. It serves as the single source of truth for what Kalvora is, what it does, and where it's going. Every feature described here is implemented and live unless explicitly marked otherwise. Update this document before or alongside any significant product change.

---

## 1. Product Vision & Overview

Kalvora is a **complete project management and client-closing platform built specifically for interior designers** in India. It is *not* just a proposal generator — it is an end-to-end workflow tool that takes a designer from the first client conversation all the way through to final payment collection.

At its core, Kalvora replaces the fragmented, manual process that most interior design studios rely on today — Word documents, Excel spreadsheets, WhatsApp follow-ups, and manually created invoices — with a single, integrated, branded system that handles:

- **Proposal creation** with the designer's own studio branding (logo, colors, payment terms).
- **Instant sharing** via WhatsApp link or email — no bulky PDFs to attach.
- **Real-time tracking** — designers know exactly when a client opens, views, or ignores their proposal.
- **Client collaboration** — clients can comment, request changes, or approve the proposal from the same link.
- **Automatic invoice generation** — the moment a client approves, a GST-compliant invoice with payment milestones is generated and emailed.
- **Full pipeline visibility** — every project is tracked through 6 clear stages: Draft → Sent → Viewed → Approved → Paid → Completed.
- **PDF downloads** — every proposal can be downloaded as a professionally formatted, studio-branded PDF.
- **Revision history** — every generated PDF version is stored and accessible, so designers can always go back and reference what was sent.

**In one sentence:** Kalvora helps interior designers stop chasing clients on WhatsApp and start closing projects professionally.

---

## 2. Target Market

Kalvora is designed for the Indian interior design market. The primary users are:

| Segment | Description |
|---|---|
| **Independent Interior Designers** | Solo designers who handle 5–20 projects a year and currently use Word/Excel/Canva for proposals. |
| **Small Design Studios** (2–5 people) | Studios where one or two people manage all client communication and documentation. |
| **Freelance Interior Designers** | Freelancers who need to look professional without having the resources for a full branding team. |
| **Design Students & New Practices** | New designers entering the market who need a system from day one. |

**Why India specifically?**
- All pricing is in INR (₹), formatted for Indian locale (`en-IN`).
- GST compliance is built in — GSTIN, HSN/SAC codes, CGST/SGST breakdowns are native to the invoicing system.
- WhatsApp is the primary sharing channel, reflecting the dominant business communication tool in India.
- Payment milestones follow the standard Indian interior design pattern: Advance (30%) → Mid-project (40%) → Final (30%).

---

## 3. Problem Statement

The typical workflow of an interior designer in India today looks like this:

1. Meet a potential client.
2. Go home and create a proposal in Microsoft Word or Excel.
3. Export it as a PDF.
4. Send it on WhatsApp.
5. Wait.
6. Follow up. Again. And again.
7. No idea if the client even opened the file.
8. If the client approves verbally, manually create an invoice — often in a different tool.
9. Chase payment with more WhatsApp messages.

**This process has three critical failures:**

- **No visibility:** The designer never knows if the client opened the proposal, shared it with someone, or is comparing it with a competitor.
- **No professionalism:** Word documents and generic PDFs don't inspire confidence. They look amateur compared to what modern clients expect.
- **No automation:** Every step from proposal to invoice to payment tracking is manual, repetitive, and error-prone.

Kalvora eliminates all three by providing a single platform where proposals look professional, sharing is effortless, client engagement is visible, and invoices generate themselves.

---

## 4. User Personas

### Persona 1: Sneha — Independent Interior Designer

| Attribute | Detail |
|---|---|
| **Age / Location** | 29, Mumbai |
| **Experience** | 4 years, runs a solo practice |
| **Projects/year** | 8–12 residential projects |
| **Current tools** | Canva for proposals, Excel for pricing, WhatsApp for everything else |
| **Pain points** | Spends 2+ hours per proposal formatting. Never knows if client opened. Loses track of follow-ups. Creates invoices manually after verbal approval. |
| **Goal** | Look professional, close faster, spend time designing — not documenting. |
| **Kalvora value** | Creates branded proposals in minutes, tracks client views, gets instant invoice on approval. |

### Persona 2: Rajesh — Small Studio Owner

| Attribute | Detail |
|---|---|
| **Age / Location** | 38, Pune |
| **Experience** | 10 years, 3-person studio |
| **Projects/year** | 15–25 (mix of residential and commercial) |
| **Current tools** | Word templates, Tally for invoicing, phone calls for follow-up |
| **Pain points** | No central system for all proposals. Forgets which client got which version. Tax-compliant invoicing is tedious. |
| **Goal** | One place to manage proposals, invoices, and client interactions with GST compliance. |
| **Kalvora value** | All proposals in one dashboard, auto-generated GST invoices, pipeline tracking across all projects. |

### Persona 3: Priya — The Client (Secondary User)

| Attribute | Detail |
|---|---|
| **Age / Location** | 34, Bangalore |
| **Context** | Getting her 3BHK apartment designed, evaluating 2–3 designers |
| **Current experience** | Receives proposals as WhatsApp PDFs. Hard to compare. No way to give feedback except calling. |
| **Pain points** | Can't easily review proposals on phone. No clear way to approve or request changes. Doesn't know payment schedule until verbally told. |
| **Goal** | View a clean proposal, request changes easily, approve when ready, know exactly what to pay and when. |
| **Kalvora value** | Opens a clean link on any device, comments inline, approves with one click, receives invoice with payment schedule instantly. |

---

## 5. Features & Functional Requirements

### 5.1 Studio Profile & Branding

Before creating any proposal, the designer sets up their studio identity once. This profile is then automatically applied to every proposal and invoice they create.

**What the profile includes:**

- **Studio Identity:** Studio name, designer name, logo upload (supports PNG, JPG, SVG, WebP — max 2 MB, stored as base64).
- **Contact Details:** Email, phone, website URL, Instagram handle, studio address.
- **Business & Tax Details:** GSTIN (15-character format), PAN number, HSN/SAC code (default: 9971 for interior design services), and configurable invoice due days.
- **Payment / Bank Details:** Bank name, account number, IFSC code, and UPI ID — all displayed on generated invoices so clients know exactly where to pay.
- **Defaults:** A default accent color (hex code) applied to all proposal templates, and default payment terms text that pre-fills into every new proposal.

**Key behaviors:**
- The profile page opens in **read-only mode** by default. The designer clicks "Edit" to make changes, and "Cancel" reverts to the last saved state (snapshot-based revert).
- If the profile is incomplete (no name or email), a **red dot indicator** appears on the sidebar navigation — it disappears once the profile is saved.
- All banking and tax fields are **validated on save** using centralized validators (GSTIN format, PAN format, IFSC format, bank account length, UPI format).

---

### 5.2 Proposal Creation

Creating a proposal is a guided, 8-section form that typically takes under 2 minutes to complete.

| Section | What the designer fills in |
|---|---|
| **1. Client Info** | Client name (required), email, phone, project address. |
| **2. Project Details** | Project type (Residential / Commercial / Office / Retail), total area in sq.ft. |
| **3. Rooms** | Room names with square footage. Quick-add buttons change based on project type — e.g., "Living Room", "Kitchen", "Master Bedroom" for Residential; "Reception", "Conference Room", "Cabin" for Office. |
| **4. Services Included** | Checkboxes for common services (7 defaults + custom entries). These appear on the proposal PDF. |
| **5. Pricing Table** | Line items with item name, quantity, and unit price. Quick-add presets change based on project type. Live-calculated subtotal, configurable tax %, and auto-computed grand total. |
| **6. Timeline** | Estimated start date and timeline description. |
| **7. Notes & Terms** | Payment terms (pre-filled from profile default), quotation validity in days, and internal notes. |
| **8. Template Selection** | Choose from 6 professionally designed PDF templates. A preview modal lets the designer see how each template looks before committing. |

**Two save options:**
- **Save as Draft** — saves the proposal without generating a PDF. Status = "Draft". The designer can return and edit later.
- **Generate & Send** — saves the proposal AND immediately generates a professional PDF. Status = "Sent". The proposal is now ready to share.

**Profile data auto-populates:** When creating a new proposal, Kalvora automatically pulls the designer's studio name, logo, accent color, payment terms, and contact details from their profile — so they never need to re-enter this information.

---

### 5.3 PDF Generation System

Kalvora generates studio-branded PDF proposals using a cloud-based headless browser service (Browserless.io).

**How it works:**
1. The designer clicks "Generate & Send".
2. The server collects all project data (client info, rooms, line items, pricing) in parallel for speed.
3. The data is injected into one of **6 HTML/CSS templates** stored in the codebase (~50 KB total).
4. The rendered HTML is sent to Browserless.io's REST API, which renders it as a PDF.
5. The PDF is uploaded to cloud storage (Supabase Storage) and the download URL is saved.
6. **Every generated PDF is stored permanently** — when a designer regenerates a proposal (e.g., after editing), the new PDF is added alongside the old ones. All versions remain accessible.

**The 6 available templates:**
Each template has a distinct visual style (clean modern, bold corporate, minimal, elegant, etc.), but they all share the same data structure: client details, room list, pricing table with subtotals, service inclusions, designer contact, payment terms, and the designer's logo/branding.

---

### 5.4 Sharing & Distribution

Once a proposal is generated, the designer has three ways to share it with the client:

| Method | How it works |
|---|---|
| **Copy Shareable Link** | Copies a short URL (format: `kalvora.in/p/KV-xxxxx`) to clipboard. The designer pastes it anywhere — WhatsApp, SMS, email. |
| **Share on WhatsApp** | Opens WhatsApp with a pre-composed message: *"Hi! Here's your proposal for [project type]: [link]"*. One tap to send. |
| **Email to Client** | Sends a professionally formatted email to the client's email address with a "View Proposal →" button. Uses Resend for reliable delivery. |

**Short links:** All shareable URLs use a human-friendly short code system (`KV-xxxxx`). This avoids exposing raw database UUIDs in client-facing links, and makes the links clean for WhatsApp messages.

---

### 5.5 Client Experience (Public View)

When a client clicks the shared proposal link, they see a **clean, branded, public-facing page** — no login required. This is the `/view/[id]` page.

**What the client sees:**
- A branded header with the proposal title, project type, and date.
- The designer's name and contact details.
- A project summary (client name, project type, address).
- Room breakdown with square footage.
- **Total project cost** (prominently displayed with the designer's accent color).
- A "Download PDF" button for the latest generated PDF.
- The designer's full contact card (email, phone — both clickable).

**What the client can do:**

1. **View the proposal** — The moment the client opens the link, Kalvora silently records this as a "view" and timestamps it. The designer is immediately able to see that their client has viewed the proposal.

2. **Comment / Request Changes** — A discussion section at the bottom of the proposal allows the client to type feedback and send it. The comment is saved to the database, and the **designer receives an email notification** with the client's exact feedback. The designer can also respond via the discussion thread from their dashboard. This two-way conversation happens entirely within the proposal page — no WhatsApp back-and-forth needed.

3. **Approve the Proposal** — A sticky "Approve Proposal" button is fixed to the bottom of the screen. When clicked, a confirmation modal appears: *"Approve this Proposal? The designer will be notified. You will receive an invoice by email and can view it immediately."* Upon confirmation:
   - The project status updates to "Approved".
   - **Payment milestones are automatically created** (default: Advance 30%, Mid-project 40%, Final 30%).
   - The **designer receives an email**: *"🎉 Proposal Approved by [Client Name]"*.
   - The **client receives an email** with a link to their auto-generated invoice.
   - The client is immediately redirected to the invoice page.

---

### 5.6 Automatic Invoice Generation

When a client approves a proposal, Kalvora **automatically generates a GST-compliant invoice**. The designer does not need to create it manually — it is ready the instant approval happens.

**What the invoice includes:**
- Auto-generated invoice number.
- Invoice date and due date (calculated from the designer's `invoice_due_days` setting).
- **From section:** Studio/designer name, address, email, phone, GSTIN (if configured).
- **Bill To section:** Client name, email, phone, project address.
- **Line items table** with HSN/SAC code column, quantity, unit price, and subtotals.
- **Tax breakdown:** If the designer has GSTIN configured, the invoice shows a proper CGST/SGST split instead of a generic "tax" line.
- **Grand total** in INR (₹).
- **Payment Details section:** Bank name, account number, IFSC, and UPI ID — taken directly from the designer's profile. The client can see exactly where to make payment.
- **Payment Schedule table:** Shows the milestone breakdown (Advance / Mid-project / Final) with amounts.

**Invoice access:**
- The client receives the invoice link via email and can access it anytime.
- The designer can view, copy the link, or share the invoice from their project management dashboard.
- The invoice page has a **"Print / Save as PDF"** button that uses the browser's native print dialog with optimized print CSS for clean output.

---

### 5.7 Designer Dashboard & Project Management

The designer's dashboard is the command center for managing all projects.

**Dashboard features:**
- **Project list** with client name, project type, creation date, and current status.
- **Search** by client name or project type.
- **Status filter** dropdown: All / Draft / Sent / Approved / Paid / Completed.
- **"Needs Attention" CRM cards** that highlight:
  - Proposals sent but not yet viewed by the client.
  - Proposals viewed but awaiting approval.
  - Approved projects with invoices pending payment.
  - Stale proposals (sent more than 3 days ago, not opened) — with a one-click "Remind on WhatsApp" button.
- **Delete project** functionality with confirmation.
- Responsive design — desktop shows a table view, mobile shows card-based layout.

**Project detail page (`/proposals/[id]`):**

Each project has a dedicated management page with:
- Full project details (client info, rooms, pricing breakdown, notes, payment terms).
- **Status dropdown** — the designer can manually update status (Draft / Sent / Approved / Paid / Completed).
- **Visual pipeline stepper** showing the project's progress through all 6 stages, including a "Viewed" indicator if the client has opened the proposal.
- **Sharing actions:** Copy link, Share on WhatsApp, Email to Client.
- **Management actions:** Edit project, Download PDF, Duplicate proposal (creates a copy as a new Draft).
- **Invoice section** (appears only after approval): View Invoice, Copy Invoice Link.
- **Payment Milestones manager:** Add, edit, delete milestones. Mark milestones as "Paid". Default presets follow the 30/40/30 pattern. When all milestones are marked paid, the project status updates to "Paid".
- **Generated PDFs history:** Every PDF version ever generated for this project is listed with its creation date and a "View PDF" link. This is the **revision history** — if the designer edits the proposal and regenerates the PDF, both the old and new versions are preserved.

---

### 5.8 Project Pipeline & Tracking

Every project in Kalvora moves through a clear, 6-stage pipeline:

```
Draft → Sent → Viewed → Approved → Paid → Completed
```

| Stage | What it means | How it's triggered |
|---|---|---|
| **Draft** | Proposal saved but not yet finalized or shared. | Designer clicks "Save as Draft". |
| **Sent** | Proposal PDF is generated and ready to share. | Designer clicks "Generate & Send" or emails the proposal. |
| **Viewed** | The client has opened the proposal link. | Automatically set when the client loads the `/view/[id]` page. |
| **Approved** | The client clicked "Approve" on the proposal. | Client action from the public proposal page. |
| **Paid** | All payment milestones are marked as paid. | Designer marks each milestone as paid from the project detail page. |
| **Completed** | The project is finished and delivered. | Designer manually updates the status. |

**Visual representation:**
- On the **homepage** (Closing Engine), logged-in designers see a **Pipeline Strip** at the top showing counts for each stage.
- On each **project detail page**, a visual pipeline stepper highlights the current stage.
- On the **dashboard table**, each project row shows its pipeline position.

---

### 5.9 The Closing Engine (Homepage for Logged-In Users)

When a designer is logged in, the homepage (`/`) transforms from the marketing landing page into an **action-driven command center** called the Closing Engine.

**What it shows:**
- **Time-of-day greeting** with the designer's name (from profile).
- **Pipeline Strip** — counts for Draft, Sent, Viewed, Approved, Paid, Completed.
- **Primary Action Strip** — a single, context-aware action card based on what needs the designer's attention most. Priority order:
  1. No profile set up → "Complete your studio profile"
  2. No projects yet → "Create your first proposal"
  3. Client viewed a proposal → "Follow up now — they've seen it"
  4. Draft needs finishing → "Finish your draft for [client]"
  5. Sent but not opened → "Follow up with [client]" + WhatsApp reminder button
  6. Approved but unpaid → "Send invoice reminder to [client]"
  7. Everything clear → "Create a new proposal"
- **"Needs Your Attention" section** — flagged projects with quick-action buttons (view, remind on WhatsApp, check invoice).
- **Proposal Activity feed** — recent 5 active projects with real-time status indicators (viewed, waiting, draft, approved, paid).
- **Wins section** — celebrates recent approvals, payments, and completions with emoji indicators (🎉, 💰, ✅).

---

### 5.10 Email Notification System

Kalvora sends automated transactional emails at key moments in the project lifecycle using Resend as the email provider.

| Trigger | Recipient | Email Subject | Content |
|---|---|---|---|
| Designer sends proposal via email | Client | 📋 New Proposal from [designer name] | "Your Proposal is Ready" with a "View Proposal →" button. |
| Client approves a proposal | Designer | 🎉 Proposal Approved by [client name] | "Proposal Approved!" with a "View in Dashboard →" button. |
| Client approves a proposal | Client | 📄 Your Invoice for [project name] | "Your Invoice is Ready" with a "View Invoice →" button. |
| Client requests changes / comments | Designer | 📝 [client name] requested changes | "Changes Requested" with the client's comment and a "View in Dashboard →" button. |

All emails are sent from `notifications@kalvora.kaliprlabs.in` and include Kalvora branding at the footer.

---

### 5.11 WhatsApp Integration

WhatsApp is the primary sharing channel for Kalvora users. The platform integrates with WhatsApp in two ways:

1. **Share Proposal:** Opens WhatsApp with a pre-composed message containing the short link: *"Hi! Here's your proposal for [project type]: [link]"*.
2. **Follow-up Reminders:** For stale proposals (sent but not viewed after 3+ days), a "Remind on WhatsApp" button opens WhatsApp with: *"Hi [client name]! Just following up on the proposal I sent. Here's the link again in case you need it: [link]"*.

Both use the `wa.me` API, which works on both mobile and desktop WhatsApp.

---

### 5.12 Public Feedback Collection

Kalvora has a public feedback page (`/public-feedback`) accessible from the website footer. Any visitor — even without an account — can submit feedback.

The feedback form captures: role/title, description of their current process, pain points, dream feature wish, and a product-market fit signal ("How disappointed would you be if Kalvora disappeared?"). All submissions are stored in the `feedback` table and viewable by admins.

Separately, a **Logout Feedback Modal** appears when logged-in designers sign out, capturing quick feedback on their experience before they leave.

---

### 5.13 Admin Dashboard (Hidden)

Kalvora includes a hidden admin dashboard at `/admin` — there are no links to it anywhere on the site. Access is restricted to specific email addresses configured in the environment.

**Admin capabilities:**
- **Overview stats:** Total registered users, total projects by status, total feedback entries by type, weekly trends.
- **User management:** View all registered users with their studio names, total proposal counts, and last active dates.
- **Feedback viewer:** Browse all feedback submissions with type filters (structured, logout trigger, public landing) and expandable detail rows.

---

### 5.14 Zero-Auth Demo ("Try Kalvora")

A `/try` page allows anyone to experience Kalvora without signing up. The visitor enters a client name, picks a preset project type (2BHK / 3BHK / Villa / Office / Kitchen / Single Room), and sets a budget. Kalvora instantly generates a mock proposal preview with 4 template options.

This serves as a **low-friction conversion funnel** — visitors can see exactly what their proposals would look like before committing to an account.

---

### 5.15 Proposal Editing & Duplication

**Editing:** Designers can return to any saved proposal (even after PDF generation) via the `/edit/[id]` page. The form is pre-filled with all existing data. After editing, they regenerate the PDF — the new version is added to the history, and the old version remains accessible.

**Duplication:** From any project detail page, designers can click "Duplicate" to create an identical copy as a new Draft. Useful for creating proposals for similar projects or the same client with minor variations.

---

## 6. User Stories & Acceptance Criteria

### Designer Stories

| ID | User Story | Acceptance Criteria |
|---|---|---|
| **US-01** | As a designer, I want to set up my studio profile once so that my branding appears on every proposal automatically. | ✅ Profile saves logo, name, colors, payment terms. ✅ New proposals auto-populate from profile. ✅ Red dot on sidebar if profile incomplete. ✅ Cancel reverts to last saved state. |
| **US-02** | As a designer, I want to create a proposal in under 2 minutes so I don't waste time formatting documents. | ✅ 8-section guided form. ✅ Quick-add room/item presets by project type. ✅ Live-calculated totals. ✅ Profile data auto-fills. |
| **US-03** | As a designer, I want to choose from multiple PDF templates so my proposals look professional and differentiated. | ✅ 6 templates available. ✅ Preview modal before selection. ✅ All templates render with designer branding and accent color. |
| **US-04** | As a designer, I want to share a proposal via WhatsApp with one tap so I can reach clients on their preferred platform. | ✅ "Share on WhatsApp" opens wa.me with pre-composed message and short link. ✅ Short links use `KV-xxxxx` format. |
| **US-05** | As a designer, I want to know when my client views the proposal so I can follow up at the right time. | ✅ `client_viewed_at` timestamp set on first view. ✅ "Viewed" badge appears on dashboard. ✅ Closing Engine highlights viewed proposals. |
| **US-06** | As a designer, I want an invoice to be auto-generated when the client approves so I don't have to create one manually. | ✅ Approval triggers invoice page availability. ✅ Payment milestones auto-created (30/40/30). ✅ Designer receives approval email. ✅ Client receives invoice link email. |
| **US-07** | As a designer, I want to track every project through a clear pipeline so I know exactly where each deal stands. | ✅ 6-stage pipeline: Draft → Sent → Viewed → Approved → Paid → Completed. ✅ Visual stepper on project page. ✅ Pipeline strip on homepage. |
| **US-08** | As a designer, I want to mark payment milestones as paid so I can track which clients have completed their payments. | ✅ Add/edit/delete milestones from project detail. ✅ Mark as "Paid" with one click. ✅ Project auto-transitions to "Paid" when all milestones complete. |
| **US-09** | As a designer, I want to see all previously generated PDF versions so I can reference or compare revisions. | ✅ All generated PDFs listed with date on project detail page. ✅ Each has a "View PDF" link. ✅ Regenerating adds a new entry, old ones remain. |
| **US-10** | As a designer, I want to duplicate a proposal so I can quickly create similar proposals for new clients. | ✅ "Duplicate" creates a new Draft with all data copied. ✅ Client name appended with "(Copy)". ✅ Redirects to edit page. |
| **US-11** | As a designer, I want follow-up reminders for stale proposals so no deal falls through the cracks. | ✅ Proposals unseen for 3+ days flagged in "Needs Attention". ✅ One-click "Remind on WhatsApp" with pre-filled message. |

### Client Stories

| ID | User Story | Acceptance Criteria |
|---|---|---|
| **US-12** | As a client, I want to view a proposal from a shared link without needing to create an account. | ✅ `/view/[id]` page loads without authentication. ✅ Shows full proposal: rooms, pricing, designer contact. ✅ Draft proposals are NOT accessible. |
| **US-13** | As a client, I want to approve a proposal with one click so I can move forward without phone calls. | ✅ Sticky "Approve" button on public view. ✅ Confirmation modal before finalizing. ✅ Status updates to "Approved". ✅ Redirects to invoice. |
| **US-14** | As a client, I want to leave comments on a proposal so I can request changes without calling the designer. | ✅ Discussion section on public view. ✅ Comment saved and visible to both parties. ✅ Designer notified via email with comment content. |
| **US-15** | As a client, I want to receive my invoice via email after approving so I know exactly what to pay. | ✅ Email sent with invoice link within seconds of approval. ✅ Invoice shows payment details (bank, UPI) and milestone schedule. |
| **US-16** | As a client, I want to download the proposal as a PDF so I can review it offline or share it with family. | ✅ "Download PDF" button on public view page. ✅ PDF is studio-branded with all project details. |

### Admin Stories

| ID | User Story | Acceptance Criteria |
|---|---|---|
| **US-17** | As an admin, I want to see platform-wide metrics so I can monitor adoption and growth. | ✅ Admin dashboard shows total users, projects by status, feedback by type, weekly trends. ✅ Access restricted to configured email addresses. |
| **US-18** | As an admin, I want to read all user feedback so I can prioritize product improvements. | ✅ Feedback viewer with type filters. ✅ Expandable detail rows. ✅ Covers structured, logout, and public feedback types. |

---

## 7. Data & Privacy Architecture

### How Data is Separated

Every designer sees only their own data. Kalvora uses **Row-Level Security (RLS)** at the database level — even if someone guessed a database URL, they could only access their own rows.

### Public Access

Proposals and invoices that have been sent to clients are accessible without login via their short links. This is intentional — the client should not need a Kalvora account to view, comment on, or approve a proposal. Public access is restricted to proposals with status `Sent`, `Approved`, `Paid`, or `Completed` — Draft proposals are never publicly accessible.

### Invoice Data Access

Invoice pages use a **server-side API route** with elevated permissions to fetch data. This ensures the invoice always renders correctly for the client, regardless of browser-level security policies.

---

## 8. Technical Architecture

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React, TypeScript |
| **Styling** | TailwindCSS with custom design tokens, glassmorphism UI |
| **Backend** | Next.js API Routes (serverless) |
| **Database** | PostgreSQL via Supabase |
| **Authentication** | Supabase Auth (email/password, magic links, password reset) |
| **File Storage** | Supabase Storage (generated PDFs) |
| **PDF Rendering** | Browserless.io REST API (cloud headless Chrome) |
| **Email** | Resend (transactional emails) |
| **Hosting** | Vercel (frontend + API routes) |

**Key database tables:**

| Table | Purpose |
|---|---|
| `designer_profiles` | One row per user — all studio/branding/tax/bank info. |
| `projects` | One row per proposal — client details, status, designer info snapshot, accent color, tax rate. |
| `rooms` | Room entries linked to a project. |
| `line_items` | Pricing line items linked to a project. |
| `proposals` | Generated PDF records (URL + timestamp) linked to a project. Stores revision history. |
| `comments` | Discussion thread entries (Client or Designer) linked to a project. |
| `payment_milestones` | Payment schedule entries (label, amount, paid status) linked to a project. |
| `short_codes` | Short URL codes (`KV-xxxxx`) mapped to project IDs and link types. |
| `feedback` | User feedback submissions (structured, logout modal, public landing). |

**Storage buckets:** `proposals` (generated PDFs) and `logos` (studio logos).

---

## 9. UX Requirements

### Design Language
- **Dark theme** (`#0a0a0f` base) with glassmorphism cards (`glass-card` class: semi-transparent backgrounds, subtle borders, backdrop blur).
- **Brand color:** Custom indigo palette (`brand-400` through `brand-700`) used for CTAs, accents, and highlights.
- **Typography:** System font stack with tight tracking, bold headings, muted secondary text (`#5a5a70`, `#8888a0`).
- **Animations:** Fade-in on page load (`animate-fade-in`), float animation on hero elements (`animate-float`), smooth hover transitions on all interactive elements.

### Responsive Behavior
| Viewport | Layout |
|---|---|
| **Desktop** (≥768px) | Full sidebar navigation, table-based project list, side-by-side form fields. |
| **Mobile** (<768px) | Sidebar collapses to hamburger menu, project list switches to card layout, pipeline stepper compresses, full-width forms. |

### Key UX Principles
- **Zero-friction sharing:** Sharing a proposal should take exactly one tap (WhatsApp) or two clicks (copy link).
- **Client doesn't need Kalvora:** The client experience is entirely public-link-based. No account, no login, no app download.
- **Context-aware homepage:** The Closing Engine shows exactly one primary action — the most impactful thing the designer should do right now.
- **Celebrate wins:** Approvals, payments, and completions are celebrated with emoji indicators and dedicated "Wins" section.
- **Progressive disclosure:** Profile page defaults to read-only. Edit mode requires explicit action. Prevents accidental changes.
- **Input validation is inline:** Errors appear immediately below fields in red, not in alert boxes. Validation blocks save, not submit.

### Accessibility
- All interactive elements have `title` or `aria-label` attributes.
- Color is never the sole indicator — status badges include text labels alongside color coding.
- Print CSS optimizes invoice pages for paper output (hides navigation, expands content, removes dark theme).

---

## 10. Business Model

Kalvora is currently in **Early Access** — all features are free with no credit card required.

**Planned pricing:**
- **Free tier:** Expected to remain with limited features or proposal count.
- **Pro tier:** ₹999/month. Early access users who sign up now are promised **50% off forever** when Pro launches.

Revenue will be generated through SaaS subscriptions. There are currently no transaction fees, marketplace commissions, or advertising.

---

## 11. Risks & Mitigations

| Risk | Severity | Likelihood | Mitigation |
|---|---|---|---|
| **Browserless.io downtime** → PDFs can't be generated | High | Low | API has 99.9% uptime SLA. Fallback: user can retry. Future: self-hosted Chromium container. |
| **Resend email deliverability** → approval/invoice emails not received | High | Low | Resend handles SPF/DKIM. Fallback: designer can manually share invoice link from dashboard. |
| **Supabase RLS misconfiguration** → data leak between users | Critical | Low | RLS policies are tested per-table. All public routes use `service_role` only for read-only cross-user data (invoices). Draft proposals never exposed publicly. |
| **Client accidentally approves** → no undo for approval | Medium | Medium | Confirmation modal with clear description before approval. Designer can manually revert status from their dashboard. |
| **Single-currency (INR) limits global adoption** | Medium | High | Intentional — India is the target market. Multi-currency is on the P3 roadmap. |
| **No real-time updates** → designer must refresh to see new views/approvals | Low | High | Current behavior is acceptable for MVP. Push notifications planned for P3. |
| **Free tier abuse** → unlimited proposals on early access | Medium | Medium | No current rate limiting. Will be addressed when Stripe billing is implemented (P0 roadmap). |
| **WhatsApp `wa.me` links may not work on all desktop browsers** | Low | Low | `wa.me` is the official WhatsApp API. Works on mobile universally. Desktop fallback is WhatsApp Web. |

---

## 12. Current Limitations

| Limitation | Detail |
|---|---|
| **No online payment collection** | Kalvora tracks payment milestones manually, but does not process payments. Designers share bank/UPI details; clients pay outside the platform. |
| **Single-user accounts** | Each account belongs to one designer. There is no team/studio mode where multiple designers share access. |
| **Currency locked to INR** | All amounts are in Indian Rupees (₹). There is no multi-currency support. |
| **No client login/portal** | Clients interact via public links only. There is no dedicated client dashboard where they can see all their proposals. |
| **PDF regeneration replaces UI link** | While old PDFs are preserved in history, the "Download PDF" button on the public view page shows only the latest version. |
| **Invoice status indicators temporarily hidden** | The "Paid/Unpaid" badges on the invoice page are implemented but currently commented out in the code to avoid client confusion until the full payment lifecycle is enabled. |
| **No real-time notifications** | View tracking and approval updates are visible on page refresh, not via push notifications or WebSocket. |
| **SocialProof section hidden** | The testimonial/review cards on the landing page are built but currently commented out. |

---

## 13. Product Roadmap

Based on the current product direction and identified gaps:

| Priority | Feature | Description |
|---|---|---|
| **P0** | Stripe Subscription & Billing | Monetize with Free / Pro / Business tiers. Enable online payment for subscriptions. |
| **P1** | Full Payment Integration | Allow clients to pay invoices directly through the platform (Razorpay / Stripe). |
| **P1** | Client Portal | Dedicated login for clients to view all their proposals, invoices, and payment history. |
| **P2** | Revision History UI | Visual diff view of old vs. new proposals. Allow designers to compare and roll back. |
| **P2** | Team / Studio Accounts | Multiple designers under one studio account with role-based access. |
| **P3** | Multi-Currency Support | Allow designers to select currency per proposal (USD, AED, GBP, etc.). |
| **P3** | AI-Powered Scope Generator | Paste a client brief → AI auto-fills rooms, services, and line items. |
| **P3** | Push Notifications | Real-time alerts when a client views, comments, or approves. |

---

## 14. KPIs & Success Metrics

These are the core metrics that indicate product health and growth:

| Metric | What it measures |
|---|---|
| **Proposals Created** (total & weekly) | Product adoption and engagement. |
| **Proposals Sent** (vs. drafted) | Conversion from creation to actual client sharing. |
| **View Rate** | % of sent proposals that clients actually opened. |
| **Approval Rate** | % of viewed proposals that resulted in client approval. |
| **Time to View** | How quickly clients open proposals after sharing. |
| **Time to Approve** | How quickly clients approve after viewing. |
| **Active Designers** (weekly) | Designers who created or managed at least one proposal in the past 7 days. |
| **Profile Completion Rate** | % of registered designers who completed their studio profile. |
| **Payment Milestone Completion** | % of approved projects where all milestones are marked paid. |

---

## 15. Competitive Positioning

Kalvora occupies a unique position: **purpose-built for Indian interior designers.** Existing alternatives fall into two categories:

| Alternative | Why Kalvora wins |
|---|---|
| **Generic tools** (Word, Excel, Canva) | No tracking, no sharing links, no approvals, no automation, no invoicing. Everything is manual. |
| **Global SaaS** (Proposify, PandaDoc, HoneyBook) | Expensive (USD pricing), no GST/INR support, not designed for the interior design workflow, overkill for the target segment. |
| **Accounting tools** (Zoho Invoice, Tally) | Handle invoicing but not proposals, not client tracking, not designed for the pre-approval workflow. |

Kalvora's moat is **vertical specificity**: room-based pricing, project-type presets (Residential/Commercial/Office/Retail), interior design terminology, GST-native invoicing, WhatsApp-first sharing, and a UI designed for the aesthetic sensibility of designers.

---

## 16. Questions This PRD Answers

This document is designed to serve as the single reference for anyone working on or evaluating Kalvora:

**Product & Strategy:**
- What does Kalvora do, and what specific problem does it solve?
- Who are the target users, and why is this built for India?
- How does Kalvora compare to alternatives in the market?
- What is the business model and pricing strategy?

**User Experience:**
- Who are the primary personas, and what are their pain points?
- What can designers do? What can clients do without logging in?
- What are the UX principles and design language?
- How does the responsive layout work on mobile vs. desktop?

**Features & Behavior:**
- What is the complete feature set — from profile setup to payment tracking?
- How are proposals created, shared, and tracked?
- What happens when a client views, comments, or approves?
- How are invoices auto-generated? What do they include?
- What is the 6-stage pipeline, and how does each stage trigger?
- How do email notifications and WhatsApp integrations work?
- Can proposals be edited? Is there revision history?
- How do payment milestones work?
- What tax compliance features exist (GST, CGST/SGST, HSN/SAC)?

**Engineering & Architecture:**
- What technology stack is Kalvora built on?
- How is data secured and separated between users?
- What are the 9 database tables and their relationships?

**Validation & Quality:**
- What are the user stories and their acceptance criteria?
- What are the known risks and their mitigations?
- What are the current limitations and known gaps?
- What KPIs should be tracked to measure success?

**Roadmap:**
- What features are planned and how are they prioritized?
- What is the path from Early Access to monetization?

---

> **Document changelog:**
> | Version | Date | Change |
> |---|---|---|
> | 1.0 | 2026-04-27 | Initial stakeholder document created. |
> | 2.0 | 2026-04-27 | Upgraded to full PRD format: added user personas, user stories with acceptance criteria, UX requirements, risks & mitigations. Renumbered all sections. |
