# Aeternum Shop

Marketplace produk digital untuk akun AI, streaming, software, lisensi, voucher, template, dan produk digital lain. Aplikasi ini mendukung buyer, seller, reseller, dan admin dengan payment Pakasir, delivery otomatis/manual, ticket support, rating, dan dashboard multi-role.

## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=0F172A)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle_ORM-Postgres-C5F74F?style=for-the-badge&logo=drizzle&logoColor=0F172A)
![Neon](https://img.shields.io/badge/Neon-Postgres-00E599?style=for-the-badge&logo=postgresql&logoColor=0F172A)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?style=for-the-badge&logo=vercel&logoColor=white)
![Pakasir](https://img.shields.io/badge/Pakasir-Payment-4F46E5?style=for-the-badge)

## Product Scope

- Landing page dan marketplace produk digital.
- Dashboard buyer/user.
- Dashboard seller.
- Dashboard admin.
- Produk digital dengan auto delivery dan manual delivery.
- Harga normal dan harga khusus reseller.
- Payment via Pakasir.
- Email notification via provider seperti Resend.
- Rating, komentar, ticket support, blog, dan FAQ chatbot sederhana.

## Design Direction

Tema frontend memakai gaya **light premium digital marketplace**.

- Referensi UX: `appverse.id`.
- Identitas visual: clean, solid, editorial, compact, commerce-first.
- Hindari: glassmorphism, dark-first, template SaaS generik, dan clone visual.

Detail desain ada di [`docs/DESIGN.md`](docs/DESIGN.md).

## Current Foundation

Yang sudah tersedia:

- Next.js App Router.
- Tailwind theme tokens.
- Halaman skeleton: landing, marketplace, product detail, dashboard user, seller, admin.
- Auth custom berbasis signed cookie.
- Route API register, login, logout.
- Route protection memakai `proxy.ts`.
- Drizzle schema awal untuk core database.
- Dokumentasi PRD, roadmap, database, design, dan agent guide.

## Documentation

- [`docs/PRD.md`](docs/PRD.md): product requirement lengkap.
- [`docs/ROADMAP.md`](docs/ROADMAP.md): roadmap implementasi 01 sampai deployment.
- [`docs/DATABASE.md`](docs/DATABASE.md): rancangan schema Neon Postgres.
- [`docs/DESIGN.md`](docs/DESIGN.md): arah UI/UX frontend.
- [`docs/AGENTS.md`](docs/AGENTS.md): panduan kerja agent/developer.

## Getting Started

Install dependencies:

```bash
npm install
```

Copy environment variables:

```bash
cp .env.example .env
```

Required env:

```env
DATABASE_URL=
AUTH_SECRET=
NEXT_PUBLIC_APP_URL=
PAKASIR_PROJECT_SLUG=
PAKASIR_API_KEY=
```

Run development server:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

## Main Routes

Public:

```txt
/
/marketplace
/products/[slug]
/login
/register
```

Dashboard:

```txt
/dashboard
/seller
/admin
```

Auth API:

```txt
/api/auth/register
/api/auth/login
/api/auth/logout
```

## MVP Roadmap

1. Setup project, design tokens, dan layout dasar.
2. Auth, session, role protection.
3. Neon + Drizzle migration.
4. Product CRUD.
5. Marketplace dan product detail dinamis.
6. Checkout Pakasir.
7. Payment webhook idempotent.
8. Auto/manual delivery.
9. Email notification.
10. Rating, review, ticket, blog.
11. Admin hardening dan deployment production.

## Deployment Target

- Frontend/backend: Vercel.
- Database: Neon Postgres.
- Payment: Pakasir.
- Email: Resend atau provider sejenis.

## Notes

Project folder lokal saat ini masih bernama `aeterra-shop` karena folder sedang terkunci saat rename. Identitas project dan package sudah memakai `Aeternum Shop` / `aeternum-shop`.
