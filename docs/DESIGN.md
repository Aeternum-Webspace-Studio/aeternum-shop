# Design Direction

## 01. Ringkasan

Frontend memakai tema light premium digital marketplace. `appverse.id` boleh dijadikan referensi struktur marketplace dan flow UX, tetapi visual tidak boleh meniru penuh.

Identitas produk:

```txt
Nama rasa: Aeternum Digital Market
Style: light premium, solid, editorial, compact, commerce-first
Mood: bersih, terpercaya, aktif, cepat, modern
```

## 02. Referensi

Gunakan `appverse.id` sebagai referensi untuk:

- Alur marketplace produk digital.
- Penempatan kategori.
- Cara menonjolkan produk.
- Pola checkout dan instruksi.
- Ekspektasi buyer produk digital.

Jangan gunakan sebagai referensi untuk:

- Menyalin layout 1:1.
- Menyalin warna 1:1.
- Menyalin copywriting 1:1.
- Membuat website terasa seperti clone.

## 03. Yang Harus Dihindari

- Glassmorphism.
- Dark-first theme.
- Neumorphism.
- Template SaaS generik.
- Layout terlalu kosong seperti landing page AI generate.
- Animasi berat yang mengganggu checkout.
- Card transparan atau blur.

## 04. Palet Warna

```txt
Background: #F8FAFC
Surface: #FFFFFF
Surface Soft: #F1F5F9
Border: #E2E8F0
Text: #0F172A
Muted: #64748B

Primary: #4F46E5
Primary Dark: #3730A3
Accent Cyan: #0891B2
Accent Amber: #D97706
Success: #16A34A
Warning: #F59E0B
Danger: #DC2626
```

## 05. Typography

Font utama:

```txt
Geist atau Inter
```

Aturan:

- Heading tegas, tidak terlalu playful.
- Body text mudah dibaca.
- Harga produk harus paling mudah dipindai.
- Label status harus pendek dan jelas.

## 06. Visual Signature

- Light background.
- Solid white cards.
- Border halus.
- Shadow kecil, bukan dramatic.
- Rounded `16px` untuk card utama.
- Button indigo solid.
- Badge solid-soft.
- Icon outline dari `lucide-react`.
- Section separator pakai garis tipis atau label kecil.

## 07. Homepage Flow

```txt
Header
Hero marketplace dengan search besar
Quick category chips
Produk trending
Produk auto delivery
Benefit buyer
Benefit seller/reseller
Cara beli
Testimonial/rating
FAQ
Footer
```

Hero harus terasa seperti toko aktif, bukan company profile. Search produk dan kategori cepat lebih penting daripada slogan panjang.

## 08. Marketplace Page

Elemen wajib:

- Search bar besar.
- Filter kategori.
- Sort produk.
- Product grid.
- Badge delivery.
- Badge stok.
- Badge reseller jika relevan.
- Rating dan jumlah review.
- Harga jelas.

Badge contoh:

```txt
Auto Kirim
Manual Seller
Stok Ready
Harga Reseller
Produk Custom
```

## 09. Product Card

Product card harus compact dan commerce-first.

Isi minimal:

- Nama produk.
- Kategori.
- Harga.
- Rating.
- Stok/status.
- Tipe delivery.
- Seller/store.
- CTA detail atau beli.

Jangan isi card dengan teks panjang. Deskripsi panjang hanya di halaman detail.

## 10. Product Detail

Elemen wajib:

- Nama produk.
- Harga normal/reseller.
- Rating.
- Tipe delivery.
- Estimasi proses.
- Stok.
- Deskripsi.
- Instruksi.
- Seller info.
- Komentar/rating.
- CTA checkout sticky di desktop/mobile jika memungkinkan.

Product detail harus menjawab pertanyaan buyer sebelum bayar:

- Apa yang dibeli?
- Kapan diterima?
- Bagaimana cara pakai?
- Kalau bermasalah hubungi siapa?

## 11. Dashboard Style

Dashboard memakai light admin style.

Aturan:

- Sidebar putih atau soft gray.
- Active navigation indigo.
- Table rapi.
- Status badge mudah dibaca.
- Card statistik sederhana.
- Detail order jelas.
- Delivery data ditampilkan dalam box aman dan eksplisit.

Dashboard user, seller, dan admin harus terasa satu keluarga visual, tetapi beda prioritas konten.

## 12. UX Checkout

Checkout harus pendek.

Flow:

```txt
Pilih produk
Konfirmasi order
Bayar via Pakasir
Kembali ke dashboard order
Terima produk otomatis/manual
```

Jangan membuat checkout multi-step panjang untuk MVP.

## 13. Mobile

Prioritas mobile:

- Search mudah dijangkau.
- Product card tetap compact.
- CTA checkout jelas.
- Dashboard order mudah dibaca.
- Delivery data tidak terpotong.

## 14. Stack UI

```txt
Next.js
Tailwind CSS
shadcn/ui
lucide-react
sonner
Geist atau Inter
```

Gunakan `recharts` hanya jika dashboard analytics sudah benar-benar dibuat.

## 15. Prinsip Implementasi

- Jangan bikin design system besar dulu.
- Mulai dari token warna, button, card, badge, table.
- Komponen baru dibuat hanya kalau dipakai lebih dari sekali.
- Jangan tambahkan dark mode untuk MVP.
- Jangan tambahkan animasi kompleks untuk MVP.

ponytail: desain dikunci cukup untuk membangun MVP tanpa bikin UI kit besar sebelum ada halaman nyata.
