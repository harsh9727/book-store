import { createHash } from "node:crypto";

const WINDOW_MS = 15 * 60 * 1000;
const LOCKOUT_MS = 15 * 60 * 1000;
const MAX_CLIENT_FAILURES = 10;
const MAX_PAIR_FAILURES = 5;
const MAX_ENTRIES = 5_000;

interface AttemptRecord {
  failures: number;
  lockedUntil: number;
  windowStartedAt: number;
}

interface RateLimitStore {
  records: Map<string, AttemptRecord>;
  lastCleanupAt: number;
}

const globalWithRateLimit = globalThis as typeof globalThis & {
  gtbsAdminLoginRateLimit?: RateLimitStore;
};

const store =
  globalWithRateLimit.gtbsAdminLoginRateLimit ||
  { records: new Map<string, AttemptRecord>(), lastCleanupAt: 0 };
globalWithRateLimit.gtbsAdminLoginRateLimit = store;

function digest(value: string) {
  return createHash("sha256").update(value).digest("base64url");
}

function keys(clientIdentifier: string, email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return {
    client: `client:${clientIdentifier}`,
    pair: `pair:${digest(`${clientIdentifier}:${normalizedEmail}`)}`,
  };
}

function cleanup(now: number) {
  if (now - store.lastCleanupAt < WINDOW_MS && store.records.size < MAX_ENTRIES) return;

  for (const [key, record] of store.records) {
    if (record.lockedUntil <= now && now - record.windowStartedAt >= WINDOW_MS) {
      store.records.delete(key);
    }
  }
  if (store.records.size >= MAX_ENTRIES) store.records.clear();
  store.lastCleanupAt = now;
}

function getActiveRecord(key: string, now: number) {
  const record = store.records.get(key);
  if (!record) return null;
  if (record.lockedUntil <= now && now - record.windowStartedAt >= WINDOW_MS) {
    store.records.delete(key);
    return null;
  }
  return record;
}

export function getAdminLoginLimit(clientIdentifier: string, email: string, now = Date.now()) {
  cleanup(now);
  const loginKeys = keys(clientIdentifier, email);
  const records = [
    getActiveRecord(loginKeys.client, now),
    getActiveRecord(loginKeys.pair, now),
  ].filter((record): record is AttemptRecord => Boolean(record));
  const lockedUntil = Math.max(0, ...records.map((record) => record.lockedUntil));

  return {
    allowed: lockedUntil <= now,
    retryAfterSeconds: lockedUntil > now ? Math.ceil((lockedUntil - now) / 1_000) : 0,
  };
}

function addFailure(key: string, threshold: number, now: number) {
  const existing = getActiveRecord(key, now);
  const record = existing || { failures: 0, lockedUntil: 0, windowStartedAt: now };
  record.failures += 1;
  if (record.failures >= threshold) record.lockedUntil = now + LOCKOUT_MS;
  store.records.set(key, record);
}

export function recordAdminLoginFailure(
  clientIdentifier: string,
  email: string,
  now = Date.now()
) {
  cleanup(now);
  const loginKeys = keys(clientIdentifier, email);
  addFailure(loginKeys.client, MAX_CLIENT_FAILURES, now);
  addFailure(loginKeys.pair, MAX_PAIR_FAILURES, now);
  return getAdminLoginLimit(clientIdentifier, email, now);
}

export function clearAdminLoginFailures(clientIdentifier: string, email: string) {
  const loginKeys = keys(clientIdentifier, email);
  store.records.delete(loginKeys.client);
  store.records.delete(loginKeys.pair);
}

export function resetAdminLoginRateLimitForTests() {
  store.records.clear();
  store.lastCleanupAt = 0;
}
