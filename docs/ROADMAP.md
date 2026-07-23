# Roadmap Implementasi 01 Sampai Akhir

## 01. Setup Project

Deliverable:

- Next.js app.
- Tailwind CSS.
- Drizzle ORM.
- Neon database.
- Vercel deployment awal.
- Environment variable dasar.
- Design token awal sesuai `docs/DESIGN.md`.

Checklist:

- Buat repo GitHub.
- Buat project Next.js.
- Buat Neon database.
- Set `DATABASE_URL`.
- Deploy preview ke Vercel.

## 01A. Design Foundation

Deliverable:

- Terapkan palet light premium.
- Setup font Geist atau Inter.
- Setup komponen dasar: button, card, badge, table, input.
- Buat layout public dan dashboard.
- Hindari glassmorphism dan dark-first theme.

## 02. Auth Dan Session

Deliverable:

- Register.
- Login.
- Logout.
- Session server-side.
- Role user/seller/admin.
- Middleware proteksi route.

Route:

```txt
/login
/register
/dashboard
/seller
/admin
```

## 03. Database Core

Deliverable:

- Migration tabel core.
- Seed admin pertama.
- Relasi user, seller, produk, order, payment.

Minimal tabel ada di `docs/DATABASE.md`.

## 04. Landing Page Dan Marketplace

Deliverable:

- Landing page.
- Listing produk.
- Search sederhana.
- Filter kategori.
- Detail produk.
- Display harga normal/reseller.

Route:

```txt
/
/marketplace
/products/[slug]
```

## 05. Dashboard User

Deliverable:

- Ringkasan akun.
- Riwayat order.
- Detail order.
- Data digital setelah paid/delivered.
- Riwayat payment.
- Ticket user.
- Profile.
- Pengajuan reseller.

Route:

```txt
/dashboard
/dashboard/orders
/dashboard/orders/[id]
/dashboard/payments
/dashboard/tickets
/dashboard/profile
/dashboard/reseller
```

## 06. Dashboard Seller

Deliverable:

- CRUD produk.
- Upload stok digital.
- Order masuk.
- Manual delivery.
- Review produk.
- Ticket terkait produk seller.

Route:

```txt
/seller
/seller/products
/seller/products/new
/seller/orders
/seller/orders/[id]
/seller/stocks
/seller/tickets
```

## 07. Checkout Pakasir

Deliverable:

- Create order.
- Create payment.
- Generate payment URL Pakasir.
- Redirect buyer ke payment.
- Halaman instruksi pembayaran.

Route/API:

```txt
/checkout/[productId]
/orders/[id]/pay
/api/checkout
```

## 08. Webhook Payment

Deliverable:

- Endpoint callback Pakasir.
- Validasi order reference.
- Validasi amount.
- Idempotent processing.
- Simpan callback log.

Route/API:

```txt
/api/webhooks/pakasir
```

## 09. Auto Dan Manual Delivery

Deliverable:

- Auto ambil stok available.
- Tandai stok sold.
- Simpan delivery data.
- Manual delivery form untuk seller.
- Status order berubah benar.

Rule:

- Auto delivery hanya berjalan setelah payment paid.
- Manual delivery hanya bisa dilakukan seller pemilik produk atau admin.

## 10. Email Notification

Deliverable:

- Integrasi Resend.
- Template email minimal.
- Email payment sukses.
- Email order delivered.
- Email seller perlu proses manual order.
- Email ticket reply.

## 11. Rating Dan Komentar

Deliverable:

- Buyer bisa rating setelah order delivered.
- Produk menampilkan average rating.
- Admin bisa hide review.

## 12. Ticket Support

Deliverable:

- Buat ticket.
- Balas ticket.
- Status ticket open/closed.
- Ticket dari order.
- Admin semua ticket.
- Seller ticket terkait produknya.

## 13. Admin Dashboard

Deliverable:

- Kelola user.
- Kelola seller.
- Approve seller.
- Approve reseller.
- Kelola produk.
- Kelola order.
- Kelola payment log.
- Kelola ticket.

## 14. Blog

Deliverable:

- Blog list.
- Blog detail.
- Admin CRUD post.
- Slug SEO.

Route:

```txt
/blog
/blog/[slug]
/admin/blog
```

## 15. Paket Custom

Deliverable:

- Admin bisa membuat produk custom.
- Produk custom bisa dibeli seperti produk biasa.
- Flag `is_custom_package`.

## 16. FAQ Chatbot

Deliverable:

- Widget FAQ sederhana.
- Jawaban statis dari daftar admin.
- CTA buka ticket.

AI chatbot penuh ditunda.

## 17. Hardening

Deliverable:

- Role check server-side.
- Proteksi seller data.
- Proteksi delivery data.
- Webhook idempotency.
- Basic rate limit untuk auth dan webhook jika mudah.
- Error page dasar.

## 18. Testing Minimal

Test wajib:

- Register/login.
- Checkout order.
- Webhook paid.
- Auto delivery stok berkurang.
- Webhook dobel tidak mengirim stok dobel.
- Seller tidak bisa akses order seller lain.
- Buyer tidak bisa akses order buyer lain.
- Admin bisa akses semua.

## 19. Production Deployment

Checklist:

- Set environment variables di Vercel.
- Jalankan migration production.
- Buat admin pertama.
- Test payment real kecil.
- Test webhook production.
- Test email production.
- Pasang custom domain.
- Aktifkan logging Vercel.

## 20. Setelah MVP

Prioritas lanjutan:

1. Seller wallet summary selesai; withdrawal manual masih perlu flow final: GitHub issue #5.
2. Komisi marketplace dasar selesai via kalkulasi gross/fee/net tanpa migrasi; env `MARKETPLACE_COMMISSION_BPS` bisa dipakai kalau rate berubah: GitHub issue #6.
3. Ticket live thread selesai dengan polling pendek; realtime provider penuh tetap non-MVP jika traffic membesar: GitHub issue #7.
4. AI chatbot knowledge base: GitHub issue #8.
5. Multi payment gateway: GitHub issue #9.
6. Affiliate/referral: GitHub issue #10.

Semua item non-MVP dilacak di milestone GitHub `Post-MVP`.

ponytail: fitur lanjutan ditunda sampai transaksi nyata membuktikan kebutuhan.

## Status Saat Ini

Sudah selesai:

- Auth, role gate, dan route public/account/dashboard/admin/seller.
- Marketplace, detail produk, search, dan filter kategori.
- Checkout Pakasir, webhook idempotent, auto/manual delivery.
- Dashboard buyer, seller, admin.
- Rating, ticket, blog, FAQ/chatbot, invoice tracker.
- Seller onboarding, seller settings, admin settings.
- Admin payment logs, seller stock management, buyer payments.
- Backend checks dan smoke check production.

Masih non-MVP:

- Wallet seller.
- Withdraw otomatis.
- Komisi marketplace.
- Live chat realtime.
- AI chatbot penuh.
- Multi payment gateway.
- Affiliate/referral.
