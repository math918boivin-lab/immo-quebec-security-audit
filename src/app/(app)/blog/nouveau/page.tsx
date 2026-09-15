import { requireAuth } from "@/lib/auth";
import { BlogEditor } from "../BlogEditor";

export default async function NewBlogPostPage() {
  await requireAuth();
  return <BlogEditor />;
}
