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
} from "lucide-react";
import { clsx } from "clsx";

const links = [
  { href: "/", label: "Accueil", icon: LayoutDashboard },
  { href: "/immeubles", label: "Immeubles", icon: Building2 },
  { href: "/locataires", label: "Locataires", icon: Users },
  { href: "/baux", label: "Baux", icon: FileText },
  { href: "/paiements", label: "Paiements", icon: CreditCard },
  { href: "/maintenance", label: "Travaux", icon: Wrench },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 flex border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)]">
      {links.map((link) => {
        const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium",
              active ? "text-slate-900" : "text-slate-400"
            )}
          >
            <Icon className="h-5 w-5" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
