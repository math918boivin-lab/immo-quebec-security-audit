import { listLeases, listProperties, listTenants, listUnits } from "@/lib/data";
import { requireAuth } from "@/lib/auth";
import { TenantsClient } from "./TenantsClient";

export default async function TenantsPage() {
  const user = await requireAuth();
  const [tenants, leases, units, properties] = await Promise.all([
    listTenants(user.id),
    listLeases(user.id),
    listUnits(user.id),
    listProperties(user.id),
  ]);

  return <TenantsClient tenants={tenants} leases={leases} units={units} properties={properties} />;
}
