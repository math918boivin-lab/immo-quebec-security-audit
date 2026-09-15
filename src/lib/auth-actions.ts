"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { attemptLogin, destroySession, registerUser, MIN_PASSWORD_LENGTH } from "./auth";
import { signupSchema } from "./schemas";

const loginSchema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(1).max(200),
});

export interface LoginFormState {
  error?: string;
}

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Courriel ou mot de passe invalide." };
  }

  const result = await attemptLogin(parsed.data.email, parsed.data.password);

  if (!result.ok) {
    if (result.reason === "locked") {
      return { error: "Trop de tentatives. Reessayez dans quelques minutes." };
    }
    return { error: "Courriel ou mot de passe incorrect." };
  }

  redirect("/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

export interface SignupFormState {
  error?: string;
}

export async function signupAction(
  _prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    consent: formData.get("consent"),
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    if (first?.path[0] === "confirmPassword") {
      return { error: "Les mots de passe ne correspondent pas." };
    }
    if (first?.path[0] === "password") {
      return { error: `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caracteres.` };
    }
    if (first?.path[0] === "consent") {
      return { error: "Vous devez accepter les conditions d'utilisation et la politique de confidentialite." };
    }
    return { error: "Veuillez remplir correctement tous les champs." };
  }

  const result = await registerUser(parsed.data.name, parsed.data.email, parsed.data.password);

  if (!result.ok) {
    if (result.reason === "email_taken") {
      return { error: "Un compte existe deja avec ce courriel." };
    }
    return { error: `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caracteres.` };
  }

  redirect("/");
}
