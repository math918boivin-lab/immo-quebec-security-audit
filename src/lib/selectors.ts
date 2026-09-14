import type { Lease, Property, Tenant, Unit } from "./types";

export function unitLabel(unit: Unit | undefined, property: Property | undefined): string {
  if (!unit) return "Unite inconnue";
  const propName = property ? property.name : "?";
  return `${propName} — ${unit.number}`;
}

export function tenantName(tenant: Tenant | undefined): string {
  if (!tenant) return "Locataire inconnu";
  return tenant.lastName ? `${tenant.firstName} ${tenant.lastName}` : tenant.firstName;
}

export function findUnit(units: Unit[], id: string): Unit | undefined {
  return units.find((u) => u.id === id);
}

export function findProperty(properties: Property[], id: string | undefined): Property | undefined {
  return properties.find((p) => p.id === id);
}

export function findTenant(tenants: Tenant[], id: string): Tenant | undefined {
  return tenants.find((t) => t.id === id);
}

export function findLease(leases: Lease[], id: string): Lease | undefined {
  return leases.find((l) => l.id === id);
}
