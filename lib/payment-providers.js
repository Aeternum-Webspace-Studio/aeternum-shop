export const defaultPaymentProvider = "pakasir";

export const paymentProviders = [
  { id: "pakasir", label: "Pakasir QRIS", envKey: "PAKASIR_PROJECT_SLUG" }
];

export function isPaymentProviderConfigured(provider, env = process.env) {
  return Boolean(env[paymentProviders.find((item) => item.id === provider)?.envKey ?? ""]);
}
