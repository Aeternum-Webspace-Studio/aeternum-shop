"use client";

import { useState } from "react";
import { ChatbotClient } from "@/components/chatbot-client";

export function ChatbotLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[60] rounded-full border-[3px] border-border bg-primary px-4 py-3 text-sm font-black text-white shadow-[6px_6px_0_#111827]"
      >
        Chatbot
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-end bg-black/40 p-4 md:items-end md:justify-end">
          <div className="relative w-full max-w-4xl rounded-2xl border-[3px] border-border bg-[#fffaf2] p-4 shadow-[10px_10px_0_#111827] md:max-h-[85vh] md:overflow-auto md:p-5">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full border-[2px] border-border bg-white px-3 py-1 text-xs font-black"
            >
              Tutup
            </button>
            <div className="pr-16">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Aeternum Bot</p>
              <p className="mt-2 text-sm text-muted">Tanya cepat soal produk, invoice, checkout, support, atau reseller.</p>
            </div>
            <div className="mt-4">
              <ChatbotClient />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
