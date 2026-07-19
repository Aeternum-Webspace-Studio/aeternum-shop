import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aeternum Shop - Toko Produk Digital Terpercaya",
  description: "Temukan akun premium, tools, lisensi, dan produk digital dengan harga jelas, pembayaran aman, ulasan pembeli, dan bantuan order.",
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
