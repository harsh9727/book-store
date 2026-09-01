import { z } from "zod";

import {
  isSafeRichTextHref,
  MAX_BLOG_CONTENT_CHARACTERS,
  MAX_BLOG_RICH_TEXT_JSON_CHARACTERS,
} from "./blogRichText.ts";
import type {
  BlogRichTextDocument,
  BlogRichTextNode,
} from "@/types/blog";

export const MAX_BLOG_DRAFT_BODY_BYTES = 256 * 1024;

const imageReferenceSchema = z
  .string()
  .trim()
  .min(1)
  .max(2_048)
  .refine((value) => {
    if (value.startsWith("/")) return true;
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  }, "Image must use a local path or an HTTPS URL.");

const optionalText = (maximum: number) => z.string().trim().max(maximum).optional();
const dateTextSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .refine((value) => !Number.isNaN(Date.parse(value)), "Date must be valid.");
const normalizeBlankString = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const richTextAttributeSchema = z.union([
  z.string().max(2_048),
  z.number().finite(),
  z.boolean(),
  z.null(),
]);
const richTextMarkSchema = z
  .object({
    type: z.enum(["bold", "italic", "underline", "strike", "code", "link"]),
    attrs: z.record(z.string(), richTextAttributeSchema).optional(),
  })
  .strict()
  .superRefine((mark, context) => {
    if (mark.type !== "link") return;
    const href = mark.attrs?.href;
    if (typeof href !== "string" || !isSafeRichTextHref(href)) {
      context.addIssue({
        code: "custom",
        message: "Rich-text links must use a safe web, email, phone, or local URL.",
        path: ["attrs", "href"],
      });
    }
  });
const richTextNodeSchema: z.ZodType<BlogRichTextNode> = z.lazy(() =>
  z
    .object({
      type: z.enum([
        "doc",
        "paragraph",
        "heading",
        "bulletList",
        "orderedList",
        "listItem",
        "blockquote",
        "codeBlock",
        "horizontalRule",
        "hardBreak",
        "text",
      ]),
      attrs: z.record(z.string(), richTextAttributeSchema).optional(),
      content: z.array(richTextNodeSchema).max(5_000).optional(),
      marks: z.array(richTextMarkSchema).max(20).optional(),
      text: z.string().max(MAX_BLOG_CONTENT_CHARACTERS).optional(),
    })
    .strict(),
);
const blogRichTextDocumentSchema = richTextNodeSchema
  .refine(
    (node): node is BlogRichTextDocument =>
      node.type === "doc" && Array.isArray(node.content),
    "Rich-text content must be a Tiptap document.",
  )
  .refine(
    (node) =>
      JSON.stringify(node).length <= MAX_BLOG_RICH_TEXT_JSON_CHARACTERS,
    "Rich-text content is too large.",
  );

const blogAuthorSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    role: z.string().trim().min(1).max(160),
    avatar: z.preprocess(
      (value) => {
        if (typeof value === "string" && value.trim() === "") return "/images/logo/logo.webp";
        return value;
      },
      imageReferenceSchema.optional().default("/images/logo/logo.webp")
    ),
    bio: z.string().trim().max(1_500).optional(),
  })
  .strict();

const blogContentSectionSchema = z
  .object({
    heading: optionalText(240),
    body: z.string().trim().min(1).max(20_000),
    subsections: z
      .array(
        z
          .object({
            subheading: z.string().trim().min(1).max(240),
            body: z.string().trim().min(1).max(10_000),
          })
          .strict()
      )
      .max(20)
      .optional(),
    quote: z
      .object({
        text: z.string().trim().min(1).max(2_000),
        author: z.string().trim().min(1).max(160),
      })
      .strict()
      .optional(),
    keyTakeaways: z.array(z.string().trim().min(1).max(500)).max(20).optional(),
  })
  .strict();

const blogCommentSchema = z
  .object({
    id: z.string().trim().min(1).max(100),
    name: z.string().trim().min(1).max(120),
    avatar: imageReferenceSchema.optional(),
    date: dateTextSchema,
    content: z.string().trim().min(1).max(4_000),
  })
  .strict();

const blogLocalizedAuthorSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    role: z.string().trim().min(1).max(160),
    bio: z.string().trim().max(1_500).optional(),
  })
  .strict();

