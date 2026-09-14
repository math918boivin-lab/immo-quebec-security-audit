import { listMaintenanceRequests, listProperties, listUnits } from "@/lib/data";
import { MaintenanceClient } from "./MaintenanceClient";

export default async function MaintenancePage() {
  const requests = listMaintenanceRequests();
  const units = listUnits();
  const properties = listProperties();

  return <MaintenanceClient requests={requests} units={units} properties={properties} />;
}
