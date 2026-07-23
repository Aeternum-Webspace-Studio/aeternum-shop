const baseUrl = (process.argv.find((arg) => arg.startsWith("--base="))?.split("=")[1] ?? process.env.CHECK_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

const routes = [
  ["/", 200, "Aeternum Shop"],
  ["/marketplace", 200, "Marketplace"],
  ["/trending", 200, "Trending sekarang"],
  ["/help", 200, "Tanya seputar marketplace"],
  ["/products/chatgpt-plus-private-1-bulan", 200, "ChatGPT Plus Private 1 Bulan"],
  ["/products/gemini-pro-18-bulan", 200, "Gemini Pro 18 Bulan"],
  ["/products/canva-pro-team-1-bulan", 200, "Canva Pro Team 1 Bulan"],
  ["/products/paket-akun-ai-bulanan", 200, "Paket Akun AI Bulanan"]
];

async function checkPage(path, status, needle) {
  const response = await fetch(`${baseUrl}${path}`);
  const body = await response.text();

  if (response.status !== status) {
    throw new Error(`[check] ${path} expected ${status} got ${response.status}`);
  }

  if (needle && !body.includes(needle)) {
    throw new Error(`[check] ${path} missing text: ${needle}`);
  }
}

async function checkChatbot() {
  const response = await fetch(`${baseUrl}/api/chatbot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Bagaimana cara checkout?", messages: [] })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(`[check] chatbot status ${response.status}`);
  if (!data.reply || typeof data.reply !== "string") throw new Error("[check] chatbot reply missing");
}

for (const [path, status, needle] of routes) {
  // eslint-disable-next-line no-await-in-loop
  await checkPage(path, status, needle);
}

await checkChatbot();

console.log(`[check] ok: ${baseUrl}`);
