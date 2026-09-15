import { listLeases, listProperties, listTenants, listUnits } from "@/lib/data";
import { requireAuth } from "@/lib/auth";
import { TenantsClient } from "./TenantsClient";

export default async function TenantsPage() {
  const user = await requireAuth();
  const tenants = listTenants(user.id);
  const leases = listLeases(user.id);
  const units = listUnits(user.id);
  const properties = listProperties(user.id);

  return <TenantsClient tenants={tenants} leases={leases} units={units} properties={properties} />;
}
