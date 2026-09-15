import { listProperties, listUnits } from "@/lib/data";
import { requireAuth } from "@/lib/auth";
import { ImmeublesClient } from "./ImmeublesClient";

export default async function PropertiesPage() {
  const user = await requireAuth();
  const [properties, units] = await Promise.all([listProperties(user.id), listUnits(user.id)]);
  return <ImmeublesClient properties={properties} units={units} />;
}
