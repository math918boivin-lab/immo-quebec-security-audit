import { listLeases, listProperties, listTenants, listUnits } from "@/lib/data";
import { requireAuth } from "@/lib/auth";
import { LeasesClient } from "./LeasesClient";

export default async function LeasesPage() {
  const user = await requireAuth();
  const [leases, units, properties, tenants] = await Promise.all([
    listLeases(user.id),
    listUnits(user.id),
    listProperties(user.id),
    listTenants(user.id),
  ]);

  return <LeasesClient leases={leases} units={units} properties={properties} tenants={tenants} />;
}
