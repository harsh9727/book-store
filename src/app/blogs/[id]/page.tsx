import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  ChevronRight,
  Home,
  ArrowRight,
} from "lucide-react";
import { blogs } from "@/data/blogs";

interface BlogPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return blogs.map((blog) => ({
    id: String(blog.id),
  }));
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { id } = await params;
  const blog = blogs.find((b) => String(b.id) === id) || blogs[0];

  if (!blog) {
    notFound();
  }

  const relatedBlogs = blogs.filter((b) => String(b.id) !== String(blog.id)).slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-sm description tracking-wide text-gray-500">
        <Link href="/" className="flex items-center gap-1 hover:text-orange-600 transition-colors">
          <Home size={14} />
          <span>Home</span>
        </Link>
        <ChevronRight size={12} />
        <Link href="/blogs" className="hover:text-orange-600 transition-colors">
          Blog
        </Link>
        <ChevronRight size={12} />
        <span className="truncate max-w-[240px] sm:max-w-md font-medium text-gray-900">
          {blog.title}
        </span>
      </nav>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3 text-sm description tracking-wide mb-3">
          <span className="rounded-full bg-orange-100 px-3 py-1 font-semibold text-orange-700">
            {blog.category}
          </span>
          <span className="flex items-center gap-1 text-gray-500">
            <CalendarDays size={18} />
            {blog.date}
          </span>
          <span className="flex items-center gap-1 text-gray-500">
            <Clock size={18} />
            {blog.readTime}
          </span>
        </div>

        <h1 className="title text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl lg:text-5xl leading-tight">
          {blog.title}
        </h1>

        {/* Author info pill */}
        <div className="mt-6 flex items-center gap-3.5 border-y border-gray-100 py-4">
          <img
            src={blog.author.avatar}
            alt={blog.author.name}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-orange-200"
          />
          <div>
            <p className="text-lg font-semibold description tracking-wide text-orange-600">{blog.author.name}</p>
            <p className="text-sm description tracking-wide text-gray-600">{blog.author.role}</p>
          </div>
        </div>
      </header>

      {/* Featured Banner Image */}
      <div className="relative aspect-[20/9] w-full overflow-hidden rounded-3xl bg-gray-100 shadow-md mb-10">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Formatted Article Content */}
      <div className="space-y-8 text-gray-800">
        {blog.content.map((section, idx) => (
          <div key={idx} className="space-y-4">
            {section.heading && (
              <h2 className="title text-2xl font-bold text-gray-900 mt-6">
                {section.heading}
              </h2>
            )}

            <p className="description text-base leading-relaxed text-gray-700">
              {section.body}
            </p>
          </div>
        ))}
      </div>


      {/* Related Reads */}
      {relatedBlogs.length > 0 && (
        <section className="mt-10 border-t border-gray-100 pt-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="title text-2xl font-bold text-gray-900">
              Related Articles
            </h2>
            <Link
              href="/blogs"
              className="text-sm font-bold description tracking-wide text-orange-600 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {relatedBlogs.map((item) => (
              <Link
                key={item.id}
                href={`/blogs/${item.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 mb-3">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <span className="text-sm description tracking-wide font-semibold text-orange-600 mb-1">
                  {item.category}
                </span>
                <h4 className="line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors title">
                  {item.title}
                </h4>
                <span className="text-sm description tracking-wide text-gray-400 mt-2">{item.date}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
