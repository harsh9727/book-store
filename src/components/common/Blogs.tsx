import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBlogs } from "@/lib/contentRepository";
import LocalizedBlogCards from "@/components/blog/LocalizedBlogCards";

interface BlogsProps {
    limit?: number;
}

const Blogs = async ({ limit }: BlogsProps = {}) => {
    const blogs = await getBlogs();
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

            <LocalizedBlogCards blogs={displayedBlogs} />
        </>
    );
};

export default Blogs;
