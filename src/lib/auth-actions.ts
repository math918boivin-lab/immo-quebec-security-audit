"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { attemptLogin, destroySession } from "./auth";

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
