import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/login");

  return (
    <>
      <Sidebar userEmail={user.email} />
      <div className="md:pl-64">
        <main className="mx-auto max-w-6xl px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-8">{children}</main>
      </div>
      <MobileNav />
    </>
  );
}
