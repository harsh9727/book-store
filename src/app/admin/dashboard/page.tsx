import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ArrowDownRight, ArrowUpRight, BarChart3, Bell, BookOpen, ChevronRight,
  CircleHelp, IndianRupee, LayoutDashboard, Package, Search, Settings,
  ShoppingBag, Store, Users,
} from "lucide-react";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/adminAuth";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: `Admin Dashboard | ${siteConfig.name}` },
};

const navigation = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Orders", icon: ShoppingBag, badge: "12" },
  { label: "Products", icon: BookOpen },
  { label: "Customers", icon: Users },
  { label: "Analytics", icon: BarChart3 },
];

const stats = [
  { label: "Total revenue", value: "₹1,24,580", change: "+12.5%", positive: true, icon: IndianRupee, color: "bg-orange-50 text-orange-600" },
  { label: "Total orders", value: "384", change: "+8.2%", positive: true, icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
  { label: "Books sold", value: "612", change: "+5.4%", positive: true, icon: BookOpen, color: "bg-violet-50 text-violet-600" },
  { label: "New customers", value: "96", change: "-2.1%", positive: false, icon: Users, color: "bg-emerald-50 text-emerald-600" },
];

const sales = [38, 54, 42, 68, 58, 82, 72, 91, 64, 78, 88, 96];
const salesLabels = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const orders = [
  { id: "#GT-1048", customer: "Neha Patel", product: "Gujarati Study Bible", total: "₹1,499", status: "Paid", date: "30 Aug" },
  { id: "#GT-1047", customer: "David Joseph", product: "Daily Devotional", total: "₹649", status: "Processing", date: "30 Aug" },
  { id: "#GT-1046", customer: "Ruth Samuel", product: "Children’s Bible", total: "₹899", status: "Shipped", date: "29 Aug" },
  { id: "#GT-1045", customer: "Aaron Thomas", product: "Faith & Hope Bundle", total: "₹1,850", status: "Paid", date: "29 Aug" },
];
const statusStyles: Record<string, string> = {
  Paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Processing: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Shipped: "bg-blue-50 text-blue-700 ring-blue-600/20",
};

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const session = verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) redirect("/admin/login");
  const now = new Date();
  const dateLabel = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Asia/Kolkata",
  }).format(now);
  const hour = Number(new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    hourCycle: "h23",
    timeZone: "Asia/Kolkata",
  }).format(now));
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-slate-900 lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="hidden min-h-screen border-r border-slate-200 bg-[#172019] text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
            <Image src="/images/logo/logo.webp" alt="GTBS" width={36} height={36} className="h-8 w-8 object-contain" />
          </span>
          <div className="min-w-0"><p className="truncate text-sm font-bold tracking-wide">GTBS BOOK STORE</p><p className="text-xs text-white/50">Admin workspace</p></div>
        </div>
        <nav aria-label="Admin navigation" className="flex-1 space-y-1 px-3 py-6">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Workspace</p>
          {navigation.map(({ label, icon: Icon, active, badge }) => (
            <Link key={label} href={active ? "/admin/dashboard" : "#"} aria-current={active ? "page" : undefined}
              className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition ${active ? "bg-orange-500 text-white shadow-lg shadow-orange-950/20" : "text-white/65 hover:bg-white/10 hover:text-white"}`}>
              <Icon size={18} /><span className="flex-1">{label}</span>{badge && <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold">{badge}</span>}
            </Link>
          ))}
        </nav>
        <div className="space-y-1 border-t border-white/10 p-3">
          <Link href="#" className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-white/65 hover:bg-white/10 hover:text-white"><Settings size={18} /> Settings</Link>
          <Link href="#" className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-white/65 hover:bg-white/10 hover:text-white"><CircleHelp size={18} /> Help & support</Link>
          <Link href="/" className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-white/65 hover:bg-white/10 hover:text-white"><Store size={18} /> View storefront</Link>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:h-20 lg:px-8">
            <div className="flex items-center gap-3 lg:hidden"><Image src="/images/logo/logo.webp" alt="GTBS" width={38} height={38} className="h-9 w-9 object-contain" /><div><p className="text-sm font-bold">GTBS Admin</p><p className="text-[11px] text-slate-500">Book store</p></div></div>
            <label className="hidden h-11 w-full max-w-sm items-center gap-3 rounded-xl bg-slate-100 px-4 text-slate-500 md:flex">
              <Search size={17} /><input aria-label="Search dashboard" placeholder="Search orders, books, customers..." className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" /><kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">⌘K</kbd>
            </label>
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <button aria-label="Notifications" className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"><Bell size={18} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-orange-500" /></button>
              <div className="hidden border-l border-slate-200 pl-3 sm:block"><p className="max-w-44 truncate text-sm font-semibold">Administrator</p><p className="max-w-44 truncate text-xs text-slate-500">{session.email}</p></div>
              <AdminLogoutButton />
            </div>
          </div>
          <nav aria-label="Mobile admin navigation" className="flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-2 lg:hidden">
            {navigation.map(({ label, icon: Icon, active }) => <Link key={label} href={active ? "/admin/dashboard" : "#"} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${active ? "bg-orange-50 text-orange-600" : "text-slate-500"}`}><Icon size={15} />{label}</Link>)}
          </nav>
        </header>

        <main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="mb-1 text-sm font-semibold text-orange-600">{dateLabel}</p><h1 className="title text-2xl font-bold tracking-tight sm:text-3xl">{greeting}, Admin</h1><p className="mt-1 text-sm text-slate-500">Here’s what’s happening with your store today.</p></div>
            <button className="inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-[#172019] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#243327]"><Package size={17} /> Add new product</button>
          </div>

          <section aria-label="Store summary" className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ label, value, change, positive, icon: Icon, color }) => (
              <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                <div className="flex items-start justify-between"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}><Icon size={19} /></span><span className={`flex items-center gap-0.5 text-xs font-bold ${positive ? "text-emerald-600" : "text-rose-600"}`}>{positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{change}</span></div>
                <p className="mt-5 text-sm font-medium text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold tracking-tight">{value}</p><p className="mt-1 text-xs text-slate-400">vs. last month</p>
              </article>
            ))}
          </section>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.75fr)]">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4"><div><h2 className="text-base font-bold">Sales overview</h2><p className="mt-1 text-xs text-slate-500">Revenue performance over the last 12 months</p></div><select aria-label="Sales period" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none"><option>Last 12 months</option></select></div>
              <div className="mt-7 flex h-[220px] items-end gap-2 sm:gap-3">
                {sales.map((height, index) => <div key={salesLabels[index]} className="group flex h-full min-w-0 flex-1 flex-col justify-end gap-2"><div className="relative flex-1"><div className="absolute inset-x-0 bottom-0 rounded-t-md bg-orange-100 transition group-hover:bg-orange-500" style={{ height: `${height}%` }}><span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded bg-slate-900 px-1.5 py-1 text-[9px] text-white group-hover:block">₹{height}k</span></div></div><span className="text-center text-[9px] text-slate-400 sm:text-[10px]">{salesLabels[index]}</span></div>)}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between"><div><h2 className="text-base font-bold">Inventory</h2><p className="mt-1 text-xs text-slate-500">Current stock health</p></div><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><Package size={19} /></span></div>
              <div className="mt-7 flex items-center gap-5"><div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full [background:conic-gradient(#f97316_0_78%,#fde7d7_78%_91%,#e2e8f0_91%)]"><div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white"><strong className="text-xl">78%</strong><span className="text-[10px] text-slate-400">In stock</span></div></div><div className="space-y-3 text-xs"><p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> In stock <strong className="ml-auto pl-3">248</strong></p><p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-orange-200" /> Low stock <strong className="ml-auto pl-3">42</strong></p><p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-slate-200" /> Out of stock <strong className="ml-auto pl-3">27</strong></p></div></div>
              <button className="mt-7 flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-100">Manage inventory <ChevronRight size={16} /></button>
            </section>
          </div>

          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6"><div><h2 className="text-base font-bold">Recent orders</h2><p className="mt-1 text-xs text-slate-500">Latest purchases from your store</p></div><button className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700">View all <ChevronRight size={15} /></button></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50/80 text-[10px] uppercase tracking-wider text-slate-400"><tr><th className="px-6 py-3 font-semibold">Order</th><th className="px-6 py-3 font-semibold">Customer</th><th className="px-6 py-3 font-semibold">Product</th><th className="px-6 py-3 font-semibold">Date</th><th className="px-6 py-3 font-semibold">Total</th><th className="px-6 py-3 font-semibold">Status</th></tr></thead>
              <tbody className="divide-y divide-slate-100">{orders.map((order) => <tr key={order.id} className="hover:bg-slate-50/60"><td className="px-6 py-4 font-bold">{order.id}</td><td className="px-6 py-4 text-slate-600">{order.customer}</td><td className="px-6 py-4 text-slate-600">{order.product}</td><td className="px-6 py-4 text-slate-500">{order.date}</td><td className="px-6 py-4 font-semibold">{order.total}</td><td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ring-inset ${statusStyles[order.status]}`}>{order.status}</span></td></tr>)}</tbody>
            </table></div>
          </section>
        </main>
      </div>
    </div>
  );
}
