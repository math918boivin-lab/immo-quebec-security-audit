import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProperty, listLeases, listTenants, listUnitsForProperty } from "@/lib/data";
import { requireAuth } from "@/lib/auth";
import { PropertyDetailClient } from "./PropertyDetailClient";

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireAuth();
  const property = await getProperty(user.id, id);

  if (!property) {
    return (
      <div>
        <Link href="/immeubles" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> Retour aux immeubles
        </Link>
        <p className="mt-6 text-slate-500">Cet immeuble est introuvable.</p>
      </div>
    );
  }

  const [units, leases, tenants] = await Promise.all([
    listUnitsForProperty(user.id, id),
    listLeases(user.id),
    listTenants(user.id),
  ]);

  return <PropertyDetailClient property={property} units={units} leases={leases} tenants={tenants} />;
}
