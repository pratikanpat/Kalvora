<div align="center">

# K A L V O R A

### ✦ Professional Proposal Generator for Interior Designers ✦

[![Built with Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

*Create stunning, branded PDF proposals in seconds — not hours.*

---

</div>

## 🎯 What is Kalvora?

**Kalvora** is a sleek, modern web application built for **interior design professionals** who want to create beautiful, client-ready proposals without the hassle of manual formatting. Enter your project details, pick a template, and generate a polished PDF — ready to share.

> **Crafted with obsession by [Kalipr Labs](https://github.com/pratikanpat)**

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 **One-Click PDF Generation** | Generate professional, branded proposals instantly using Puppeteer |
| 🎨 **3 Premium Templates** | Choose from **Minimal**, **Luxury**, or **Modern** design styles |
| 🏷️ **Smart File Naming** | PDFs auto-named as `clientname_proposal_1.pdf`, `clientname_proposal_2.pdf`, etc. |
| 🖼️ **Logo Upload** | Upload your company logo (PNG, JPG, SVG) — embedded directly into the PDF |
| 🎨 **Custom Accent Colors** | Match proposals to your brand identity with a color picker |
| 📊 **Pricing Table** | Line items, quantities, unit prices, subtotals, tax, and grand total |
| 🏠 **Room Management** | Add rooms with square footage for detailed project breakdowns |
| 🔗 **Shareable Links** | Generate public links to share proposals with clients |
| 💾 **Draft Support** | Save projects as drafts and come back to edit later |
| 📱 **Fully Responsive** | Works beautifully on desktop, tablet, and mobile |

---

## 🛠️ Tech Stack

```
Frontend       → Next.js 15 (App Router) + React 19 + TypeScript
Styling        → Tailwind CSS + Custom design system
Backend        → Next.js API Routes + Supabase (PostgreSQL)
PDF Engine     → Puppeteer + @sparticuz/chromium (serverless-ready)
Storage        → Supabase Storage (for PDFs and assets)
Authentication → Supabase (extensible)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **Google Chrome** installed locally (for PDF generation)
- A **Supabase** project ([create one free](https://supabase.com))

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

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Set up the database

Run the migration SQL in your Supabase SQL Editor:

```bash
# Copy the contents of supabase/migration.sql
# and execute it in your Supabase Dashboard → SQL Editor
```

### 5. Create a storage bucket

In your Supabase Dashboard:
1. Go to **Storage** → **New Bucket**
2. Create a bucket named `proposals`
3. Set it to **Public**

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start creating proposals! 🎉

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/generate-pdf/    # PDF generation API endpoint
│   ├── create/              # New proposal creation page
│   ├── dashboard/           # Main dashboard with project list
│   ├── edit/[id]/           # Edit existing proposal
│   ├── proposals/[id]/      # Detailed proposal view
│   ├── view/[id]/           # Public shareable proposal view
│   ├── layout.tsx           # Root layout with metadata
│   └── globals.css          # Global styles & design tokens
├── components/
│   ├── DashboardLayout.tsx  # Main layout wrapper with footer
│   ├── Sidebar.tsx          # Navigation sidebar
│   ├── SuccessModal.tsx     # PDF generation success modal
│   ├── StatusBadge.tsx      # Project status indicator
│   └── LoadingSpinner.tsx   # Loading state component
└── lib/
    ├── supabase.ts          # Supabase client configuration
    └── templates.ts         # PDF HTML templates (Minimal, Luxury, Modern)
```

---

## 🎨 PDF Templates

<table>
<tr>
<td align="center"><strong>Minimal</strong><br/>Clean whites, Inter font, elegant simplicity</td>
<td align="center"><strong>Luxury</strong><br/>Gold & dark, serif typography, premium feel</td>
<td align="center"><strong>Modern</strong><br/>Bold geometry, sharp type, corporate grade</td>
</tr>
</table>

---

## 📜 License

This project is proprietary software owned by **Kalipr Labs**.

---

<div align="center">

**K A L V O R A** · A product of **Kalipr Labs**

Designed for interior design professionals.

`Version 1.0.0`

</div>
