import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import type { BlogPost } from "@/types/blog";
import type { GalleryItem } from "@/types/gallery";
import {
  blogDraftSchema,
  contentStoreSchema,
  galleryDraftSchema,
  type BlogDraft,
  type GalleryDraft,
} from "@/lib/contentValidation";

interface ContentStore {
  version: 1;
  blogs: BlogPost[];
  galleries: GalleryItem[];
}

const storageDirectory = path.join(process.cwd(), "storage");
const storagePath = path.join(storageDirectory, "content.json");
let mutationQueue: Promise<unknown> = Promise.resolve();

function seededStore(): ContentStore {
  return {
    version: 1,
    blogs: [],
    galleries: [],
  };
}

async function readStore(): Promise<ContentStore> {
  try {
    const raw = await readFile(storagePath, "utf8");
    return contentStoreSchema.parse(JSON.parse(raw)) as ContentStore;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return seededStore();
    throw error;
  }
}

async function writeStore(store: ContentStore) {
  await mkdir(storageDirectory, { recursive: true });
  const temporaryPath = path.join(storageDirectory, `content-${randomUUID()}.tmp`);
  await writeFile(temporaryPath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  await rename(temporaryPath, storagePath);
}

function mutateStore<T>(mutation: (store: ContentStore) => Promise<T> | T): Promise<T> {
  const operation = mutationQueue.then(async () => {
    const store = await readStore();
    const result = await mutation(store);
    await writeStore(store);
    return result;
  });
  mutationQueue = operation.catch(() => undefined);
  return operation;
}

function blogFromDraft(id: string, draft: BlogDraft, previous?: BlogPost): BlogPost {
  const parsed = blogDraftSchema.parse(draft);
  const paragraphs = parsed.contentText
    .split(/\n\s*\n/gu)
    .map((body) => body.trim())
    .filter(Boolean);
  const firstParagraph = paragraphs[0]?.replace(/\s+/gu, " ").trim() ?? "";
  const fallbackSummary = firstParagraph.slice(0, 200) || parsed.title;

  return {
    id,
    title: parsed.title,
    slug: parsed.slug,
    category: parsed.category,
    date: parsed.date,
    image: parsed.image,
    imageKey: parsed.imageKey,
    summary: parsed.summary?.trim() || fallbackSummary,
    author: {
      ...parsed.author,
      avatar: parsed.author.avatar || "/images/logo/logo.webp",
      bio: parsed.author.bio ?? "",
    },
    tags: parsed.tags ?? [],
    content: paragraphs.map((body) => ({ body })),
    ...(previous?.comments ? { comments: previous.comments } : {}),
  };
}

export async function getBlogs() {
  return (await readStore()).blogs;
}

export async function getBlog(identifier: string) {
  return (await getBlogs()).find(
    (blog) => String(blog.id) === identifier || blog.slug === identifier
  );
}

export function createBlog(draft: BlogDraft) {
  return mutateStore((store) => {
    if (store.blogs.some((blog) => blog.slug === draft.slug)) {
      throw new Error("A blog with this slug already exists.");
    }
    const blog = blogFromDraft(randomUUID(), draft);
    store.blogs.unshift(blog);
    return blog;
  });
}

export function updateBlog(id: string, draft: BlogDraft) {
  return mutateStore((store) => {
    const index = store.blogs.findIndex((blog) => String(blog.id) === id);
    if (index < 0) return null;
    if (store.blogs.some((blog, itemIndex) => itemIndex !== index && blog.slug === draft.slug)) {
      throw new Error("A blog with this slug already exists.");
    }
    const blog = blogFromDraft(String(store.blogs[index].id), draft, store.blogs[index]);
    store.blogs[index] = blog;
    return blog;
  });
}

export function deleteBlog(id: string) {
  return mutateStore((store) => {
    const index = store.blogs.findIndex((blog) => String(blog.id) === id);
    if (index < 0) return null;
    return store.blogs.splice(index, 1)[0];
  });
}

export async function getGalleries() {
  return (await readStore()).galleries;
}

export async function getGallery(identifier: string) {
  return (await getGalleries()).find(
    (gallery) => String(gallery.id) === identifier || gallery.slug === identifier
  );
}

export function createGallery(draft: GalleryDraft) {
  return mutateStore((store) => {
    const parsed = galleryDraftSchema.parse(draft);
    if (store.galleries.some((gallery) => gallery.slug === parsed.slug)) {
      throw new Error("A gallery with this slug already exists.");
    }
    const gallery: GalleryItem = { ...parsed, id: randomUUID() };
    store.galleries.unshift(gallery);
    return gallery;
  });
}

export function updateGallery(id: string, draft: GalleryDraft) {
  return mutateStore((store) => {
    const index = store.galleries.findIndex((gallery) => String(gallery.id) === id);
    if (index < 0) return null;
    const parsed = galleryDraftSchema.parse(draft);
    if (
      store.galleries.some(
        (gallery, itemIndex) => itemIndex !== index && gallery.slug === parsed.slug
      )
    ) {
      throw new Error("A gallery with this slug already exists.");
    }
    const gallery: GalleryItem = { ...parsed, id: String(store.galleries[index].id) };
    store.galleries[index] = gallery;
    return gallery;
  });
}

export function deleteGallery(id: string) {
  return mutateStore((store) => {
    const index = store.galleries.findIndex((gallery) => String(gallery.id) === id);
    if (index < 0) return null;
    return store.galleries.splice(index, 1)[0];
  });
}
