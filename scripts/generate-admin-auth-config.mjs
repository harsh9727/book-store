import { randomBytes, scrypt as nodeScrypt } from "node:crypto";
import { promisify } from "node:util";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const scrypt = promisify(nodeScrypt);
const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function encodeBase32(buffer) {
  let bits = "";
  for (const byte of buffer) bits += byte.toString(2).padStart(8, "0");

  let encoded = "";
  for (let offset = 0; offset < bits.length; offset += 5) {
    encoded +=
      BASE32_ALPHABET[
        Number.parseInt(bits.slice(offset, offset + 5).padEnd(5, "0"), 2)
      ];
  }
  return encoded;
}

function readHidden(prompt) {
  if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
    throw new Error("Run this command in an interactive terminal.");
  }

  stdout.write(prompt);
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding("utf8");

  return new Promise((resolve, reject) => {
    let value = "";
    const onData = (character) => {
      if (character === "\u0003") {
        cleanup();
        reject(new Error("Setup cancelled."));
        return;
      }
      if (character === "\r" || character === "\n") {
        cleanup();
        stdout.write("\n");
        resolve(value);
        return;
      }
      if (character === "\u007f" || character === "\b") {
        if (value) {
          value = value.slice(0, -1);
          stdout.write("\b \b");
        }
        return;
      }
      if (character >= " ") {
        value += character;
        stdout.write("*");
      }
    };
    const cleanup = () => {
      stdin.off("data", onData);
      stdin.setRawMode(false);
      stdin.pause();
    };
    stdin.on("data", onData);
  });
}

const readline = createInterface({ input: stdin, output: stdout });

try {
  const email = (await readline.question("Admin email: ")).trim().toLowerCase();
  readline.close();
  if (!/^\S+@\S+\.\S+$/.test(email))
    throw new Error("Enter a valid admin email address.");

  const password = await readHidden("Admin password (minimum 12 characters): ");
  const confirmation = await readHidden("Confirm admin password: ");
  if (password.length < 12)
    throw new Error("Password must contain at least 12 characters.");
  if (password !== confirmation) throw new Error("Passwords do not match.");

  const salt = randomBytes(16);
  const derivedKey = await scrypt(password, salt, 64, {
    cost: 32_768,
    blockSize: 8,
    parallelization: 1,
    maxmem: 64 * 1024 * 1024,
  });
  const passwordHash = [
    "scrypt",
    32_768,
    8,
    1,
    salt.toString("base64url"),
    derivedKey.toString("base64url"),
  ].join("$");
  const totpSecret = encodeBase32(randomBytes(20));
  const issuer = "GTBS Book Store";
  const otpAuthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?secret=${totpSecret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;

  stdout.write(
    "\nCopy these values directly into the deployment secret manager; do not commit them:\n\n",
  );
  stdout.write(`ADMIN_EMAIL=${email}\n`);
  stdout.write(`ADMIN_PASSWORD_HASH=${passwordHash}\n`);
  stdout.write(
    `ADMIN_SESSION_SECRET=${randomBytes(48).toString("base64url")}\n`,
  );
  stdout.write("ADMIN_SESSION_VERSION=1\n");
  stdout.write("ADMIN_REQUIRE_MFA=true\n");
  stdout.write(`ADMIN_TOTP_SECRET=${totpSecret}\n\n`);
  stdout.write(`Authenticator setup URI:\n${otpAuthUrl}\n`);
} catch (error) {
  readline.close();
  process.stderr.write(
    `${error instanceof Error ? error.message : "Setup failed."}\n`,
  );
  process.exitCode = 1;
}
