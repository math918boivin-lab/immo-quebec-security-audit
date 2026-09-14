import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBlogPost } from "@/lib/data";
import { requireAuth } from "@/lib/auth";
import { BlogEditor } from "../BlogEditor";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireAuth();
  const post = getBlogPost(user.id, id);

  if (!post) {
    return (
      <div>
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> Retour au blog
        </Link>
        <p className="mt-6 text-slate-500">Ce billet est introuvable.</p>
      </div>
    );
  }

  return <BlogEditor post={post} />;
}
