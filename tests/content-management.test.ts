import assert from "node:assert/strict";
import test from "node:test";

import { blogs } from "../src/data/blogs.ts";
import { galleries } from "../src/data/galleries.ts";
import { blogDraftSchema, contentStoreSchema, galleryDraftSchema } from "../src/lib/contentValidation.ts";
import { MAX_GALLERY_PHOTOS, MAX_IMAGE_BYTES, validateImageSelection } from "../src/lib/imageRules.ts";

const blogDraft = {
  title: "A valid article",
  slug: "a-valid-article",
  category: "News",
  date: "2026-09-01",
  readTime: "5 min read",
  image: "https://example.com/banner.webp",
  summary: "A useful summary.",
  author: {
    name: "GTBS Editorial Team",
    role: "Editor",
    avatar: "/images/logo/logo.webp",
    bio: "",
  },
  tags: ["News"],
  contentText: "Article body.",
};

const galleryDraft = {
  slug: "community-event",
  title: "Community event",
  category: "Events",
  date: "2026-09-01",
  location: "Ahmedabad",
  coverImage: "https://example.com/cover.webp",
  description: "Event description.",
  tags: ["Community"],
  photos: [],
};

test("accepts valid blog and gallery drafts", () => {
  assert.equal(blogDraftSchema.safeParse(blogDraft).success, true);
  assert.equal(galleryDraftSchema.safeParse(galleryDraft).success, true);
});

test("accepts the complete seeded content store", () => {
  assert.equal(
    contentStoreSchema.safeParse({ version: 1, blogs, galleries }).success,
    true
  );
});

test("rejects invalid slugs and dates", () => {
  assert.equal(blogDraftSchema.safeParse({ ...blogDraft, slug: "Bad Slug" }).success, false);
  assert.equal(blogDraftSchema.safeParse({ ...blogDraft, date: "not-a-date" }).success, false);
});

test("rejects more than twelve gallery photos", () => {
  const photos = Array.from({ length: MAX_GALLERY_PHOTOS + 1 }, (_, index) => ({
    id: String(index),
    url: `https://example.com/${index}.webp`,
    title: `Photo ${index}`,
  }));
  assert.equal(galleryDraftSchema.safeParse({ ...galleryDraft, photos }).success, false);
});

test("enforces image type and 500 KB selection limit", () => {
  assert.equal(
    validateImageSelection({ type: "image/jpeg", size: MAX_IMAGE_BYTES } as File),
    null
  );
  assert.match(
    validateImageSelection({ type: "image/jpeg", size: MAX_IMAGE_BYTES + 1 } as File) || "",
    /500 KB/u
  );
  assert.match(
    validateImageSelection({ type: "image/svg+xml", size: 100 } as File) || "",
    /Only JPG/u
  );
});
