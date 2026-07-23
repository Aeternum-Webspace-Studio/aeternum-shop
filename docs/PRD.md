# PRD Marketplace Produk Digital

## 01. Ringkasan

Produk ini adalah marketplace jual beli produk digital seperti akun AI, Canva, Gemini, ChatGPT Plus, streaming, lisensi, voucher, template, dan produk digital lain. Platform tetap mendukung buyer, seller, reseller, dan admin, tetapi halaman publik harus fokus membangun trust buyer.

Fokus versi awal adalah buyer bisa menemukan produk, melihat harga/ulasan, checkout Pakasir, melacak invoice, dan menerima akses produk dengan alur yang jelas.

## 02. Tujuan

- Membuat marketplace produk digital yang bisa dipakai buyer untuk membeli produk dengan cepat dan percaya.
- Memberi seller dashboard untuk mengelola produk, stok, order, dan delivery.
- Memberi admin kontrol penuh atas user, seller, produk, transaksi, ticket, artikel, dan paket custom.
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

Frontend memakai tema light orange neurabrutalism: tegas, buyer-first, compact, dan commerce-focused. Referensi seperti appverse/kilat/hosting-style dipakai untuk struktur dan ritme, bukan untuk clone visual.

Ringkasan desain:

```txt
Style: light orange neurabrutalism, solid, editorial, compact, commerce-first
Primary: #F97316
Accent: #0EA5E9
Background: #FFF7ED
Surface: #FFFFFF
Avoid: glassmorphism, dark-first, template SaaS generik
```

Detail desain ada di `docs/DESIGN.md`.

## 04. Role Pengguna

### Buyer/User

- Melihat marketplace.
- Membeli produk.
- Melihat riwayat pesanan.
- Melacak invoice dari navbar.
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

- Landing page buyer-first.
- Marketplace.
- Detail produk.
- Artikel publik untuk edukasi buyer.
- Login/register.
- Invoice tracker publik dari nomor invoice.
- Dashboard user.
- Dashboard seller.
- Dashboard admin.
- Checkout Pakasir.
- Admin dapat mematikan checkout dari settings dan API checkout ikut memblokir order baru.
- Payment webhook/callback.
- Auto delivery stok digital.
- Manual delivery oleh seller.
- Email notification.
- Rating dan komentar.
- Ticket support.
- Statistik buyer di navbar: peringkat dan total transaksi sukses.
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
- Melihat saldo wallet seller dari order settled.
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
- Kelola artikel.
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
- Marketplace dan detail produk menampilkan rating rata-rata, jumlah review, dan komentar pembeli terverifikasi.
- Form review di order detail harus membantu buyer menulis pengalaman yang berguna untuk pembeli lain.

Status implementasi:

- Buyer bisa memberi rating dan komentar setelah item delivered.
- Review tampil di landing, marketplace, dan detail produk.
- Admin bisa hide/unhide review.

## 12A. Detail Produk Dan Checkout

Detail produk publik wajib memuat:

- Nama produk, kategori, harga, harga reseller jika ada.
- Deskripsi yang menjual tapi tetap jelas.
- Manfaat produk dan target pengguna.
- Cara akses setelah pembayaran.
- Cara checkout ringkas.
- Informasi invoice, dashboard order, dan support ticket.
- Rating rata-rata dan komentar pembeli.

Checkout MVP tetap sederhana: tombol detail produk membuat order, payment, lalu redirect ke Pakasir. Halaman checkout terpisah ditunda sampai dibutuhkan untuk cart atau multi-item.

## 12B. Role-Aware Account Routing

Route publik `\/account` dipakai sebagai pintu role-aware agar buyer, seller, dan admin masuk ke area yang tepat tanpa hardcode link publik ke dashboard tertentu.

Status implementasi:

- `/account` mengarah ke home sesuai role.
- `/account/orders` dan `/account/tickets` mengarah ke route yang sesuai role.
- Login dan register mengarahkan user ke area role masing-masing.
- Role gate server-side aktif di dashboard admin, seller, dan buyer.

## 13. Ticket Support

Fitur MVP:

- Buyer membuat ticket dari order atau umum.
- Admin bisa melihat semua ticket.
- Seller bisa melihat ticket terkait produknya.
- Ticket memiliki pesan berurutan.
- Email dikirim saat ada balasan.
- Halaman help bisa membuat live-support ticket dengan pesan awal.
- Detail ticket memakai live refresh pendek agar percakapan terlihat tanpa refresh manual.
- Komisi marketplace dasar dihitung dari item order agar seller dan admin melihat gross, fee platform, dan net seller.

Live chat realtime ditunda sampai traffic terbukti membutuhkan.

## 14. Chatbot

MVP chatbot:

- FAQ statis.
- Jawaban dari daftar pertanyaan umum.
- Tombol buka ticket jika tidak membantu.

AI chatbot ditunda sampai ada knowledge base cukup dan budget inference jelas.

Status implementasi:

- FAQ statis sudah tampil di landing.
- FAQ disimpan di database dan bisa disesuaikan lewat seed.
- Chatbot punya popup launcher global dan fallback reply lokal saat OpenRouter belum siap.
- Tombol buka ticket sudah tersedia dari area FAQ.
- `npm run check` memeriksa route utama dan endpoint chatbot.

