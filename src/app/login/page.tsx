import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Sign In",
  description: "Sign in to your GTBS Book Store account.",
  path: "/login",
  noIndex: true,
});

export default function Login() {
  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold text-gray-900">Sign In</h1>
      <p className="mt-4 text-gray-600">Login to your account</p>
    </div>
  );
}
