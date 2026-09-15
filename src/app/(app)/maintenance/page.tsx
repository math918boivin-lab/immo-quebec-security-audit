import { listMaintenanceRequests, listProperties, listUnits } from "@/lib/data";
import { requireAuth } from "@/lib/auth";
import { MaintenanceClient } from "./MaintenanceClient";

export default async function MaintenancePage() {
  const user = await requireAuth();
  const [requests, units, properties] = await Promise.all([
    listMaintenanceRequests(user.id),
    listUnits(user.id),
    listProperties(user.id),
  ]);

  return <MaintenanceClient requests={requests} units={units} properties={properties} />;
}
