import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { categories } from "../src/data/categories.ts";
import {
  addCartItem,
  markCartAsViewed,
} from "../src/lib/storefrontStorage.ts";
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

test("visible catalog links use the canonical All Products route", () => {
  const files = [
    path.join(root, "src", "components", "product", "LocalizedProductBreadcrumb.tsx"),
    path.join(root, "src", "app", "not-found.tsx"),
    path.join(root, "src", "app", "blogs", "[id]", "page.tsx"),
    path.join(root, "src", "app", "product", "layout.tsx"),
  ];

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    assert.doesNotMatch(source, /(?:href=|path:)\s*["']\/shop(?:[?"'])/);
  }

  const breadcrumb = readFileSync(files[0], "utf8");
  assert.match(breadcrumb, /label: usesStoredGujarati \? .+ : "Products"/);
  assert.match(breadcrumb, /href: "\/allproducts"/);
  assert.match(
    breadcrumb,
    /href: `\/allproducts\?category=\$\{product\.category\}`/,
  );
});

test("Product detail thumbnails render horizontally below the main image", () => {
  const source = readFileSync(
    path.join(root, "src", "components", "product", "ProductImages.tsx"),
    "utf8",
  );
  const mainImagePosition = source.indexOf("{/* Main Image Stage */}");
  const thumbnailPosition = source.indexOf("{/* Horizontal Thumbnails */}");

  assert.notEqual(mainImagePosition, -1);
  assert.notEqual(thumbnailPosition, -1);
  assert.equal(mainImagePosition < thumbnailPosition, true);
  assert.match(source, /relative aspect-square w-full/);
  assert.match(source, /flex max-w-full gap-3 overflow-x-auto pb-2/);
  assert.match(source, /relative h-20 w-20 shrink-0/);
  assert.doesNotMatch(source, /aspect-\[3\/4\]|h-20 w-16|h-16 w-16/);
  assert.doesNotMatch(source, /md:flex-col/);
});

test("Product detail purchase controls remain compact and balanced", () => {
  const source = readFileSync(
    path.join(root, "src", "components", "product", "ProductInfo.tsx"),
    "utf8",
  );

  assert.match(source, /mt-7 flex flex-col gap-3 sm:flex-row/);
  assert.match(source, /grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto/);
  assert.match(source, /h-11 w-28/);
  assert.match(source, /sm:min-w-36/);
  assert.match(source, /sm:min-w-32/);
  assert.doesNotMatch(source, /sm:grid-cols-\[128px_minmax/);
});

test("Header Categories controls use route-independent styling", () => {
  const source = readFileSync(
    path.join(root, "src", "components", "layout", "Header.tsx"),
    "utf8",
  );

  assert.doesNotMatch(source, /isCategoryActive/);
  assert.match(
    source,
    /isCategoryMenuOpen\s*\? "border-orange-500 bg-orange-500 text-white"/,
  );
  assert.match(
    source,
    /isMobileCategoriesOpen\s*\? "bg-orange-500 text-white"/,
  );
  assert.match(source, /aria-expanded=\{isCategoryMenuOpen\}/);
  assert.match(source, /aria-expanded=\{isMobileCategoriesOpen\}/);
});

test("Gujarati home hero uses a bounded compact desktop layout", () => {
  const source = readFileSync(
    path.join(root, "src", "components", "home", "HeroSection.tsx"),
    "utf8",
  );
  const globalStyles = readFileSync(
    path.join(root, "src", "app", "globals.css"),
    "utf8",
  );

  assert.doesNotMatch(source, /"use client"|useLanguage/);
  assert.match(source, /home-hero-heading-group flex flex-col items-start gap-6/);
  assert.match(globalStyles, /html\[lang="gu"\] \.home-hero-heading-group \{\s*gap: 0\.5rem;/);
  assert.match(globalStyles, /html\[lang="gu"\] \.home-hero-description \{\s*margin-top: 0\.75rem;/);
  assert.match(globalStyles, /html\[lang="gu"\] \.home-hero-actions \{\s*margin-top: 1\.5rem;/);
  assert.match(globalStyles, /height: 420px;\s*min-height: 0;/);
});

test("Contact phone numbers stay on one untranslated line", () => {
  const source = readFileSync(
    path.join(root, "src", "components", "contact", "ContactSection.tsx"),
    "utf8",
  );

  assert.match(source, /flex flex-nowrap items-center gap-3/);
  assert.equal((source.match(/notranslate whitespace-nowrap|notranslate mt-1 whitespace-nowrap/g) || []).length, 2);
  assert.equal((source.match(/translate="no"/g) || []).length, 2);
  assert.equal((source.match(/dir="ltr"/g) || []).length, 2);
});

test("Admin Product variants use individual option inputs", () => {
  const source = readFileSync(
    path.join(
      root,
      "src",
      "components",
      "admin",
      "product",
      "AdminProductForm.tsx",
    ),
    "utf8",
  );

  assert.doesNotMatch(source, /Options, one per line/);
  assert.match(source, />\s*Add option\s*</);
  assert.match(source, /aria-label=\{`Remove option /);
  assert.match(source, /\{ name: "", options: \[""\] \}/);
  assert.match(source, /getCollectionError\(/);
  assert.doesNotMatch(source, /focus:border-orange-500|focus:ring-2 focus:ring-orange/);
  assert.match(source, /admin-product-input/);

  const globalStyles = readFileSync(
    path.join(root, "src", "app", "globals.css"),
    "utf8",
  );
  assert.match(
    globalStyles,
    /\.admin-product-input:focus-visible\s*\{\s*outline: none;/,
  );
});

test("Admin Product specifications use grouped individual value inputs", () => {
  const source = readFileSync(
    path.join(
      root,
      "src",
      "components",
      "admin",
      "product",
      "AdminProductForm.tsx",
    ),
    "utf8",
  );

  assert.match(source, />\s*Specification name\s*<input/);
  assert.match(source, />\s*Values\s*</);
  assert.match(source, />\s*Add value\s*</);
  assert.match(source, /aria-label=\{`Remove value /);
  assert.match(source, /flattenSpecifications\(specifications\)/);
  assert.match(source, /\{ name: "", values: \[""\] \}/);
});

test("Admin Product features use individual addable and removable inputs", () => {
  const source = readFileSync(
    path.join(
      root,
      "src",
      "components",
      "admin",
      "product",
      "AdminProductForm.tsx",
    ),
    "utf8",
  );

  assert.doesNotMatch(
    source,
    /Features, one per line|Gujarati features, one per line/,
  );
  assert.match(source, /aria-label=\{`Add another feature after /);
  assert.match(source, /aria-label=\{`Remove feature /);
  assert.match(source, /normalizeFeatures\(features\)/);
  assert.match(source, /normalizeFeatures\(gujaratiFeatures\)/);
});

test("Admin Category CRUD uses English then Gujarati final submission", () => {
  const categoryManager = readFileSync(
    path.join(
      root,
      "src",
      "components",
      "admin",
      "category",
      "AdminCategoryManager.tsx",
    ),
    "utf8",
  );
  const productForm = readFileSync(
    path.join(
      root,
      "src",
      "components",
      "admin",
      "product",
      "AdminProductForm.tsx",
    ),
    "utf8",
  );

  assert.match(categoryManager, /AdminBilingualFormSteps/);
  assert.match(categoryManager, /useState<AdminContentLanguage>\("en"\)/);
  assert.match(categoryManager, /formLanguage === "en"[\s\S]+setFormLanguage\("gu"\)[\s\S]+return;/);
  assert.match(categoryManager, /name="gujaratiName"/);
  assert.match(categoryManager, /const payload = \{ name, gujarati: \{ name: gujaratiName \} \}/);
  assert.match(categoryManager, /formLanguage === "en"[\s\S]+\? "Next"/);
  assert.match(categoryManager, /flex-col-reverse gap-2 sm:flex-row/);
  assert.match(categoryManager, /whitespace-nowrap[^"]+sm:w-\[118px\]/);
  assert.match(categoryManager, /type="submit"/);
  assert.match(productForm, /categoryCreatorLanguage === "en"/);
  assert.match(productForm, /\{ name, gujarati: \{ name: gujaratiName \} \}/);
});

test("Admin navigation lives in the persistent route layout", () => {
  const layout = readFileSync(
    path.join(root, "src", "app", "admin", "layout.tsx"),
    "utf8",
  );
  const panelShell = readFileSync(
    path.join(root, "src", "components", "admin", "AdminPanelShell.tsx"),
    "utf8",
  );
  const contentShell = readFileSync(
    path.join(root, "src", "components", "admin", "AdminContentShell.tsx"),
    "utf8",
  );

  assert.match(layout, /<AdminPanelShell>\{children\}<\/AdminPanelShell>/);
  assert.match(panelShell, /usePathname\(\)/);
  assert.match(panelShell, /<aside /);
  assert.match(panelShell, /pathname\.startsWith\(`\$\{href\}\/`\)/);
  assert.doesNotMatch(panelShell, /window\.location|location\.href/);
  assert.doesNotMatch(contentShell, /<aside |Admin navigation|min-h-screen/);
});

test("Admin CRUD leaves content identifiers to the backend", () => {
  const adminComponentRoot = path.join(root, "src", "components", "admin");
  const formFiles = [
    ["blog", "AdminBlogForm.tsx"],
    ["gallery", "AdminGalleryForm.tsx"],
    ["product", "AdminProductForm.tsx"],
    ["category", "AdminCategoryManager.tsx"],
  ].map((segments) => path.join(adminComponentRoot, ...segments));

  for (const file of formFiles) {
    const source = readFileSync(file, "utf8");
    assert.doesNotMatch(source, /name=["']slug["']|>\s*Slug\s*</);
  }

  const clientHelpers = readFileSync(
    path.join(root, "src", "lib", "adminContentClient.ts"),
    "utf8",
  );
  assert.doesNotMatch(clientHelpers, /export function slugify/);
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

test("homepage Magazines use only the canonical admin Product category", () => {
  const homeSource = readFileSync(path.join(root, "src", "app", "page.tsx"), "utf8");
  const magazineSource = readFileSync(
    path.join(root, "src", "components", "home", "Magazines.tsx"),
    "utf8",
  );

  assert.equal(
    categories.some(
      (category) =>
        category.slug === "magazines" && category.name === "Magazines",
    ),
    true,
  );
  assert.match(homeSource, /product\.category === "magazines"/);
  assert.doesNotMatch(
    magazineSource,
    /fallbackMagazines|DefaultMagazineCover|Faith & Life Magazine|Christian Living Digest|The Good News Monthly/,
  );
  assert.doesNotMatch(magazineSource, /return null/);
  assert.match(
    magazineSource,
    /No products are currently assigned to this collection\./,
  );
});

test("cart notification is unread after adding and acknowledged after viewing", () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const storedValues = new Map<string, string>();
  const browserWindow = new EventTarget() as EventTarget & {
    localStorage: Pick<Storage, "getItem" | "setItem">;
  };
  browserWindow.localStorage = {
    getItem: (key) => storedValues.get(key) ?? null,
    setItem: (key, value) => storedValues.set(key, value),
  };

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: browserWindow,
  });

  try {
    assert.equal(
      addCartItem({
        productId: "notification-test",
        title: "Notification test product",
        price: 100,
        image: "/images/products/book-placeholder.svg",
      }),
      true,
    );
    assert.equal(storedValues.get("gtbs-cart-notification-v1"), "1");

    assert.equal(markCartAsViewed(), true);
    assert.equal(storedValues.get("gtbs-cart-notification-v1"), "0");
  } finally {
    if (originalWindow) {
      Object.defineProperty(globalThis, "window", originalWindow);
    } else {
      Reflect.deleteProperty(globalThis, "window");
    }
  }
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
