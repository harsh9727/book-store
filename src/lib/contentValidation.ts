import { z } from "zod";

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
    content: z.array(blogContentSectionSchema).min(1).max(50),
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
    contentText: z.string().trim().min(1).max(40_000),
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
  })
  .strict();

export const galleryDraftSchema = galleryItemSchema.omit({ id: true });

export const contentStoreSchema = z
  .object({
    version: z.literal(1),
    blogs: z.array(blogPostSchema).max(2_000),
    galleries: z.array(galleryItemSchema).max(2_000),
  })
  .strict();

export type BlogDraft = z.infer<typeof blogDraftSchema>;
export type GalleryDraft = z.infer<typeof galleryDraftSchema>;
