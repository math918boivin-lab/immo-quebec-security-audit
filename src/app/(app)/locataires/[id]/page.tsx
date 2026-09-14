import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  getTenant,
  listLeasesForTenant,
  listPaymentsForLeases,
  listProperties,
  listUnits,
} from "@/lib/data";
import { TenantDetailClient } from "./TenantDetailClient";

export default async function TenantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tenant = getTenant(id);

  if (!tenant) {
    return (
      <div>
        <Link href="/locataires" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> Retour aux locataires
        </Link>
        <p className="mt-6 text-slate-500">Ce locataire est introuvable.</p>
      </div>
    );
  }

  const leases = listLeasesForTenant(id);
  const payments = listPaymentsForLeases(leases.map((l) => l.id)).sort((a, b) =>
    b.dueDate.localeCompare(a.dueDate)
  );
  const units = listUnits();
  const properties = listProperties();

  return (
    <TenantDetailClient tenant={tenant} leases={leases} units={units} properties={properties} payments={payments} />
  );
}
