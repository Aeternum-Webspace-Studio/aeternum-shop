import { NextResponse } from "next/server";
import { buildChatSystemPrompt } from "@/lib/marketplace-memory";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function POST(request: Request) {
  const body = (await request.json()) as { message?: string; messages?: ChatMessage[] };
  const message = body.message?.trim() ?? "";
  const history = Array.isArray(body.messages) ? body.messages.slice(-8) : [];

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      reply: "Chatbot belum aktif karena OPENROUTER_API_KEY belum diset. Tambahkan key itu di env lokal atau Vercel, lalu coba lagi."
    });
  }

  const conversation = history.slice(0, -1).filter((entry) => entry.role !== "system");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-Title": "Aeternum Shop Chatbot"
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: buildChatSystemPrompt() },
        ...conversation,
        { role: "user", content: message }
      ]
    })
  });

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json({ error: "OpenRouter request failed", detail: text }, { status: 502 });
  }

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const reply = data.choices?.[0]?.message?.content?.trim();

  return NextResponse.json({
    reply: reply || "Saya belum punya jawaban untuk itu. Coba buka ticket support agar bisa dibantu tim."
  });
}
