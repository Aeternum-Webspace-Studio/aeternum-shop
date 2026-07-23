import { ChatbotClient } from "@/components/chatbot-client";

export default function HelpPage() {
  return (
    <main className="aeternum-bg min-h-screen px-6 py-10 text-text">
      <div className="mx-auto max-w-7xl">
        <ChatbotClient />
        <section className="mt-6 rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Live support bridge</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight">Butuh bantuan manusia?</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Kirim pesan awal dari sini. Sistem akan membuat ticket support supaya riwayat bantuan tetap tercatat.</p>
          <form className="mt-4 grid gap-3" method="post" action="/api/tickets">
            <input type="hidden" name="subject" value="Live support request" />
            <textarea className="min-h-28 rounded-xl border-[2px] border-border bg-surfaceSoft px-4 py-3 text-sm outline-none" name="message" placeholder="Tulis nomor invoice, produk, dan kendala singkat." required />
            <button className="rounded-xl border-[2px] border-border bg-primary px-5 py-3 text-sm font-black text-white">Buat ticket live support</button>
          </form>
        </section>
      </div>
    </main>
  );
}
