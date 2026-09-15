import { listProperties, listUnits } from "@/lib/data";
import { requireAuth } from "@/lib/auth";
import { ImmeublesClient } from "./ImmeublesClient";

export default async function PropertiesPage() {
  const user = await requireAuth();
  const properties = listProperties(user.id);
  const units = listUnits(user.id);
  return <ImmeublesClient properties={properties} units={units} />;
}
