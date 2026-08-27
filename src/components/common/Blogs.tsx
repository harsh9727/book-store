"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import BlogImg from "../../../public/images/blog/blog.jpg";

const blogs = [
    {
        id: 1,
        title: "10 Must-Read Books Every Book Lover Should Read",
        category: "Book Recommendations",
        date: "June 15, 2024",
        image: BlogImg,
    },
    {
        id: 2,
        title: "How Reading Can Transform Your Everyday Life",
        category: "Reading Tips",
        date: "June 10, 2024",
        image: BlogImg,
    },
    {
        id: 3,
        title: "New Book Releases You Don't Want to Miss",
        category: "New Releases",
        date: "June 5, 2024",
        image: BlogImg,
    },
    {
        id: 4,
        title: "The Best Christian Books for Inspiration",
        category: "Christian Books",
        date: "May 28, 2024",
        image: BlogImg,
    },
    {
        id: 5,
        title: "Why Building a Daily Reading Habit Matters",
        category: "Reading Tips",
        date: "May 22, 2024",
        image: BlogImg,
    },
    {
        id: 6,
        title: "How to Choose the Perfect Book for Yourself",
        category: "Book Guide",
        date: "May 16, 2024",
        image: BlogImg,
    },
];

interface BlogsProps {
    limit?: number;
}

const Blogs = ({ limit }: BlogsProps = {}) => {
    const displayedBlogs = limit ? blogs.slice(0, limit) : blogs;

    return (
        <>
            {/* Heading */}
            <div className="mb-8 flex items-center justify-between gap-4 sm:flex-row flex-col">
                <div className="max-w-xl">
                    <h2 className="title text-2xl font-semibold tracking-tight text-orange-600 md:text-[28px]">
                        Latest Blogs
                    </h2>
                    <p className="text-sm text-gray-500">
                        Discover inspiring stories, helpful reading tips, and thoughtful book recommendations.<br /> Stay updated with fresh insights and explore something new with every read.
                    </p>
                </div>
                <div>
                    <Link
                        href="/blogs"
                        className="description hidden shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 shadow-sm transition-all duration-300 hover:border-orange-600 hover:text-orange-600 sm:flex"
                    >
                        View All
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {displayedBlogs.map((blog) => (
                    <article
                        key={blog.id}
                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-orange-100 hover:shadow-[0_12px_35px_rgba(249,115,22,0.10)]"
                    >
                        {/* Image */}
                        <Link
                            href={`/blogs/${blog.id}`}
                            className="relative block aspect-[16/10] overflow-hidden bg-gray-100"
                        >
                            <Image
                                src={blog.image}
                                alt={blog.title}
                                fill
                                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            />

                            {/* Image Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                            {/* Category */}
                            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold text-orange-600 shadow-sm backdrop-blur-sm">
                                {blog.category}
                            </span>
                        </Link>

                        {/* Content */}
                        <div className="flex flex-1 flex-col p-4">
                            {/* Date */}
                            <div className="mb-2.5 flex items-center gap-1.5 text-[11px] text-gray-400">
                                <CalendarDays size={13} />
                                <span>{blog.date}</span>
                            </div>

                            {/* Title */}
                            <Link href={`/blogs/${blog.id}`}>
                                <h3 className="line-clamp-2 text-[15px] font-semibold leading-6 text-gray-900 transition-colors duration-300 group-hover:text-orange-600">
                                    {blog.title}
                                </h3>
                            </Link>

                            {/* Read More */}
                            <Link
                                href={`/blogs/${blog.id}`}
                                className="group/link mt-auto flex w-fit items-center gap-1.5 pt-4 text-xs font-semibold text-gray-800 transition-colors duration-300 hover:text-orange-600"
                            >
                                Read More
                                <ArrowRight
                                    size={14}
                                    className="transition-transform duration-300 group-hover/link:translate-x-1"
                                />
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </>
    );
};

export default Blogs;