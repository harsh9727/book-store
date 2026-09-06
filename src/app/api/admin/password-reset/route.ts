import { NextResponse } from "next/server";
import { z } from "zod";

import { isAdminAuthConfigured } from "@/lib/adminAuth";
import {
  completeAdminPasswordReset,
  requestAdminPasswordReset,
  verifyAdminPasswordReset,
} from "@/lib/adminPasswordReset";
import {
  getPasswordResetEmailConfigurationIssues,
  sendAdminPasswordResetCode,
} from "@/lib/adminPasswordResetEmail";
import {
  getAdminClientIdentifier,
  isTrustedAdminMutation,
} from "@/lib/adminRequestSecurity";

const MAX_REQUEST_BYTES = 4_096;
const EMAIL_RESPONSE =
  "If this address matches the Admin account, a 6-digit code has been sent.";
const INVALID_CODE_RESPONSE =
  "The verification code is invalid or expired. Request a new code.";
const INVALID_RESET_RESPONSE =
  "The password reset authorization is invalid or expired. Start again.";

const requestSchema = z
  .object({
    action: z.literal("request"),
    email: z.string().trim().email().max(254),
  })
  .strict();

const verifySchema = z
  .object({
    action: z.literal("verify"),
    email: z.string().trim().email().max(254),
    challengeId: z.string().min(24).max(128),
    code: z.string().regex(/^\d{6}$/u),
  })
  .strict();

const completeSchema = z
  .object({
    action: z.literal("complete"),
    email: z.string().trim().email().max(254),
    challengeId: z.string().min(24).max(128),
    resetToken: z.string().min(32).max(256),
    newPassword: z.string().min(12).max(128),
  })
  .strict();

const resetSchema = z.discriminatedUnion("action", [
  requestSchema,
  verifySchema,
  completeSchema,
]);

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

export async function POST(request: Request) {
  if (!isTrustedAdminMutation(request)) {
    return jsonResponse({ message: "Request could not be verified." }, 403);
  }
  if (!isAdminAuthConfigured()) {
    return jsonResponse(
      { message: "Admin password recovery is not configured." },
      503,
    );
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > MAX_REQUEST_BYTES) {
    return jsonResponse({ message: "Password reset request is invalid." }, 413);
  }

  let rawBody: unknown;
  try {
    const bodyText = await request.text();
    if (Buffer.byteLength(bodyText) > MAX_REQUEST_BYTES) {
      return jsonResponse(
        { message: "Password reset request is invalid." },
        413,
      );
    }
    rawBody = JSON.parse(bodyText);
  } catch {
    return jsonResponse({ message: "Password reset request is invalid." }, 400);
  }

  const parsedBody = resetSchema.safeParse(rawBody);
  if (!parsedBody.success) {
    return jsonResponse({ message: "Password reset request is invalid." }, 400);
  }

  const clientIdentifier = getAdminClientIdentifier(request);
  const body = parsedBody.data;

  if (body.action === "request") {
    if (getPasswordResetEmailConfigurationIssues().length) {
      return jsonResponse(
        { message: "Admin password recovery email is not configured." },
        503,
      );
    }

    const result = await requestAdminPasswordReset({
      clientIdentifier,
      email: body.email,
      deliverCode: sendAdminPasswordResetCode,
    });

    if (result.status === "rate-limited") {
      return jsonResponse(
        {
          message: "Too many recovery requests. Please wait before trying again.",
          retryAfterSeconds: result.retryAfterSeconds,
        },
        429,
        { "Retry-After": String(result.retryAfterSeconds) },
      );
    }
    return jsonResponse(
      {
        challengeId: result.challengeId,
        message: EMAIL_RESPONSE,
      },
      200,
    );
  }

  if (body.action === "verify") {
    const result = verifyAdminPasswordReset({
      clientIdentifier,
      email: body.email,
      challengeId: body.challengeId,
      code: body.code,
    });
    if (result.status !== "verified") {
      return jsonResponse({ message: INVALID_CODE_RESPONSE }, 400);
    }
    return jsonResponse({ resetToken: result.resetToken }, 200);
  }

  const result = await completeAdminPasswordReset({
    clientIdentifier,
    email: body.email,
    challengeId: body.challengeId,
    resetToken: body.resetToken,
    newPassword: body.newPassword,
  });
  if (result.status === "invalid") {
    return jsonResponse({ message: INVALID_RESET_RESPONSE }, 400);
  }
  if (result.status === "unavailable") {
    return jsonResponse(
      { message: "The new password could not be saved. Try again." },
      503,
    );
  }

  return jsonResponse(
    {
      success: true,
      message: "Password changed. Sign in with your new password.",
    },
    200,
  );
}
