import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "gtbs_admin_session";

interface AdminSessionPayload {
  email: string;
  expiresAt: number;
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

export function isAdminAuthConfigured() {
  return Boolean(
    process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD &&
      process.env.ADMIN_SESSION_SECRET
  );
}

export function validateAdminCredentials(email: string, password: string) {
  if (!isAdminAuthConfigured()) {
    return false;
  }

  return (
    safeCompare(email.trim().toLowerCase(), process.env.ADMIN_EMAIL!.trim().toLowerCase()) &&
    safeCompare(password, process.env.ADMIN_PASSWORD!)
  );
}

export function createAdminSession(email: string, expiresAt: number) {
  const payload = Buffer.from(
    JSON.stringify({ email, expiresAt } satisfies AdminSessionPayload)
  ).toString("base64url");
  const signature = createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

export function verifyAdminSession(token?: string) {
  if (!token || !isAdminAuthConfigured()) {
    return null;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");

  if (!safeCompare(signature, expectedSignature)) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as AdminSessionPayload;

    return session.expiresAt > Date.now() ? session : null;
  } catch {
    return null;
  }
}
