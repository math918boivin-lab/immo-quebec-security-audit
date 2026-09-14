import { listLeases, listProperties, listTenants, listUnits } from "@/lib/data";
import { TenantsClient } from "./TenantsClient";

export default async function TenantsPage() {
  const tenants = listTenants();
  const leases = listLeases();
  const units = listUnits();
  const properties = listProperties();

  return <TenantsClient tenants={tenants} leases={leases} units={units} properties={properties} />;
}
