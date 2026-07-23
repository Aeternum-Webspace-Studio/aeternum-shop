export function referralCodeForUser(user) {
  return user.id.replaceAll("-", "").slice(0, 10).toUpperCase();
}

export function buildReferralUrl(baseUrl, code) {
  const url = new URL("/register", baseUrl);
  url.searchParams.set("ref", code);
  return url.toString();
}
