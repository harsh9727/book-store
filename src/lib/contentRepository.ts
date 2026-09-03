import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import type { BlogPost } from "@/types/blog";
import type { Category } from "@/types/category";
import type { GalleryItem } from "@/types/gallery";
import type { Product } from "@/types/product";
import type { Testimonial } from "@/types/testimonial";
import { categories as seededCategories } from "@/data/categories";
import { products as seededProducts } from "@/data/products";
import { testimonials as seededTestimonials } from "@/data/testimonials";
import { plainTextToBlogRichText } from "@/lib/blogRichText";
import { hasInitializedCatalog } from "@/lib/catalogMigration";
import {
  blogDraftSchema,
  categoryDraftSchema,
  contentStoreSchema,
  galleryDraftSchema,
  productDraftSchema,
  testimonialDraftSchema,
  type BlogDraft,
  type CategoryDraft,
  type GalleryDraft,
  type ProductDraft,
  type TestimonialDraft,
} from "@/lib/contentValidation";

interface ContentStore {
  version: 1;
  catalogInitialized: boolean;
  blogs: BlogPost[];
  galleries: GalleryItem[];
  products: Product[];
  categories: Category[];
  testimonials: Testimonial[];
}

const storageDirectory = path.join(process.cwd(), "storage");
const storagePath = path.join(storageDirectory, "content.json");
let mutationQueue: Promise<unknown> = Promise.resolve();

function seededStore(): ContentStore {
  return {
    version: 1,
    catalogInitialized: true,
    blogs: [],
    galleries: [],
    products: seededProducts.map((product) => ({ ...product })),
    categories: seededCategories.map((category) => ({ ...category })),
    testimonials: seededTestimonials.map((testimonial) => ({ ...testimonial })),
  };
}

