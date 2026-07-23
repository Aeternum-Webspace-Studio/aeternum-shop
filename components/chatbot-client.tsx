"use client";

import { useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const quickQuestions = [
  "Bagaimana cara checkout?",
  "Apa beda auto dan manual delivery?",
  "Bagaimana cek invoice?",
  "Kalau akses belum masuk harus bagaimana?",
  "Bagaimana melihat harga reseller?",
  "Bagaimana filter kategori produk?"
];

export function ChatbotClient() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Tanya apa saja soal produk, invoice, payment, atau support Aeternum Shop." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(messageText: string) {
    const trimmed = messageText.trim();
    if (!trimmed || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          messages: nextMessages
        })
      });

      const data = await response.json();
      setMessages((current) => [...current, { role: "assistant", content: data.reply ?? data.error ?? "Terjadi kesalahan." }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: "Gagal menghubungi chatbot. Coba lagi atau buka ticket support." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="min-w-0 rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft sm:p-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Chatbot</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Tanya seputar marketplace</h1>
        <p className="mt-3 text-sm leading-6 text-muted">Chatbot ini dibekali ringkasan marketplace, kategori produk, harga reseller, checkout, invoice, delivery, ticket, dan seller stock.</p>

        <div className="mt-5 space-y-2">
          {quickQuestions.map((question) => (
            <button key={question} type="button" onClick={() => void send(question)} className="block w-full rounded-xl border-[2px] border-border bg-surfaceSoft px-4 py-3 text-left text-sm font-semibold">
              {question}
            </button>
          ))}
        </div>

        <a className="mt-5 inline-flex rounded-xl border-[2px] border-border bg-primary px-4 py-3 text-sm font-black text-white" href="/account/tickets">Buka Ticket Support</a>
      </div>

      <div className="min-w-0 rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft sm:p-5">
        <div className="max-h-[45dvh] space-y-3 overflow-auto pr-1 sm:max-h-none">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`max-w-[95%] break-words rounded-2xl border-[2px] border-border px-4 py-3 text-sm leading-6 sm:max-w-[85%] ${message.role === "user" ? "ml-auto bg-primary text-white" : "bg-surfaceSoft text-text"}`}>
              {message.content}
            </div>
          ))}
          {loading ? <div className="max-w-[85%] rounded-2xl border-[2px] border-border bg-surfaceSoft px-4 py-3 text-sm text-muted">Menjawab...</div> : null}
        </div>

        <form
          className="mt-5 flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            void send(input);
          }}
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="min-h-12 w-full min-w-0 flex-1 rounded-xl border-[2px] border-border bg-surfaceSoft px-4 text-sm outline-none"
            placeholder="Tanya tentang produk, invoice, support, atau reseller"
          />
          <button className="rounded-xl border-[2px] border-border bg-primary px-5 py-3 text-sm font-black text-white">Kirim</button>
        </form>
      </div>
    </div>
  );
}
