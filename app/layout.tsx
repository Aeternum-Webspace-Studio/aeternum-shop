import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aeternum Shop",
  description: "Marketplace produk digital dengan delivery otomatis dan manual."
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
