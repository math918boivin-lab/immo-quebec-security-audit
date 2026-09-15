import { listLeases, listPayments, listProperties, listTenants, listUnits } from "@/lib/data";
import { requireAuth } from "@/lib/auth";
import { PaymentsClient } from "./PaymentsClient";

export default async function PaymentsPage() {
  const user = await requireAuth();
  const [payments, leases, units, properties, tenants] = await Promise.all([
    listPayments(user.id),
    listLeases(user.id),
    listUnits(user.id),
    listProperties(user.id),
    listTenants(user.id),
  ]);

  return (
    <PaymentsClient payments={payments} leases={leases} units={units} properties={properties} tenants={tenants} />
  );
}