async function readStore(): Promise<ContentStore> {
  try {
    const raw = await readFile(storagePath, "utf8");
    const stored = JSON.parse(raw) as Record<string, unknown>;
    const storedProducts = Array.isArray(stored.products) ? stored.products : [];
    const storedCategories = Array.isArray(stored.categories) ? stored.categories : [];
    const storedTestimonials = Array.isArray(stored.testimonials)
      ? stored.testimonials
      : seededTestimonials;
    const catalogIsInitialized = hasInitializedCatalog(stored);
    return contentStoreSchema.parse({
      ...stored,
      catalogInitialized: true,
      products: catalogIsInitialized ? storedProducts : seededProducts,
      categories: catalogIsInitialized ? storedCategories : seededCategories,
      testimonials: storedTestimonials,
    }) as ContentStore;
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
  const gujaratiParagraphs = parsed.gujarati.contentText
    .split(/\n\s*\n/gu)
    .map((body) => body.trim())
    .filter(Boolean);
  const gujaratiSummary =
    gujaratiParagraphs[0]?.replace(/\s+/gu, " ").trim().slice(0, 200) ||
    parsed.gujarati.title;

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
    richContent:
      parsed.richContent ?? plainTextToBlogRichText(parsed.contentText),
    content: paragraphs.map((body) => ({ body })),
    gujarati: {
      title: parsed.gujarati.title,
      category: parsed.gujarati.category,
      summary: gujaratiSummary,
      author: parsed.gujarati.author,
      richContent:
        parsed.gujarati.richContent ??
        plainTextToBlogRichText(parsed.gujarati.contentText),
      content: gujaratiParagraphs.map((body) => ({ body })),
    },
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

export async function getTestimonials() {
  return (await readStore()).testimonials;
}

export async function getTestimonial(id: string) {
  return (await getTestimonials()).find((testimonial) => testimonial.id === id);
}

export function createTestimonial(draft: TestimonialDraft) {
  return mutateStore((store) => {
    const parsed = testimonialDraftSchema.parse(draft);
    const testimonial: Testimonial = { ...parsed, id: randomUUID() };
    store.testimonials.unshift(testimonial);
    return testimonial;
  });
}

export function updateTestimonial(id: string, draft: TestimonialDraft) {
  return mutateStore((store) => {
    const index = store.testimonials.findIndex((testimonial) => testimonial.id === id);
    if (index < 0) return null;
    const parsed = testimonialDraftSchema.parse(draft);
    const testimonial: Testimonial = { ...parsed, id: store.testimonials[index].id };
    store.testimonials[index] = testimonial;
    return testimonial;
  });
}

export function deleteTestimonial(id: string) {
  return mutateStore((store) => {
    const index = store.testimonials.findIndex((testimonial) => testimonial.id === id);
    if (index < 0) return null;
    return store.testimonials.splice(index, 1)[0];
  });
}

function productFromDraft(draft: ProductDraft): Product {
  const parsed = productDraftSchema.parse(draft);
  return { ...parsed };
}

export async function getProducts() {
  return (await readStore()).products;
}

export async function getProduct(id: string) {
  return (await getProducts()).find((product) => product.id === id);
}

export function createProduct(draft: ProductDraft) {
  return mutateStore((store) => {
    const parsed = productDraftSchema.parse(draft);
    if (store.products.some((product) => product.id === parsed.id)) {
      throw new Error("A product with this slug already exists.");
    }
    if (!store.categories.some((category) => category.slug === parsed.category)) {
      throw new Error("Choose an existing category.");
    }
    const product = productFromDraft(parsed);
    store.products.unshift(product);
    return product;
  });
}

export function updateProduct(id: string, draft: ProductDraft) {
  return mutateStore((store) => {
    const index = store.products.findIndex((product) => product.id === id);
    if (index < 0) return null;
    const parsed = productDraftSchema.parse(draft);
    if (store.products.some((product, itemIndex) => itemIndex !== index && product.id === parsed.id)) {
      throw new Error("A product with this slug already exists.");
    }
    if (!store.categories.some((category) => category.slug === parsed.category)) {
      throw new Error("Choose an existing category.");
    }
    const product = productFromDraft(parsed);
    store.products[index] = { ...product, reviews: store.products[index].reviews };
    return store.products[index];
  });
}

export function deleteProduct(id: string) {
  return mutateStore((store) => {
    const index = store.products.findIndex((product) => product.id === id);
    if (index < 0) return null;
    return store.products.splice(index, 1)[0];
  });
}

export async function getCategories() {
  return (await readStore()).categories;
}

export async function getCategory(identifier: string) {
  return (await getCategories()).find(
    (category) => category.id === identifier || category.slug === identifier,
  );
}

export function createCategory(draft: CategoryDraft) {
  return mutateStore((store) => {
    const parsed = categoryDraftSchema.parse(draft);
    if (store.categories.some((category) => category.slug === parsed.slug)) {
      throw new Error("A category with this slug already exists.");
    }
    const category: Category = { ...parsed, id: randomUUID() };
    store.categories.push(category);
    store.categories.sort((left, right) => left.name.localeCompare(right.name));
    return category;
  });
}

export function updateCategory(id: string, draft: CategoryDraft) {
  return mutateStore((store) => {
    const index = store.categories.findIndex((category) => category.id === id);
    if (index < 0) return null;
    const parsed = categoryDraftSchema.parse(draft);
    if (store.categories.some((category, itemIndex) => itemIndex !== index && category.slug === parsed.slug)) {
      throw new Error("A category with this slug already exists.");
    }
    const previousSlug = store.categories[index].slug;
    const category: Category = { ...parsed, id: store.categories[index].id };
    store.categories[index] = category;
    if (previousSlug !== parsed.slug) {
      store.products = store.products.map((product) =>
        product.category === previousSlug ? { ...product, category: parsed.slug } : product,
      );
    }
    store.categories.sort((left, right) => left.name.localeCompare(right.name));
    return category;
  });
}

export function deleteCategory(id: string) {
  return mutateStore((store) => {
    const index = store.categories.findIndex((category) => category.id === id);
    if (index < 0) return null;
    const category = store.categories[index];
    if (store.products.some((product) => product.category === category.slug)) {
      throw new Error("Move or delete the products in this category first.");
    }
    return store.categories.splice(index, 1)[0];
  });
}