## 15. Blog Dan Landing Page

Landing page berisi:

- Hero.
- Produk unggulan dari database.
- Rating produk dari database.
- Cara beli.
- CTA marketplace dan pesanan buyer.
- Artikel pembeli terbaru.
- Footer studio dengan sosial media.

Landing page tidak boleh fokus ke seller. Bahasa publik harus bahasa bisnis yang mengenalkan produk dan membuat buyer percaya, bukan bahasa teknis/project.

Navbar publik berisi:

- Marketplace.
- Artikel.
- Pesanan saya.
- Akun saya.
- Invoice tracker compact.
- Peringkat buyer dan total transaksi jika login.

Footer publik berisi:

- Brand Aeternum Shop.
- Aeternum Webspace Studio by PT Aeternum Kreasikan Bersama.
- Instagram `aeternum.webspace`.
- Telegram `aettera_hunter`.
- Link marketplace, artikel, invoice, dan support.

Invoice tracker hanya dipertahankan di navbar/link footer. Form besar di hero/footer tidak dipakai agar halaman tidak ramai.

Artikel berisi:

- Edukasi produk digital.
- Tutorial.
- Update marketplace.
- Artikel SEO kategori produk.

Route artikel:

```txt
/blog
/blog/[slug]
/admin/blog
/api/admin/articles
```

Produk seed awal:

- ChatGPT Plus Private 1 Bulan: Rp35.000.
- Gemini Pro 18 Bulan: Rp56.000.
- Canva Pro Team 1 Bulan: Rp35.000.

Produk seed wajib punya deskripsi, instruksi, stok contoh, dummy order/payment, dan dummy review agar rating muncul di landing/detail produk.

## 15A. Invoice Tracker

Route:

```txt
/invoice-tracker?invoice=INV...
```

Aturan:

- Bisa diakses dari navbar publik.
- Menampilkan nomor invoice, status order, status pembayaran, total, dan nama produk.
- Tidak boleh menampilkan data akses produk atau `delivery_content`.
- Jika buyer butuh data akses, arahkan ke dashboard order setelah login.

## 15B. Checkout, Webhook, Dan Delivery

Status implementasi:

- Checkout Pakasir sudah membuat order dan payment record.
- Webhook Pakasir sudah idempotent dengan advisory lock agar delivery tidak dobel.
- Webhook payment outcome dites dengan guard untuk paid, duplicate, mismatch, dan ignored.
- Auto delivery berjalan untuk stok digital setelah payment paid.
- Manual delivery tersedia untuk seller pada order miliknya.
- Admin punya aksi cancel, refund, dan failed untuk lifecycle order.

## 15C. Seller Dan Admin Settings

Status implementasi:

- Seller bisa mengubah nama toko, slug, dan deskripsi dari `/seller/settings`.
- Seller onboarding tersedia dari `/dashboard/profile`.
- Seller bisa bulk add stok digital dari `/seller/stocks` dengan satu JSON per baris.
- Seller bisa filter stok dan disable stok yang masih available.
- Admin bisa mengubah app settings dari `/admin/settings`.
- Admin bisa filter payment dan melihat callback Pakasir dari `/admin/payments`.
- Setting marketplace disimpan sebagai singleton agar mudah dipakai di UI.

## 15D. Backend Regression Checks

Status implementasi:

- `npm run check` memeriksa route utama dan chatbot.
- `npm run check:backend` memeriksa guard backend dan route sensitif.
- `npm run check:auth-role` tersedia untuk validasi routing role.
- Production smoke check sudah lulus di `https://aeternumshop.biz.id`.

## 16. Paket Custom

Admin dapat membuat paket custom berdasarkan permintaan buyer atau seller.

Contoh:

- Paket akun AI bulanan.
- Paket reseller khusus.
- Paket bundling beberapa produk.

MVP cukup dibuat sebagai produk biasa dengan flag `is_custom_package`.

Status implementasi:

- Admin bisa membuat paket custom dari `/admin/packages`.
- Paket custom disimpan sebagai produk dengan `is_custom_package = true`.
- Paket custom bisa tampil di marketplace dan detail produk seperti produk biasa.

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
- Buyer bisa mencari produk di marketplace.
- Buyer bisa melacak invoice dari navbar.
- Payment Pakasir bisa mengubah order menjadi paid.
- Produk auto delivery mengirim stok otomatis.
- Produk manual delivery bisa diisi seller.
- Email notifikasi terkirim.
- User dashboard menampilkan order dan data digital.
- Seller dashboard bisa mengelola produk dan order.
- Admin dashboard bisa mengelola user, produk, order, dan payment.
- Buyer bisa memberi rating.
- Buyer bisa membuat ticket.
- Artikel publik bisa dibaca dan dibuat admin.
- Landing menampilkan produk dan rating dari database.

## 22. Non-MVP

- Withdraw otomatis.
- Wallet seller manual.
- Komisi marketplace kompleks.
- Affiliate.
- Live chat realtime.
- AI chatbot penuh.
- Multi payment gateway.
- Mobile app.

Tambahkan hanya setelah transaksi nyata menunjukkan kebutuhan.
