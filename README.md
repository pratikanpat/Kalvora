<div align="center">

# K A L V O R A (ProposalFlow)

### ✦ Professional Proposal & Invoice Generator for Interior Designers ✦

[![Built with Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

*Stop sending proposals on WhatsApp like it's 2012. Create stunning, branded PDF proposals in seconds, track views, and get paid faster.*

---

</div>

## 🎯 What is Kalvora?

**Kalvora** (internal package name: `proposalflow`) is a web tool built for interior designers and small interior design studios to quickly create structured, professional quotation proposals, generate branded PDF documents, and share them directly with clients via smart links. It transforms a messy, manual workflow into a streamlined, high-conversion "Closing Engine".

> **Crafted with obsession by [Kalipr Labs](https://github.com/pratikanpat)**

---

## ✨ Core Features

| Feature | Description |
|---|---|
| 🎨 **6 Premium Templates** | Choose from **Minimal, Luxury, Modern, Blueprint, Editorial**, or **High Contrast** designs. |
| 📄 **Instant PDF Generation** | Professional, branded proposals generated instantly via Browserless API. |
| 🔗 **Smart Short Links** | Share proposals via `kalvora.kaliprlabs.in/p/KV-xxxxx` short codes. |
| 👁️ **Track Client Views** | Know exactly when your client opens the proposal magic link. |
| ✅ **Client Approvals & Comments** | Clients can approve proposals and leave feedback in a persistent discussion thread. |
| 💰 **Payment Milestones** | Create and track advance, mid-project, and final payment milestones. |
| 🧾 **Auto-Invoicing** | Generate itemized invoices with GST/tax breakdown and UPI payment details automatically upon approval. |
| 📧 **Automated Emails** | Integrated with Resend for proposal delivery and action notifications. |
| 🏢 **Studio Profiles** | Save your logo, brand colors, bank details, and GSTIN for one-click application to all documents. |
| 📱 **Mobile-Optimized** | Fully responsive workflow from desktop creation to mobile viewing. |

---

## 🛠️ Tech Stack

```text
Frontend       → Next.js 14 (App Router) + React 18 + TypeScript
Styling        → TailwindCSS 3 + Custom design system (Glassmorphism & micro-animations)
Database       → Supabase (PostgreSQL)
Authentication → Supabase Auth (Email/Password + Google OAuth)
PDF Engine     → Browserless.io REST API (Serverless HTML-to-PDF)
Email          → Resend (Transactional emails)
Storage        → Supabase Storage (Logos & Proposals buckets)
Icons/UI       → Lucide React, react-hot-toast
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- A **Supabase** project ([create one free](https://supabase.com))
- A **Browserless.io** API token (for PDF generation)
- A **Resend** API key (for emails)

### 1. Clone the repo

```bash
git clone https://github.com/pratikanpat/Kalvora.git
cd Kalvora
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.local.example` (or create a `.env.local` file) and fill in your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

BROWSERLESS_API_TOKEN=your-browserless-api-key
RESEND_API_KEY=your-resend-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: For Admin Dashboard access
NEXT_PUBLIC_ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

### 4. Set up the database

Execute the SQL migrations found in the `/supabase` folder in your Supabase Dashboard → SQL Editor in the following order:

1. `migration.sql` (Base schema)
2. `auth_migration.sql` (User ties & RLS)
3. `profile_migration.sql` (Designer profiles)
4. `feedback_migration.sql` (Feedback tracking)
5. `approval_migration.sql` (Client views & comments)
6. `invoice_profile_migration.sql` (Tax & bank details)
7. `cascade_delete_migration.sql` (Cleanup rules)
8. `payment_milestones_migration.sql` (Milestones tracking)
9. `short_links_migration.sql` (KV- codes and public sharing)

### 5. Create storage buckets

In your Supabase Dashboard → **Storage**, create two **Public** buckets:
- `logos` (for designer branding)
- `proposals` (for generated PDFs)

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in to access your dashboard!

---

## 📁 Project Structure Highlights

- `/src/app/api/generate-pdf`: Browserless API integration for converting HTML templates to PDFs.
- `/src/app/page.tsx`: Auth-aware dynamic landing page (Sales Machine for visitors, Closing Engine for logged-in users).
- `/src/app/create`: Multi-section proposal builder form.
- `/src/app/view/[id]`: Frictionless public proposal viewer for clients.
- `/src/app/invoice/[id]`: Auto-generated public invoice page with payment tracking.
- `/src/lib/templates.ts`: All 6 standalone HTML/CSS templates for PDF generation.
- `/supabase`: Contains all SQL migrations for setting up tables and RLS policies.

---

## 📜 License

This project is proprietary software owned by **Kalipr Labs**.

---

<div align="center">

**K A L V O R A** · A product of **Kalipr Labs**

Designed for interior design professionals.

`Version 12.0.0`

</div>
