import { listLeases, listPayments, listProperties, listTenants, listUnits } from "@/lib/data";
import { requireAuth } from "@/lib/auth";
import { PaymentsClient } from "./PaymentsClient";

export default async function PaymentsPage() {
  const user = await requireAuth();
  const payments = listPayments(user.id);
  const leases = listLeases(user.id);
  const units = listUnits(user.id);
  const properties = listProperties(user.id);
  const tenants = listTenants(user.id);

  return (
    <PaymentsClient payments={payments} leases={leases} units={units} properties={properties} tenants={tenants} />
  );
}
