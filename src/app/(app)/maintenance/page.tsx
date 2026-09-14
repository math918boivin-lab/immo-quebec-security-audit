import { listMaintenanceRequests, listProperties, listUnits } from "@/lib/data";
import { requireAuth } from "@/lib/auth";
import { MaintenanceClient } from "./MaintenanceClient";

export default async function MaintenancePage() {
  const user = await requireAuth();
  const requests = listMaintenanceRequests(user.id);
  const units = listUnits(user.id);
  const properties = listProperties(user.id);

  return <MaintenanceClient requests={requests} units={units} properties={properties} />;
}
