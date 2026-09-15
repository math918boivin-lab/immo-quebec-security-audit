"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Building, AlertCircle } from "lucide-react";
import { signupAction, type SignupFormState } from "@/lib/auth-actions";
import { inputClass, PrimaryButton } from "@/components/form";
import { LegalFooterLinks } from "@/components/LegalLayout";
import { CookieNotice } from "@/components/CookieNotice";

const initialState: SignupFormState = {};

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signupAction, initialState);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white" aria-hidden="true">
            <Building className="h-6 w-6" />
          </div>
          <h1 className="mt-3 text-xl font-semibold text-slate-900">Creer un compte</h1>
          <p className="text-sm text-slate-500">Vos donnees restent privees et separees des autres comptes</p>
        </div>

        <form action={formAction} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {state.error && (
            <div role="alert" className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{state.error}</span>
            </div>
          )}
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Nom complet</span>
            <input
              type="text"
              name="name"
              required
              autoComplete="name"
              className={inputClass}
              placeholder="Marie Tremblay"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Courriel</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className={inputClass}
              placeholder="vous@example.com"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Mot de passe</span>
            <input
              type="password"
              name="password"
              required
              minLength={12}
              autoComplete="new-password"
              className={inputClass}
            />
            <span className="mt-1 block text-xs text-slate-500">Au moins 12 caracteres</span>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Confirmer le mot de passe</span>
            <input
              type="password"
              name="confirmPassword"
              required
              minLength={12}
              autoComplete="new-password"
              className={inputClass}
            />
          </label>
          <label className="flex items-start gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              name="consent"
              required
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
            <span>
              J&apos;ai lu et j&apos;accepte les{" "}
              <Link href="/conditions-utilisation" className="text-slate-700 underline hover:text-slate-900">
                conditions d&apos;utilisation
              </Link>
              , la{" "}
              <Link href="/politique-de-confidentialite" className="text-slate-700 underline hover:text-slate-900">
                politique de confidentialite
              </Link>{" "}
              et la{" "}
              <Link href="/politique-de-temoins" className="text-slate-700 underline hover:text-slate-900">
                politique de temoins
              </Link>
              .
            </span>
          </label>
          <PrimaryButton type="submit" disabled={pending} className="w-full">
            {pending ? "Creation..." : "Creer mon compte"}
          </PrimaryButton>
          <p className="text-center text-sm text-slate-500">
            Deja un compte ?{" "}
            <Link href="/login" className="font-medium text-slate-900 hover:underline">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
      <LegalFooterLinks />
      <CookieNotice />
    </main>
  );
}
