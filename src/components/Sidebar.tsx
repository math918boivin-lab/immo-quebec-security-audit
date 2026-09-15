"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Users,
  Wrench,
  Building,
} from "lucide-react";
import { clsx } from "clsx";
import { logoutAction } from "@/lib/auth-actions";

const links = [
  { href: "/", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/immeubles", label: "Immeubles", icon: Building2 },
  { href: "/locataires", label: "Locataires", icon: Users },
  { href: "/baux", label: "Baux", icon: FileText },
  { href: "/paiements", label: "Paiements", icon: CreditCard },
  { href: "/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/blog", label: "Blog", icon: Newspaper },
];

export function Sidebar({ userEmail, userName }: { userEmail: string; userName: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-gray-200 bg-white">
      <div className="flex items-center gap-2 px-6 h-16 border-b border-gray-200">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white" aria-hidden="true">
          <Building className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <p className="font-semibold text-slate-900">Immo Gestion</p>
          <p className="text-xs text-slate-500">Quebec</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Navigation principale">
        {links.map((link) => {
          const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500",
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className="h-4.5 w-4.5" strokeWidth={2} aria-hidden="true" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-200 px-4 py-4">
        <p className="truncate text-sm font-medium text-slate-700" title={userEmail}>
          {userName || userEmail}
        </p>
        <p className="truncate text-xs text-slate-500" title={userEmail}>
          {userEmail}
        </p>
        <form action={logoutAction}>
          <button
            type="submit"
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" /> Se deconnecter
          </button>
        </form>
        <nav aria-label="Documents legaux" className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-slate-500">
          <Link href="/politique-de-confidentialite" className="hover:text-slate-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 rounded">
            Confidentialite
          </Link>
          <Link href="/conditions-utilisation" className="hover:text-slate-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 rounded">
            Conditions
          </Link>
          <Link href="/politique-de-remboursement" className="hover:text-slate-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 rounded">
            Remboursement
          </Link>
        </nav>
      </div>
    </aside>
  );
}
