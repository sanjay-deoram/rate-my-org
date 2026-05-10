import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE = "admin_token";

function secret() {
  const s = process.env.ADMIN_SECRET;
  if (!s) throw new Error("ADMIN_SECRET env var is not set");
  return new TextEncoder().encode(s);
}

export async function signAdminToken() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret());
}

export async function verifyAdminToken(token: string) {
  return jwtVerify(token, secret());
}
