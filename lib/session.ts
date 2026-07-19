export const SESSION_COOKIE = "aeternum_session";

export type SessionPayload = {
  userId: string;
  role: "buyer" | "seller" | "admin";
  exp: number;
};
