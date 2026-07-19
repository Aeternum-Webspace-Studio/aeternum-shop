# Agent Guide

Dokumen ini menjadi instruksi kerja untuk agent atau developer yang mengerjakan project marketplace produk digital ini.

## 01. Prinsip Produk

- Ini marketplace produk digital, bukan ecommerce barang fisik.
- Fokus utama adalah order, payment, dan delivery data digital.
- Jangan membuat fitur lanjutan sebelum MVP selesai.
- Solusi paling sederhana yang aman lebih baik daripada arsitektur besar.

## 02. Stack Target

- Next.js.
- Neon Postgres.
- Drizzle ORM.
- Tailwind CSS.
- Pakasir payment.
- Resend email.
- Vercel deployment.

Jangan menambah dependency baru jika fitur bisa dibuat dengan platform atau dependency yang sudah ada.

## 02A. Frontend Direction

- Ikuti `docs/DESIGN.md`.
- Tema utama adalah light premium digital marketplace.
- `appverse.id` hanya referensi UX/struktur, bukan clone visual.
- Hindari glassmorphism, dark-first theme, dan template SaaS generik.
- UI harus compact, clean, dan commerce-first.

## 03. Route Utama

Public:

```txt
/
/marketplace
/products/[slug]
/blog
/blog/[slug]
/login
/register
```

User:

```txt
/dashboard
/dashboard/orders
/dashboard/orders/[id]
/dashboard/payments
/dashboard/tickets
/dashboard/profile
/dashboard/reseller
```

Seller:

```txt
/seller
/seller/products
/seller/products/new
/seller/orders
/seller/orders/[id]
/seller/stocks
/seller/tickets
```

Admin:

```txt
/admin
/admin/users
/admin/sellers
/admin/products
/admin/orders
/admin/payments
/admin/tickets
/admin/blog
/admin/packages
```

API:

```txt
/api/checkout
/api/webhooks/pakasir
```

## 04. Role Rules

- Buyer hanya boleh melihat order miliknya.
- Seller hanya boleh melihat produk, order, stok, dan ticket miliknya.
- Admin boleh melihat semua.
- Role check harus dilakukan di server.
- UI hiding tidak cukup untuk keamanan.

## 05. Payment Rules

- Pakasir adalah payment provider MVP.
- Order dibuat sebelum redirect payment.
- Payment callback harus idempotent.
- Callback dobel tidak boleh mengirim stok dobel.
- Amount dari callback harus sama dengan order total.
- Simpan raw callback ke `payment_events`.

## 06. Delivery Rules

Auto delivery:

- Hanya untuk produk `fulfillment_type = auto`.
- Hanya berjalan setelah payment paid.
- Ambil satu stok `available`.
- Tandai stok `sold`.
- Simpan data ke `order_items.delivery_content`.

Manual delivery:

- Hanya seller pemilik produk atau admin yang boleh input.
- Setelah input, status item menjadi `delivered`.
- Buyer mendapat email.

## 07. Data Sensitif

- `product_stocks.content` sensitif.
- `order_items.delivery_content` sensitif.
- Jangan log password akun digital.
- Jangan expose delivery data di list endpoint.
- Tampilkan delivery data hanya di detail order yang authorized.

## 08. MVP Boundary

Kerjakan dulu:

- Auth.
- User dashboard.
- Seller dashboard.
- Admin dashboard.
- Product CRUD.
- Checkout Pakasir.
- Webhook Pakasir.
- Auto/manual delivery.
- Email notif.
- Rating.
- Ticket.
- Blog sederhana.

Tunda dulu:

- Wallet seller.
- Withdraw otomatis.
- Affiliate.
- Live chat realtime.
- AI chatbot penuh.
- Multi payment gateway.
- Mobile app.

## 09. Testing Rules

Minimal test/check wajib untuk logic non-trivial:

- Checkout membuat order pending.
- Webhook paid mengubah order.
- Auto delivery mengurangi stok satu kali.
- Webhook dobel tidak double-deliver.
- Seller tidak bisa akses order seller lain.
- Buyer tidak bisa akses order buyer lain.

## 10. Dokumentasi Terkait

- `docs/PRD.md`: requirement produk lengkap.
- `docs/ROADMAP.md`: urutan implementasi.
- `docs/DATABASE.md`: schema awal.

ponytail: dokumen ini sengaja singkat agar agent tidak membuat fitur spekulatif.
