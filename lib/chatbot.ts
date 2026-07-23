function pickReply(message: string) {
  const text = message.toLowerCase();

  if (text.includes("halo") || text.includes("hallo") || text.includes("hai") || text.includes("help")) {
    return "Halo. Saya bisa bantu soal checkout, invoice, delivery, reseller, dan ticket support.";
  }

  if (text.includes("tutor beli") || text.includes("cara beli") || text.includes("cara checkout") || text.includes("cara order")) {
    return "Cara beli singkat: pilih produk, klik checkout, bayar via Pakasir, lalu pantau status di invoice tracker atau dashboard order.";
  }

  if (text.includes("checkout") || text.includes("bayar") || text.includes("pembayaran")) {
    return "Checkout dilakukan dari halaman produk. Sistem membuat order, redirect ke Pakasir, lalu status muncul di dashboard dan invoice tracker.";
  }

  if (text.includes("pending") || text.includes("belum bayar") || text.includes("lanjut bayar")) {
    return "Kalau payment masih pending, buka Dashboard > Pembayaran. Jika payment URL masih tersedia, klik Bayar untuk lanjut ke Pakasir.";
  }

  if (text.includes("invoice") || text.includes("cek invoice")) {
    return "Masukkan nomor invoice di navbar atau halaman invoice tracker. Di sana kamu bisa lihat status order, payment, total, dan nama produk.";
  }

  if (text.includes("delivery") || text.includes("akses") || text.includes("stok")) {
    return "Auto delivery mengirim stok otomatis setelah payment paid. Manual delivery diproses seller lalu buyer melihat detail di dashboard order.";
  }

  if (text.includes("kategori") || text.includes("filter")) {
    return "Di marketplace kamu bisa cari produk dengan search dan filter kategori seperti AI, Design, Streaming, Tools, Lisensi, atau Bundle.";
  }

  if (text.includes("harga reseller") || text.includes("harga khusus")) {
    return "Harga reseller muncul untuk user yang status reseller-nya approved dan hanya pada produk yang punya harga reseller.";
  }

  if (text.includes("seller") || text.includes("jual") || text.includes("stok digital")) {
    return "Seller bisa mengelola produk dan stok dari dashboard seller. Stok auto delivery bisa ditambah bulk dengan satu JSON per baris di halaman stok.";
  }

  if (text.includes("reseller")) {
    return "Kamu bisa ajukan reseller dari dashboard buyer. Jika approved, harga reseller muncul pada produk yang mendukung.";
  }

  if (text.includes("support") || text.includes("ticket") || text.includes("bantuan")) {
    return "Kalau ada kendala, buka ticket dari order atau halaman support. Ticket dipakai untuk cek invoice, akses, atau masalah order.";
  }

  if (text.includes("paid") || text.includes("sudah bayar") || text.includes("belum masuk")) {
    return "Jika payment sudah paid tapi akses belum masuk, cek dashboard order. Kalau status masih processing atau akses kosong, buka ticket dari order tersebut.";
  }

  if (text.includes("produk") || text.includes("chatgpt") || text.includes("gemini") || text.includes("canva")) {
    return "Produk seed utama: ChatGPT Plus Private 1 Bulan Rp35.000, Gemini Pro 18 Bulan Rp56.000, dan Canva Pro Team 1 Bulan Rp35.000. Ada juga paket custom sebagai produk dengan flag khusus.";
  }

  return "Saya belum punya jawaban spesifik untuk itu. Info inti marketplace: buyer bisa checkout produk digital, cek invoice, lihat review, dan buka ticket support.";
}

export function buildFallbackChatReply(message: string) {
  return pickReply(message);
}
