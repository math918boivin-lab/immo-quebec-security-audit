"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  CreditCard,
  FileText,
  LayoutDashboard,
  Users,
  Wrench,
  Building,
} from "lucide-react";
import { clsx } from "clsx";

const links = [
  { href: "/", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/immeubles", label: "Immeubles", icon: Building2 },
  { href: "/locataires", label: "Locataires", icon: Users },
  { href: "/baux", label: "Baux", icon: FileText },
  { href: "/paiements", label: "Paiements", icon: CreditCard },
  { href: "/maintenance", label: "Maintenance", icon: Wrench },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-gray-200 bg-white">
      <div className="flex items-center gap-2 px-6 h-16 border-b border-gray-200">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
          <Building className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <p className="font-semibold text-slate-900">Immo Gestion</p>
          <p className="text-xs text-slate-500">Quebec</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className="h-4.5 w-4.5" strokeWidth={2} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-gray-200 text-xs text-slate-400">
        Donnees stockees localement dans votre navigateur.
      </div>
    </aside>
  );
}
