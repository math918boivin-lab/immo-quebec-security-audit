import { listProperties, listUnits } from "@/lib/data";
import { ImmeublesClient } from "./ImmeublesClient";

export default async function PropertiesPage() {
  const properties = listProperties();
  const units = listUnits();
  return <ImmeublesClient properties={properties} units={units} />;
}
