"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Field, inputClass, PrimaryButton, SecondaryButton } from "@/components/form";
import { formatDate } from "@/lib/format";
import type { BlogPost, BlogPostStatus } from "@/lib/types";
import { createBlogPost, deleteBlogPost, updateBlogPost } from "@/lib/actions";

export function BlogEditor({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState(post?.title ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [status, setStatus] = useState<BlogPostStatus>(post?.status ?? "brouillon");
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        if (post) {
          await updateBlogPost(post.id, { title, content, status });
        } else {
          await createBlogPost({ title, content, status });
        }
        router.push("/blog");
        router.refresh();
      } catch {
        setError("Impossible d'enregistrer le billet. Verifiez les champs.");
      }
    });
  }

  function handleDelete() {
    if (!post) return;
    startTransition(async () => {
      await deleteBlogPost(post.id);
      router.push("/blog");
      router.refresh();
    });
  }

  return (
    <div>
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Retour au blog
      </Link>

      <div className="mt-4 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{post ? "Modifier le billet" : "Nouveau billet"}</h1>
          {post && (
            <p className="mt-1 text-sm text-slate-500">
              Derniere modification le {formatDate(post.updatedAt.slice(0, 10))}
            </p>
          )}
        </div>
        {post && (
          <SecondaryButton onClick={() => setConfirmDelete(true)} className="text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" /> Supprimer
          </SecondaryButton>
        )}
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <Field label="Titre">
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre du billet"
            required
            maxLength={200}
          />
        </Field>
        <Field label="Contenu">
          <textarea
            className={inputClass}
            rows={16}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Rediger le contenu du billet..."
            required
          />
        </Field>
        <Field label="Statut">
          <select
            className={inputClass}
            value={status}
            onChange={(e) => setStatus(e.target.value as BlogPostStatus)}
          >
            <option value="brouillon">Brouillon</option>
            <option value="publie">Publie</option>
          </select>
        </Field>
        <div className="flex justify-end gap-3 pt-2">
          <Link href="/blog">
            <SecondaryButton type="button">Annuler</SecondaryButton>
          </Link>
          <PrimaryButton type="submit" disabled={pending}>
            <Save className="h-4 w-4" /> Enregistrer
          </PrimaryButton>
        </div>
      </form>

      <ConfirmDialog
        open={confirmDelete}
        title="Supprimer le billet"
        message="Etes-vous sur de vouloir supprimer ce billet ? Cette action est irreversible."
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
