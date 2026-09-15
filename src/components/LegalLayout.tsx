import Link from "next/link";
import { ArrowLeft, Building } from "lucide-react";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-4 sm:px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white" aria-hidden="true">
            <Building className="h-5 w-5" />
          </div>
          <span className="font-semibold text-slate-900">Immo Gestion</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Retour
        </Link>

        <h1 className="mt-4 text-3xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">Derniere mise a jour : {updated}</p>

        <div className="prose-legal mt-8 space-y-6 text-sm leading-6 text-slate-700">{children}</div>
      </main>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-lg font-semibold text-slate-900">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function LegalFooterLinks() {
  return (
    <nav aria-label="Documents legaux" className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-500">
      <Link href="/politique-de-confidentialite" className="hover:text-slate-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 rounded">
        Politique de confidentialite
      </Link>
      <Link href="/conditions-utilisation" className="hover:text-slate-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 rounded">
        Conditions d&apos;utilisation
      </Link>
      <Link href="/politique-de-remboursement" className="hover:text-slate-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 rounded">
        Politique de remboursement
      </Link>
      <Link href="/politique-de-temoins" className="hover:text-slate-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 rounded">
        Temoins (cookies)
      </Link>
    </nav>
  );
}
