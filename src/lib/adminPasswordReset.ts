import {
  createHmac,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from "node:crypto";

import { replaceAdminPassword } from "./adminAuth.ts";

const OTP_LIFETIME_MS = 10 * 60 * 1_000;
const RESET_TOKEN_LIFETIME_MS = 10 * 60 * 1_000;
const REQUEST_WINDOW_MS = 15 * 60 * 1_000;
const REQUEST_COOLDOWN_MS = 60 * 1_000;
const MAX_PAIR_REQUESTS = 3;
const MAX_CLIENT_REQUESTS = 10;
const MAX_OTP_ATTEMPTS = 5;
const MAX_STORE_ENTRIES = 1_000;

interface ResetChallenge {
  clientIdentifier: string;
  emailDigest: string;
  otpDigest: string;
  otpExpiresAt: number;
  attempts: number;
  resetTokenDigest?: string;
  resetTokenExpiresAt?: number;
  completing: boolean;
}

interface RequestRecord {
  attempts: number;
  lastAttemptAt: number;
  windowStartedAt: number;
}

interface PasswordResetStore {
  challenges: Map<string, ResetChallenge>;
  requests: Map<string, RequestRecord>;
  lastCleanupAt: number;
}

const globalWithPasswordReset = globalThis as typeof globalThis & {
  gtbsAdminPasswordReset?: PasswordResetStore;
};

const store = globalWithPasswordReset.gtbsAdminPasswordReset || {
  challenges: new Map<string, ResetChallenge>(),
  requests: new Map<string, RequestRecord>(),
  lastCleanupAt: 0,
};
globalWithPasswordReset.gtbsAdminPasswordReset = store;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function resetSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || "";
}

function digest(value: string) {
  return createHmac("sha256", resetSecret())
    .update(`admin-password-reset:${value}`)
    .digest("base64url");
}

function safeCompare(left: string, right: string) {
  const leftDigest = Buffer.from(digest(left));
  const rightDigest = Buffer.from(digest(right));
  return timingSafeEqual(leftDigest, rightDigest);
}

function cleanup(now: number) {
  if (
    now - store.lastCleanupAt < REQUEST_WINDOW_MS &&
    store.challenges.size + store.requests.size < MAX_STORE_ENTRIES
  ) {
    return;
  }

  for (const [challengeId, challenge] of store.challenges) {
    const expiresAt = challenge.resetTokenExpiresAt ?? challenge.otpExpiresAt;
    if (expiresAt <= now) store.challenges.delete(challengeId);
  }
  for (const [key, record] of store.requests) {
    if (now - record.windowStartedAt >= REQUEST_WINDOW_MS) {
      store.requests.delete(key);
    }
  }
  if (store.challenges.size + store.requests.size >= MAX_STORE_ENTRIES) {
    store.challenges.clear();
    store.requests.clear();
  }
  store.lastCleanupAt = now;
}

function requestKeys(clientIdentifier: string, email: string) {
  return {
    client: `client:${digest(clientIdentifier)}`,
    pair: `pair:${digest(`${clientIdentifier}:${normalizeEmail(email)}`)}`,
  };
}

function activeRequestRecord(key: string, now: number) {
  const record = store.requests.get(key);
  if (!record) return null;
  if (now - record.windowStartedAt >= REQUEST_WINDOW_MS) {
    store.requests.delete(key);
    return null;
  }
  return record;
}

function getRequestLimit(clientIdentifier: string, email: string, now: number) {
  cleanup(now);
  const keys = requestKeys(clientIdentifier, email);
  const clientRecord = activeRequestRecord(keys.client, now);
  const pairRecord = activeRequestRecord(keys.pair, now);
  const retryTimes = [
    clientRecord && clientRecord.attempts >= MAX_CLIENT_REQUESTS
      ? clientRecord.windowStartedAt + REQUEST_WINDOW_MS
      : 0,
    pairRecord && pairRecord.attempts >= MAX_PAIR_REQUESTS
      ? pairRecord.windowStartedAt + REQUEST_WINDOW_MS
      : 0,
    pairRecord ? pairRecord.lastAttemptAt + REQUEST_COOLDOWN_MS : 0,
  ];
  const retryAt = Math.max(...retryTimes);

  return {
    allowed: retryAt <= now,
    retryAfterSeconds:
      retryAt > now ? Math.max(1, Math.ceil((retryAt - now) / 1_000)) : 0,
    keys,
  };
}

