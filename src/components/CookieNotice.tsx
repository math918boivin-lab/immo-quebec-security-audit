"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "immo-cookie-notice-dismissed";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "1";
  } catch {
    return true;
  }
}

function getServerSnapshot() {
  return false;
}

export function CookieNotice() {
  const notYetDismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [dismissedThisSession, setDismissedThisSession] = useState(false);
  const visible = notYetDismissed && !dismissedThisSession;

  function dismiss() {
    setDismissedThisSession(true);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Stockage local indisponible (navigation privee, etc.) : le bandeau
      // reapparaitra a la prochaine visite, sans consequence fonctionnelle.
    }
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Avis relatif aux temoins"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur-sm shadow-[0_-4px_12px_rgba(0,0,0,0.05)]"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="flex items-start gap-2 text-xs text-slate-600 sm:items-center">
          <Cookie className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <span>
            Nous utilisons uniquement un temoin essentiel a la connexion — aucun suivi, aucune publicite.{" "}
            <Link
              href="/politique-de-temoins"
              className="font-medium text-slate-900 underline hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 rounded"
            >
              En savoir plus
            </Link>
          </span>
        </p>
        <button
          onClick={dismiss}
          className="inline-flex shrink-0 items-center gap-1 self-end rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 sm:self-auto"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          J&apos;ai compris
        </button>
      </div>
    </div>
  );
}
