export function buildPakasirPaymentUrl(params: {
  projectSlug: string;
  amount: number;
  orderId: string;
  redirectUrl: string;
}) {
  const url = new URL(`https://app.pakasir.com/pay/${params.projectSlug}/${params.amount}`);
  url.searchParams.set("order_id", params.orderId);
  url.searchParams.set("redirect", params.redirectUrl);
  url.searchParams.set("qris_only", "1");
  return url.toString();
}

export async function fetchPakasirTransactionDetail(params: {
  projectSlug: string;
  amount: number;
  orderId: string;
  apiKey: string;
}) {
  const url = new URL("https://app.pakasir.com/api/transactiondetail");
  url.searchParams.set("project", params.projectSlug);
  url.searchParams.set("amount", String(params.amount));
  url.searchParams.set("order_id", params.orderId);
  url.searchParams.set("api_key", params.apiKey);

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return null;
  return response.json() as Promise<{
    transaction?: {
      amount: number;
      order_id: string;
      project: string;
      status: string;
      payment_method: string;
      completed_at?: string;
    };
  }>;
}
