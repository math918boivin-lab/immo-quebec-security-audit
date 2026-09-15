import { listLeases, listProperties, listTenants, listUnits } from "@/lib/data";
import { requireAuth } from "@/lib/auth";
import { LeasesClient } from "./LeasesClient";

export default async function LeasesPage() {
  const user = await requireAuth();
  const leases = listLeases(user.id);
  const units = listUnits(user.id);
  const properties = listProperties(user.id);
  const tenants = listTenants(user.id);

  return <LeasesClient leases={leases} units={units} properties={properties} tenants={tenants} />;
}
