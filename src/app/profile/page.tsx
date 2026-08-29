import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Your Profile",
  description: "Manage your GTBS Book Store customer account.",
  path: "/profile",
  noIndex: true,
});

export default function Profile() {
  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold text-gray-900">Profile</h1>
      <p className="mt-4 text-gray-600">Manage your account settings</p>
    </div>
  );
}
