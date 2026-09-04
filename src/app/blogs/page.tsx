import BlogsPageClient from "@/components/blog/BlogsPageClient";
import { getBlogs } from "@/lib/contentRepository";

export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  return <BlogsPageClient initialItems={await getBlogs()} />;
}
