export type AppRole = "buyer" | "seller" | "admin";

export function roleHome(role: AppRole) {
  if (role === "admin") return "/admin";
  if (role === "seller") return "/seller";
  return "/dashboard";
}

export function roleOrdersPath(role: AppRole) {
  if (role === "admin") return "/admin/orders";
  if (role === "seller") return "/seller/orders";
  return "/dashboard/orders";
}

export function roleTicketsPath(role: AppRole) {
  if (role === "admin") return "/admin/tickets";
  if (role === "seller") return "/seller/tickets";
  return "/dashboard/tickets";
}
