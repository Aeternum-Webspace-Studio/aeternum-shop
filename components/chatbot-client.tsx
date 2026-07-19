"use client";

import { useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const quickQuestions = [
  "Bagaimana cara checkout?",
  "Apa beda auto dan manual delivery?",
  "Bagaimana cek invoice?",
  "Kalau akses belum masuk harus bagaimana?"
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
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Chatbot</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Tanya seputar marketplace</h1>
        <p className="mt-3 text-sm leading-6 text-muted">Chatbot ini dibekali ringkasan marketplace, produk seed, cara checkout, invoice, delivery, ticket, dan reseller.</p>

        <div className="mt-5 space-y-2">
          {quickQuestions.map((question) => (
            <button key={question} type="button" onClick={() => void send(question)} className="block w-full rounded-xl border-[2px] border-border bg-surfaceSoft px-4 py-3 text-left text-sm font-semibold">
              {question}
            </button>
          ))}
        </div>

        <a className="mt-5 inline-flex rounded-xl border-[2px] border-border bg-primary px-4 py-3 text-sm font-black text-white" href="/dashboard/tickets">Buka Ticket Support</a>
      </div>

      <div className="rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft">
        <div className="space-y-3">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`max-w-[85%] rounded-2xl border-[2px] border-border px-4 py-3 text-sm leading-6 ${message.role === "user" ? "ml-auto bg-primary text-white" : "bg-surfaceSoft text-text"}`}>
              {message.content}
            </div>
          ))}
          {loading ? <div className="max-w-[85%] rounded-2xl border-[2px] border-border bg-surfaceSoft px-4 py-3 text-sm text-muted">Menjawab...</div> : null}
        </div>

        <form
          className="mt-5 flex gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            void send(input);
          }}
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="min-h-12 flex-1 rounded-xl border-[2px] border-border bg-surfaceSoft px-4 text-sm outline-none"
            placeholder="Tanya tentang produk, invoice, support, atau reseller"
          />
          <button className="rounded-xl border-[2px] border-border bg-primary px-5 py-3 text-sm font-black text-white">Kirim</button>
        </form>
      </div>
    </div>
  );
}
