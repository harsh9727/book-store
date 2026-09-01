import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  BookOpen,
  BookOpenText,
  Images,
  LayoutDashboard,
  Store,
} from "lucide-react";

import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

interface AdminContentShellProps {
  active: "blogs" | "galleries";
  title: string;
  description: string;
  children: ReactNode;
}

const navigation = [
  { key: "overview", label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { key: "blogs", label: "Blogs", href: "/admin/blogs", icon: BookOpenText },
  { key: "galleries", label: "Gallery", href: "/admin/galleries", icon: Images },
];

export default function AdminContentShell({
  active,
  title,
  description,
  children,
}: AdminContentShellProps) {
  return (
    <div className="min-h-screen bg-[#f7f7f5] text-slate-900 lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen flex-col bg-slate-950 px-4 py-5 text-white lg:flex">
        <Link href="/admin/dashboard" className="flex items-center gap-3 px-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
            <Image src="/images/logo/logo.webp" alt="GTBS" width={38} height={38} className="h-9 w-9 object-contain" />
          </span>
          <span>
            <span className="block text-sm font-bold">GTBS Admin</span>
            <span className="block text-xs text-slate-400">Management panel</span>
          </span>
        </Link>

        <nav className="mt-8 space-y-1" aria-label="Admin navigation">
          {navigation.map(({ key, label, href, icon: Icon }) => {
            const isActive = key === active;
            return (
              <Link
                key={key}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-orange-600 text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <Link href="/admin/dashboard" className="flex items-center gap-2 lg:hidden">
              <Image src="/images/logo/logo.webp" alt="GTBS" width={36} height={36} className="h-9 w-9 object-contain" />
              <span className="text-sm font-bold">GTBS Admin</span>
            </Link>
            <div className="ml-auto flex items-center gap-2">
              <Link href="/" className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 sm:flex">
                <Store size={16} />Storefront
              </Link>
              <AdminLogoutButton />
            </div>
            <nav className="order-3 flex w-full gap-1 overflow-x-auto lg:hidden" aria-label="Mobile admin navigation">
              {navigation.slice(0, 3).map(({ key, label, href, icon: Icon }) => {
                const isActive = key === active;
                return (
                  <Link
                    key={key}
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
                      isActive ? "bg-orange-50 text-orange-700" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Icon size={16} />{label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        <main className="px-4 py-7 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
              <BookOpen size={14} />Content management
            </div>
            <h1 className="title text-3xl font-bold">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
