import { listLeases, listProperties, listTenants, listUnits } from "@/lib/data";
import { LeasesClient } from "./LeasesClient";

export default async function LeasesPage() {
  const leases = listLeases();
  const units = listUnits();
  const properties = listProperties();
  const tenants = listTenants();

  return <LeasesClient leases={leases} units={units} properties={properties} tenants={tenants} />;
}
