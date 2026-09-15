"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Newspaper, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/Badge";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { PrimaryButton } from "@/components/form";
import { formatDate } from "@/lib/format";
import { blogStatusMeta } from "@/lib/statusMeta";
import type { BlogPost } from "@/lib/types";
import { deleteBlogPost } from "@/lib/actions";

function excerpt(content: string, max = 140): string {
  const flat = content.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max)}…` : flat;
}

export function BlogListClient({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [toDelete, setToDelete] = useState<BlogPost | null>(null);

  function confirmDelete() {
    if (!toDelete) return;
    const id = toDelete.id;
    startTransition(async () => {
      await deleteBlogPost(id);
      setToDelete(null);
      router.refresh();
    });
  }

  return (
    <div>
      <PageHeader
        title="Blog"
        description={`${posts.length} billet${posts.length > 1 ? "s" : ""} — visibles uniquement par vous`}
        action={
          <Link href="/blog/nouveau">
            <PrimaryButton>
              <Plus className="h-4 w-4" /> Nouveau billet
            </PrimaryButton>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="group relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <button
              onClick={() => setToDelete(post)}
              className="absolute right-4 top-4 rounded-md p-1.5 text-slate-400 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              aria-label={`Supprimer le billet "${post.title}"`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
            <Link href={`/blog/${post.id}`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100" aria-hidden="true">
                <Newspaper className="h-5 w-5 text-slate-600" />
              </div>
              <h2 className="mt-3 font-semibold text-slate-900 pr-6">{post.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{excerpt(post.content)}</p>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
                <Badge tone={blogStatusMeta[post.status].tone}>{blogStatusMeta[post.status].label}</Badge>
                <span className="text-slate-500">{formatDate(post.updatedAt.slice(0, 10))}</span>
              </div>
            </Link>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="col-span-full py-8 text-center text-slate-500">
            Aucun billet pour le moment. Creez votre premier billet.
          </p>
        )}
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer le billet"
        message={`Etes-vous sur de vouloir supprimer "${toDelete?.title}" ?`}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
