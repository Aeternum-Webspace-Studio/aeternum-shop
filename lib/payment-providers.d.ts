export const defaultPaymentProvider: "pakasir";
export const paymentProviders: Array<{ id: "pakasir"; label: string; envKey: string }>;
export function isPaymentProviderConfigured(provider: string, env?: Record<string, string | undefined>): boolean;
