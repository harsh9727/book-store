import { NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSession,
  isAdminAuthConfigured,
  validateAdminCredentials,
} from "@/lib/adminAuth";
import {
  clearAdminLoginFailures,
  getAdminLoginLimit,
  recordAdminLoginFailure,
} from "@/lib/adminRateLimit";
import {
  getAdminClientIdentifier,
  isTrustedAdminMutation,
} from "@/lib/adminRequestSecurity";

const SESSION_HOURS = 8;
const REMEMBERED_SESSION_DAYS = 7;
const MAX_REQUEST_BYTES = 4_096;
const GENERIC_LOGIN_ERROR =
  "The sign-in details are incorrect or temporarily unavailable.";

const loginSchema = z
  .object({
    email: z.string().trim().email().max(254),
    password: z.string().min(1).max(1_024),
    oneTimeCode: z
      .string()
      .trim()
      .regex(/^\d{6}$/u)
      .optional(),
    rememberMe: z.boolean().optional().default(false),
  })
  .strict();

function jsonResponse(
  body: object,
  status: number,
  extraHeaders?: HeadersInit,
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

function throttledResponse(retryAfterSeconds: number) {
  return jsonResponse(
    { message: GENERIC_LOGIN_ERROR, retryAfterSeconds },
    429,
    { "Retry-After": String(retryAfterSeconds) },
  );
}

export async function POST(request: Request) {
  if (!isTrustedAdminMutation(request)) {
    return jsonResponse({ message: "Request could not be verified." }, 403);
  }

  if (!isAdminAuthConfigured()) {
    return jsonResponse(
      { message: "Admin login is not configured on the server." },
      503,
    );
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > MAX_REQUEST_BYTES) {
    return jsonResponse({ message: GENERIC_LOGIN_ERROR }, 413);
  }

  const clientIdentifier = getAdminClientIdentifier(request);
  let rawBody: unknown;

  try {
    const bodyText = await request.text();
    if (Buffer.byteLength(bodyText) > MAX_REQUEST_BYTES) {
      return jsonResponse({ message: GENERIC_LOGIN_ERROR }, 413);
    }
    rawBody = JSON.parse(bodyText);
  } catch {
    recordAdminLoginFailure(clientIdentifier, "invalid-request");
    return jsonResponse({ message: GENERIC_LOGIN_ERROR }, 400);
  }

  const parsedBody = loginSchema.safeParse(rawBody);
  if (!parsedBody.success) {
    recordAdminLoginFailure(clientIdentifier, "invalid-request");
    return jsonResponse({ message: GENERIC_LOGIN_ERROR }, 400);
  }

  const { email, password, oneTimeCode, rememberMe } = parsedBody.data;
  const currentLimit = getAdminLoginLimit(clientIdentifier, email);
  if (!currentLimit.allowed)
    return throttledResponse(currentLimit.retryAfterSeconds);

  if (!(await validateAdminCredentials(email, password, oneTimeCode))) {
    const nextLimit = recordAdminLoginFailure(clientIdentifier, email);
    if (!nextLimit.allowed)
      return throttledResponse(nextLimit.retryAfterSeconds);
    return jsonResponse({ message: GENERIC_LOGIN_ERROR }, 401);
  }

  clearAdminLoginFailures(clientIdentifier, email);
  const sessionDuration = rememberMe
    ? REMEMBERED_SESSION_DAYS * 24 * 60 * 60 * 1000
    : SESSION_HOURS * 60 * 60 * 1000;
  const expiresAt = Date.now() + sessionDuration;
  const response = jsonResponse({ success: true }, 200);

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createAdminSession(email, expiresAt),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    priority: "high",
    path: "/",
    ...(rememberMe ? { maxAge: REMEMBERED_SESSION_DAYS * 24 * 60 * 60 } : {}),
  });

  return response;
}
