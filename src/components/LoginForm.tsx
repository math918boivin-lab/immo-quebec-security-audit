"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Building, AlertCircle } from "lucide-react";
import { loginAction, type LoginFormState } from "@/lib/auth-actions";
import { inputClass, PrimaryButton } from "@/components/form";
import { LegalFooterLinks } from "@/components/LegalLayout";

const initialState: LoginFormState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white" aria-hidden="true">
            <Building className="h-6 w-6" />
          </div>
          <h1 className="mt-3 text-xl font-semibold text-slate-900">Immo Gestion</h1>
          <p className="text-sm text-slate-500">Connectez-vous pour acceder a votre portefeuille</p>
        </div>

        <form action={formAction} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {state.error && (
            <div role="alert" className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{state.error}</span>
            </div>
          )}
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Courriel</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="username"
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
              autoComplete="current-password"
              className={inputClass}
            />
          </label>
          <PrimaryButton type="submit" disabled={pending} className="w-full">
            {pending ? "Connexion..." : "Se connecter"}
          </PrimaryButton>
          <p className="text-center text-sm text-slate-500">
            Pas encore de compte ?{" "}
            <Link href="/signup" className="font-medium text-slate-900 hover:underline">
              Creer un compte
            </Link>
          </p>
        </form>
      </div>
      <LegalFooterLinks />
    </main>
  );
}
