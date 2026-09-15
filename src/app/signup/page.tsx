import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SignupForm } from "@/components/SignupForm";

export default async function SignupPage() {
  const user = await getSession();
  if (user) redirect("/");

  return <SignupForm />;
}
