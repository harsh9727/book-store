import { redirect } from "next/navigation";

interface BlogRedirectProps {
  params: Promise<{ id: string }>;
}

export default async function BlogIdRedirect({ params }: BlogRedirectProps) {
  const { id } = await params;
  redirect(`/blogs/${id}`);
}