function recordRequest(key: string, now: number) {
  const current = activeRequestRecord(key, now);
  store.requests.set(key, {
    attempts: (current?.attempts ?? 0) + 1,
    lastAttemptAt: now,
    windowStartedAt: current?.windowStartedAt ?? now,
  });
}

export async function requestAdminPasswordReset({
  clientIdentifier,
  email,
  deliverCode,
  now = Date.now(),
}: {
  clientIdentifier: string;
  email: string;
  deliverCode: (email: string, code: string) => Promise<void>;
  now?: number;
}) {
  const limit = getRequestLimit(clientIdentifier, email, now);
  if (!limit.allowed) {
    return {
      status: "rate-limited" as const,
      retryAfterSeconds: limit.retryAfterSeconds,
    };
  }

  recordRequest(limit.keys.client, now);
  recordRequest(limit.keys.pair, now);

  const normalizedEmail = normalizeEmail(email);
  const challengeId = randomBytes(24).toString("base64url");
  const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
  store.challenges.set(challengeId, {
    clientIdentifier,
    emailDigest: digest(normalizedEmail),
    otpDigest: digest(`${challengeId}:${code}`),
    otpExpiresAt: now + OTP_LIFETIME_MS,
    attempts: 0,
    completing: false,
  });

  if (
    safeCompare(normalizedEmail, normalizeEmail(process.env.ADMIN_EMAIL || ""))
  ) {
    try {
      await deliverCode(normalizedEmail, code);
    } catch {
      store.challenges.delete(challengeId);
    }
  }

  return { status: "created" as const, challengeId };
}

export function verifyAdminPasswordReset({
  clientIdentifier,
  email,
  challengeId,
  code,
  now = Date.now(),
}: {
  clientIdentifier: string;
  email: string;
  challengeId: string;
  code: string;
  now?: number;
}) {
  cleanup(now);
  const challenge = store.challenges.get(challengeId);
  if (
    !challenge ||
    challenge.clientIdentifier !== clientIdentifier ||
    challenge.otpExpiresAt <= now ||
    challenge.resetTokenDigest ||
    !safeCompare(challenge.emailDigest, digest(normalizeEmail(email)))
  ) {
    if (challenge?.otpExpiresAt && challenge.otpExpiresAt <= now) {
      store.challenges.delete(challengeId);
    }
    return { status: "invalid" as const };
  }

  challenge.attempts += 1;
  if (!safeCompare(challenge.otpDigest, digest(`${challengeId}:${code}`))) {
    if (challenge.attempts >= MAX_OTP_ATTEMPTS) {
      store.challenges.delete(challengeId);
    }
    return { status: "invalid" as const };
  }

  const resetToken = randomBytes(32).toString("base64url");
  challenge.resetTokenDigest = digest(`${challengeId}:${resetToken}`);
  challenge.resetTokenExpiresAt = now + RESET_TOKEN_LIFETIME_MS;
  challenge.otpDigest = "";

  return { status: "verified" as const, resetToken };
}

export async function completeAdminPasswordReset({
  clientIdentifier,
  email,
  challengeId,
  resetToken,
  newPassword,
  now = Date.now(),
}: {
  clientIdentifier: string;
  email: string;
  challengeId: string;
  resetToken: string;
  newPassword: string;
  now?: number;
}) {
  cleanup(now);
  const challenge = store.challenges.get(challengeId);
  if (
    !challenge ||
    challenge.clientIdentifier !== clientIdentifier ||
    !challenge.resetTokenDigest ||
    !challenge.resetTokenExpiresAt ||
    challenge.resetTokenExpiresAt <= now ||
    challenge.completing ||
    !safeCompare(challenge.emailDigest, digest(normalizeEmail(email))) ||
    !safeCompare(
      challenge.resetTokenDigest,
      digest(`${challengeId}:${resetToken}`),
    )
  ) {
    return { status: "invalid" as const };
  }

  challenge.completing = true;
  try {
    await replaceAdminPassword(newPassword);
    store.challenges.delete(challengeId);
    return { status: "complete" as const };
  } catch {
    challenge.completing = false;
    return { status: "unavailable" as const };
  }
}

export function resetAdminPasswordResetStateForTests() {
  store.challenges.clear();
  store.requests.clear();
  store.lastCleanupAt = 0;
}
