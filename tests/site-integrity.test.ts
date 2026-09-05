import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { createWhatsAppOrderUrl } from "../src/lib/whatsappOrder.ts";

const root = process.cwd();

function walk(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const item = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(item) : [item];
  });
}

const sourceFiles = walk(path.join(root, "src")).filter((file) =>
  /\.(?:ts|tsx|css)$/.test(file),
);

test("all literal public image references resolve to existing files", () => {
  const missing: string[] = [];

  for (const file of sourceFiles) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/["'`](\/images\/[A-Za-z0-9_./ -]+)["'`]/g)) {
      const publicFile = path.join(root, "public", match[1]);
      if (!existsSync(publicFile)) {
        missing.push(`${path.relative(root, file)} -> ${match[1]}`);
      }
    }
  }

  assert.deepEqual(missing, []);
});

test("literal internal links target an App Router page", () => {
  const routePatterns = walk(path.join(root, "src", "app"))
    .filter((file) => path.basename(file) === "page.tsx")
    .map((file) => {
      const route = path
        .relative(path.join(root, "src", "app"), path.dirname(file))
        .split(path.sep)
        .filter((segment) => !/^\(.+\)$/.test(segment))
        .map((segment) => (segment.startsWith("[") ? "[^/]+" : segment))
        .join("/");
      return new RegExp(`^/${route}$`.replace("//$", "/$"));
    });
  const broken: string[] = [];
  const hrefPattern = /(?:href\s*=\s*|href:\s*)["'](\/[A-Za-z0-9_./?=&%#-]*)["']/g;

  for (const file of sourceFiles) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(hrefPattern)) {
      const pathname = match[1].split(/[?#]/, 1)[0] || "/";
      if (!routePatterns.some((pattern) => pattern.test(pathname))) {
        broken.push(`${path.relative(root, file)} -> ${match[1]}`);
      }
    }
  }

  assert.deepEqual(broken, []);
});

test("client modules do not reference server-only secrets", () => {
  const exposed: string[] = [];
  const serverOnlyName =
    /process\.env\.(?:ADMIN_[A-Z0-9_]+|UPLOADTHING_TOKEN)/g;

  for (const file of sourceFiles.filter((item) => item.endsWith(".tsx"))) {
    const source = readFileSync(file, "utf8");
    if (!/^\s*["']use client["'];/.test(source)) continue;
    if (serverOnlyName.test(source)) exposed.push(path.relative(root, file));
    serverOnlyName.lastIndex = 0;
  }

  assert.deepEqual(exposed, []);
});

test("single-Product WhatsApp orders include greeting, quantity, details, and link", () => {
  const url = new URL(
    createWhatsAppOrderUrl([
      {
        title: "Gujarati Study Bible",
        quantity: 3,
        unitPrice: 250,
        variantSummary: "Edition: Hardcover",
        productUrl: "https://example.com/product/gujarati-study-bible",
      },
    ]),
  );
  const message = url.searchParams.get("text") || "";

  assert.equal(url.hostname, "wa.me");
  assert.match(message, /Hello GTBS Book Store!/);
  assert.match(message, /Gujarati Study Bible/);
  assert.match(message, /Quantity: 3/);
  assert.match(message, /Details: Edition: Hardcover/);
  assert.match(message, /https:\/\/example\.com\/product\/gujarati-study-bible/);
});

test("multi-Product WhatsApp orders include every line and the aggregate total", () => {
  const url = new URL(
    createWhatsAppOrderUrl(
      [
        {
          title: "Product One",
          quantity: 1,
          unitPrice: 100,
          productUrl: "https://example.com/product/one",
        },
        {
          title: "Product Two",
          quantity: 2,
          unitPrice: 200,
          productUrl: "https://example.com/product/two",
        },
      ],
      500,
    ),
  );
  const message = url.searchParams.get("text") || "";

  assert.match(message, /1\. Product One/);
  assert.match(message, /2\. Product Two/);
  assert.match(message, /Quantity: 2/);
  assert.match(message, /Total:/);
  assert.match(message, /confirm availability, delivery, and payment details/i);
});
