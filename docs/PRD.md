# PRD Marketplace Produk Digital

## 01. Ringkasan

Produk ini adalah marketplace jual beli produk digital seperti akun AI, Netflix, CapCut, lisensi, voucher, template, dan produk digital lain. Platform mendukung buyer, seller, reseller, dan admin utama.

Fokus versi awal adalah transaksi aman, dashboard jelas, pembayaran Pakasir, dan pengiriman produk digital otomatis atau manual.

## 02. Tujuan

- Membuat marketplace produk digital yang bisa dipakai buyer untuk membeli produk dengan cepat.
- Memberi seller dashboard untuk mengelola produk, stok, order, dan delivery.
- Memberi admin kontrol penuh atas user, seller, produk, transaksi, ticket, blog, dan paket custom.
- Menggunakan stack murah/gratis untuk tahap awal.

## 03. Stack Yang Disarankan

- App: Next.js di Vercel.
- Database: Neon Postgres.
- ORM: Drizzle ORM.
- Auth: Auth.js atau custom email/password sederhana.
- Styling: Tailwind CSS.
- Payment: Pakasir.com.
- Email: Resend.
- Storage: Cloudflare R2 atau UploadThing jika perlu upload file.
- Deployment: Vercel.

Catatan: Astro tidak dipilih untuk MVP karena aplikasi butuh auth, checkout, dashboard, webhook, dan backend route. Next.js lebih sederhana sebagai satu stack.

## 03A. Arah Frontend

Frontend memakai tema light premium digital marketplace. `appverse.id` digunakan sebagai referensi struktur dan flow UX, bukan untuk dicopy visualnya.

Ringkasan desain:

```txt
Style: light premium, solid, editorial, compact, commerce-first
Primary: #4F46E5
Accent: #0891B2
Background: #F8FAFC
Surface: #FFFFFF
Avoid: glassmorphism, dark-first, template SaaS generik
```

Detail desain ada di `docs/DESIGN.md`.

## 04. Role Pengguna

### Buyer/User

- Melihat marketplace.
- Membeli produk.
- Melihat riwayat pesanan.
- Mengakses data digital setelah pembayaran sukses.
- Membuat rating dan komentar.
- Membuka ticket support.
- Mengajukan status reseller.

### Seller

- Membuat dan mengedit produk.
- Mengatur harga normal dan harga reseller.
- Mengatur tipe delivery otomatis/manual.
- Mengelola stok digital.
- Melihat order masuk.
- Mengisi delivery manual.
- Membalas ticket terkait order miliknya.

### Admin

- Mengelola semua user, seller, produk, order, payment, ticket, blog, dan paket custom.
- Menjadi seller utama.
- Approve/suspend seller.
- Approve status reseller.
- Melihat audit/log payment.

## 05. Fitur Utama

- Landing page.
- Marketplace.
- Detail produk.
- Blog.
- Login/register.
- Dashboard user.
- Dashboard seller.
- Dashboard admin.
- Checkout Pakasir.
- Payment webhook/callback.
- Auto delivery stok digital.
- Manual delivery oleh seller.
- Email notification.
- Rating dan komentar.
- Ticket support.
- Harga reseller.
- Paket custom dari admin.
- FAQ chatbot sederhana.

## 06. Dashboard User

Route utama:

```txt
/dashboard
/dashboard/orders
/dashboard/orders/[id]
/dashboard/payments
/dashboard/tickets
/dashboard/profile
/dashboard/reseller
```

Fitur:

- Ringkasan pesanan.
- Riwayat order.
- Status order.
- Detail produk yang sudah dibeli.
- Data digital setelah order paid/delivered.
- Instruksi penggunaan.
- Riwayat pembayaran.
- Invoice sederhana.
- Rating dan komentar.
- Ticket support per order.
- Form pengajuan reseller.

## 07. Dashboard Seller

Route utama:

```txt
/seller
/seller/products
/seller/products/new
/seller/products/[id]
/seller/orders
/seller/orders/[id]
/seller/stocks
/seller/reviews
/seller/tickets
/seller/settings
```

Fitur:

- CRUD produk.
- Set kategori.
- Set harga normal.
- Set harga reseller.
- Set tipe fulfillment: auto/manual.
- Upload stok digital untuk auto delivery.
- Melihat order masuk.
- Input manual delivery.
- Melihat rating dan komentar.
- Membalas ticket terkait order.

## 08. Dashboard Admin

