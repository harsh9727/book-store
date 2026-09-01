import assert from "node:assert/strict";
import test from "node:test";

import { galleries } from "../src/data/galleries.ts";
import {
  blogDraftSchema,
  contentStoreSchema,
  galleryDraftSchema,
  MAX_BLOG_DRAFT_BODY_BYTES,
} from "../src/lib/contentValidation.ts";
import { MAX_GALLERY_PHOTOS, MAX_IMAGE_BYTES, validateImageSelection } from "../src/lib/imageRules.ts";
import { localizeBlog } from "../src/lib/localizedBlog.ts";
import { JsonBodyError, readBoundedJson } from "../src/lib/boundedJson.ts";
import type { BlogPost } from "../src/types/blog.ts";

const blogDraft = {
  title: "A valid article",
  slug: "a-valid-article",
  category: "News",
  date: "2026-09-01",
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
  gujarati: {
    title: "માન્ય લેખ",
    category: "સમાચાર",
    author: {
      name: "જીટીબીએસ સંપાદકીય ટીમ",
      role: "સંપાદક",
      bio: "",
    },
    contentText: "લેખનું લખાણ.",
  },
};

const richContent = {
  type: "doc" as const,
  content: [
    {
      type: "heading" as const,
      attrs: { level: 2 },
      content: [{ type: "text" as const, text: "A useful heading" }],
    },
    {
      type: "paragraph" as const,
      content: [
        {
          type: "text" as const,
          text: "Formatted article body.",
          marks: [{ type: "bold" as const }],
        },
      ],
    },
  ],
};

const galleryDraft = {
  slug: "community-event",
  title: "Community event",
  category: "Events",
  date: "2026-09-01",
  location: "Ahmedabad",
  coverImage: "https://example.com/cover.webp",
  description: "Event description.",
  subtitle: "Community story and photo showcase",
  organizer: "GTBS Community Team",
  photos: [],
};

test("accepts valid blog and gallery drafts", () => {
  assert.equal(blogDraftSchema.safeParse(blogDraft).success, true);
  assert.equal(galleryDraftSchema.safeParse(galleryDraft).success, true);
});

test("requires complete Gujarati fields on blog drafts", () => {
  assert.equal(
    blogDraftSchema.safeParse({ ...blogDraft, gujarati: undefined }).success,
    false,
  );
  assert.equal(
    blogDraftSchema.safeParse({
      ...blogDraft,
      gujarati: { ...blogDraft.gujarati, contentText: "" },
    }).success,
    false,
  );
});

test("allows the bounded bilingual Blog body above the default JSON limit", async () => {
  const payload = JSON.stringify({ value: "x".repeat(140 * 1024) });
  const makeRequest = () =>
    new Request("https://example.com/api/admin/content/blogs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
    });

  await assert.rejects(
    () => readBoundedJson(makeRequest()),
    (error: unknown) =>
      error instanceof JsonBodyError && error.status === 413,
  );
  assert.deepEqual(
    await readBoundedJson(makeRequest(), MAX_BLOG_DRAFT_BODY_BYTES),
    JSON.parse(payload),
  );
});

test("selects stored Gujarati blog content without changing shared fields", () => {
  const storedBlog: BlogPost = {
    id: "blog-1",
    title: blogDraft.title,
    slug: blogDraft.slug,
    category: blogDraft.category,
    date: blogDraft.date,
    image: blogDraft.image,
    summary: blogDraft.summary,
    author: blogDraft.author,
    content: [{ body: blogDraft.contentText }],
    gujarati: {
      title: blogDraft.gujarati.title,
      category: blogDraft.gujarati.category,
      summary: blogDraft.gujarati.contentText,
      author: blogDraft.gujarati.author,
      content: [{ body: blogDraft.gujarati.contentText }],
    },
  };

  const localized = localizeBlog(storedBlog, "gu");
  assert.equal(localized.title, "માન્ય લેખ");
  assert.equal(localized.category, "સમાચાર");
  assert.equal(localized.content[0]?.body, "લેખનું લખાણ.");
  assert.equal(localized.slug, storedBlog.slug);
  assert.equal(localizeBlog(storedBlog, "en"), storedBlog);
});

test("accepts allow-listed Tiptap JSON and rejects unsafe rich content", () => {
  assert.equal(
    blogDraftSchema.safeParse({ ...blogDraft, richContent }).success,
    true,
  );
  assert.equal(
    blogDraftSchema.safeParse({
      ...blogDraft,
      gujarati: { ...blogDraft.gujarati, richContent },
    }).success,
    true,
  );

  const unsafeLink = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Unsafe link",
            marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }],
          },
        ],
      },
    ],
  };
  assert.equal(
    blogDraftSchema.safeParse({ ...blogDraft, richContent: unsafeLink })
      .success,
    false,
  );
  assert.equal(
    blogDraftSchema.safeParse({
      ...blogDraft,
      gujarati: { ...blogDraft.gujarati, richContent: unsafeLink },
    }).success,
    false,
  );
  assert.equal(
    blogDraftSchema.safeParse({
      ...blogDraft,
      richContent: { type: "doc", content: [{ type: "iframe" }] },
    }).success,
    false,
  );
});

test("accepts blog drafts without tags or author bio", () => {
  const draftWithoutCrudFields = {
    ...blogDraft,
    tags: undefined,
    author: {
      ...blogDraft.author,
      bio: undefined,
    },
  };

  assert.equal(blogDraftSchema.safeParse(draftWithoutCrudFields).success, true);
});

test("accepts blog drafts without explicit summary or author avatar", () => {
  const draftWithoutSummaryOrAvatar = {
    ...blogDraft,
    summary: undefined,
    author: {
      ...blogDraft.author,
      avatar: undefined,
    },
  };

  assert.equal(blogDraftSchema.safeParse(draftWithoutSummaryOrAvatar).success, true);
});

test("accepts blank summary and avatar strings and normalizes them to defaults", () => {
  const blankValuesDraft = {
    ...blogDraft,
    summary: "",
    author: {
      ...blogDraft.author,
      avatar: "",
    },
  };

  const parsed = blogDraftSchema.safeParse(blankValuesDraft);
  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.summary, "");
    assert.equal(parsed.data.author.avatar, "/images/logo/logo.webp");
  }
});

test("accepts an empty blog and gallery store without any committed fallback data", () => {
  assert.deepEqual(galleries, []);
  assert.equal(contentStoreSchema.safeParse({ version: 1, blogs: [], galleries }).success, true);
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
