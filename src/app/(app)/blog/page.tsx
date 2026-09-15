import { listBlogPosts } from "@/lib/data";
import { requireAuth } from "@/lib/auth";
import { BlogListClient } from "./BlogListClient";

export default async function BlogPage() {
  const user = await requireAuth();
  const posts = await listBlogPosts(user.id);
  return <BlogListClient posts={posts} />;
}