Route utama:

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
/admin/settings
```

Fitur:

- Kelola user.
- Kelola seller.
- Approve/suspend seller.
- Kelola produk.
- Kelola order.
- Kelola payment dan callback log.
- Kelola ticket.
- Kelola blog.
- Kelola paket custom.
- Kelola pengajuan reseller.

## 09. Fulfillment Produk

### Auto Delivery

Flow:

1. Seller upload stok akun/data digital.
2. Buyer checkout dan membayar.
3. Webhook Pakasir menandai order sebagai paid.
4. Sistem mengambil 1 stok available.
5. Stok ditandai sold.
6. Data digital disimpan ke order delivery.
7. Buyer melihat data di dashboard.
8. Email dikirim ke buyer dan seller.

### Manual Delivery

Flow:

1. Buyer checkout dan membayar.
2. Webhook Pakasir menandai order sebagai paid.
3. Seller mendapat notif.
4. Seller input detail akun/data digital.
5. Order ditandai delivered.
6. Buyer mendapat email.

## 10. Payment Pakasir

Flow checkout:

1. Buyer klik checkout.
2. Sistem membuat order `pending_payment`.
3. Sistem membuat payment record.
4. Sistem generate URL pembayaran Pakasir.
5. Buyer membayar.
6. Pakasir memanggil callback/webhook.
7. Sistem validasi callback.
8. Payment menjadi `paid`.
9. Order diproses sesuai tipe fulfillment.

Syarat teknis:

- Callback harus idempotent.
- Jangan proses order dua kali jika webhook dikirim ulang.
- Simpan raw callback sebagai log.
- Validasi amount dan order reference.

## 11. Email Notification

Event email:

- Register berhasil.
- Payment sukses.
- Order auto delivered.
- Manual order perlu diproses seller.
- Manual order delivered.
- Ticket dibuat.
- Ticket dibalas.
- Status seller/reseller berubah.

## 12. Rating Dan Komentar

Aturan:

- Buyer hanya bisa review produk yang pernah dibeli.
- Satu order item hanya boleh punya satu review.
- Review bisa berisi rating 1 sampai 5 dan komentar.
- Admin bisa menyembunyikan review bermasalah.

## 13. Ticket Support

Fitur MVP:

- Buyer membuat ticket dari order atau umum.
- Admin bisa melihat semua ticket.
- Seller bisa melihat ticket terkait produknya.
- Ticket memiliki pesan berurutan.
- Email dikirim saat ada balasan.

Live chat realtime ditunda sampai traffic terbukti membutuhkan.

## 14. Chatbot

MVP chatbot:

- FAQ statis.
- Jawaban dari daftar pertanyaan umum.
- Tombol buka ticket jika tidak membantu.

AI chatbot ditunda sampai ada knowledge base cukup dan budget inference jelas.

## 15. Blog Dan Landing Page

Landing page berisi:

- Hero.
- Produk populer.
- Kategori.
- Cara beli.
- Benefit seller.
- CTA daftar seller.
- FAQ.

Blog berisi:

- Edukasi produk digital.
- Tutorial.
- Update marketplace.
- Artikel SEO kategori produk.

## 16. Paket Custom

Admin dapat membuat paket custom berdasarkan permintaan buyer atau seller.

Contoh:

- Paket akun AI bulanan.
- Paket reseller khusus.
- Paket bundling beberapa produk.

MVP cukup dibuat sebagai produk biasa dengan flag `is_custom_package`.

## 17. Reseller Pricing

Aturan:

- User bisa mengajukan reseller.
- Admin approve/reject.
- Jika approved, user melihat harga reseller.
- Seller dapat mengisi harga reseller per produk.
- Jika harga reseller kosong, pakai harga normal.

## 18. Keamanan Minimal

- Password di-hash.
- Route dashboard dilindungi session.
- Role dicek di server.
- Data stok digital hanya muncul untuk buyer yang sudah membayar.
- Seller hanya bisa melihat order produknya sendiri.
- Admin bisa melihat semua data.
- Webhook payment divalidasi.
- Jangan simpan secret di client.

## 19. Status Order

```txt
pending_payment
paid
processing
delivered
cancelled
refunded
failed
```

## 20. Status Payment

```txt
pending
paid
failed
expired
refunded
```

## 21. Kriteria MVP Selesai

- Buyer bisa register/login.
- Buyer bisa checkout produk.
- Payment Pakasir bisa mengubah order menjadi paid.
- Produk auto delivery mengirim stok otomatis.
- Produk manual delivery bisa diisi seller.
- Email notifikasi terkirim.
- User dashboard menampilkan order dan data digital.
- Seller dashboard bisa mengelola produk dan order.
- Admin dashboard bisa mengelola user, produk, order, dan payment.
- Buyer bisa memberi rating.
- Buyer bisa membuat ticket.

## 22. Non-MVP

- Wallet seller.
- Withdraw otomatis.
- Komisi marketplace kompleks.
- Affiliate.
- Live chat realtime.
- AI chatbot penuh.
- Multi payment gateway.
- Mobile app.

Tambahkan hanya setelah transaksi nyata menunjukkan kebutuhan.
