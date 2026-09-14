import { listLeases, listPayments, listProperties, listTenants, listUnits } from "@/lib/data";
import { PaymentsClient } from "./PaymentsClient";

export default async function PaymentsPage() {
  const payments = listPayments();
  const leases = listLeases();
  const units = listUnits();
  const properties = listProperties();
  const tenants = listTenants();

  return (
    <PaymentsClient payments={payments} leases={leases} units={units} properties={properties} tenants={tenants} />
  );
}