const blogLocalizedContentSchema = z
  .object({
    title: z.string().trim().min(1).max(220),
    category: z.string().trim().min(1).max(100),
    summary: z.string().trim().min(1).max(2_000),
    author: blogLocalizedAuthorSchema,
    richContent: blogRichTextDocumentSchema.optional(),
    content: z.array(blogContentSectionSchema).min(1).max(50),
  })
  .strict();

const blogLocalizedDraftSchema = z
  .object({
    title: z.string().trim().min(1).max(220),
    category: z.string().trim().min(1).max(100),
    author: blogLocalizedAuthorSchema,
    contentText: z
      .string()
      .trim()
      .min(1)
      .max(MAX_BLOG_CONTENT_CHARACTERS),
    richContent: blogRichTextDocumentSchema.optional(),
  })
  .strict();

export const blogPostSchema = z
  .object({
    id: z.union([z.string().trim().min(1).max(100), z.number()]),
    title: z.string().trim().min(1).max(220),
    slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u).max(220),
    category: z.string().trim().min(1).max(100),
    date: dateTextSchema,
    image: imageReferenceSchema,
    imageKey: z.string().trim().min(1).max(500).optional(),
    summary: z.preprocess(
      (value) => normalizeBlankString(value),
      z.string().trim().max(2_000).optional().default("")
    ),
    author: blogAuthorSchema,
    tags: z.array(z.string().trim().min(1).max(100)).max(20).optional().default([]),
    richContent: blogRichTextDocumentSchema.optional(),
    content: z.array(blogContentSectionSchema).min(1).max(50),
    gujarati: blogLocalizedContentSchema.optional(),
    comments: z.array(blogCommentSchema).max(500).optional(),
  })
  .strict();

export const blogDraftSchema = z
  .object({
    title: z.string().trim().min(1).max(220),
    slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u).max(220),
    category: z.string().trim().min(1).max(100),
    date: dateTextSchema,
    image: imageReferenceSchema,
    imageKey: z.string().trim().min(1).max(500).optional(),
    summary: z.preprocess(
      (value) => normalizeBlankString(value),
      z.string().trim().max(2_000).optional().default("")
    ),
    author: blogAuthorSchema,
    tags: z.array(z.string().trim().min(1).max(100)).max(20).optional().default([]),
    contentText: z
      .string()
      .trim()
      .min(1)
      .max(MAX_BLOG_CONTENT_CHARACTERS),
    richContent: blogRichTextDocumentSchema.optional(),
    gujarati: blogLocalizedDraftSchema,
  })
  .strict();

export const galleryPhotoSchema = z
  .object({
    id: z.string().trim().min(1).max(100),
    url: imageReferenceSchema,
    key: z.string().trim().min(1).max(500).optional(),
    title: z.string().trim().min(1).max(220),
    caption: optionalText(1_000),
  })
  .strict();

const galleryLocalizedContentSchema = z
  .object({
    title: z.string().trim().min(1).max(220),
    category: z.string().trim().min(1).max(100),
    location: z.string().trim().min(1).max(240),
    description: z.string().trim().min(1).max(20_000),
    organizer: optionalText(240),
  })
  .strict();

export const galleryItemSchema = z
  .object({
    id: z.union([z.string().trim().min(1).max(100), z.number()]),
    slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u).max(220),
    title: z.string().trim().min(1).max(220),
    subtitle: optionalText(500),
    category: z.string().trim().min(1).max(100),
    date: z.string().trim().min(1).max(80),
    location: z.string().trim().min(1).max(240),
    coverImage: imageReferenceSchema,
    coverImageKey: z.string().trim().min(1).max(500).optional(),
    description: z.string().trim().min(1).max(20_000),
    organizer: optionalText(240),
    photos: z.array(galleryPhotoSchema).max(12),
    gujarati: galleryLocalizedContentSchema.optional(),
  })
  .strict();

export const galleryDraftSchema = galleryItemSchema
  .omit({ id: true, subtitle: true, gujarati: true })
  .extend({ gujarati: galleryLocalizedContentSchema });

export const contentStoreSchema = z
  .object({
    version: z.literal(1),
    blogs: z.array(blogPostSchema).max(2_000),
    galleries: z.array(galleryItemSchema).max(2_000),
  })
  .strict();

export type BlogDraft = z.infer<typeof blogDraftSchema>;
export type GalleryDraft = z.infer<typeof galleryDraftSchema>;
