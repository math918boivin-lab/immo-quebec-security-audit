import "server-only";
import { db } from "./db";
import type {
  Lease,
  MaintenanceRequest,
  Payment,
  Property,
  Tenant,
  Unit,
} from "./types";

interface PropertyRow {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  type: string;
  year_built: number;
  notes: string | null;
}

interface UnitRow {
  id: string;
  property_id: string;
  number: string;
  type: string;
  area: number;
  rent: number;
  status: string;
}

interface TenantRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  notes: string | null;
}

interface LeaseRow {
  id: string;
  unit_id: string;
  tenant_id: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  deposit: number;
  status: string;
}

interface PaymentRow {
  id: string;
  lease_id: string;
  amount: number;
  due_date: string;
  paid_date: string | null;
  status: string;
  method: string | null;
}

interface MaintenanceRow {
  id: string;
  unit_id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  resolved_at: string | null;
}

function toProperty(r: PropertyRow): Property {
  return {
    id: r.id,
    name: r.name,
    address: r.address,
    city: r.city,
    postalCode: r.postal_code,
    type: r.type as Property["type"],
    yearBuilt: r.year_built,
    notes: r.notes ?? undefined,
  };
}

function toUnit(r: UnitRow): Unit {
  return {
    id: r.id,
    propertyId: r.property_id,
    number: r.number,
    type: r.type as Unit["type"],
    area: r.area,
    rent: r.rent,
    status: r.status as Unit["status"],
  };
}

function toTenant(r: TenantRow): Tenant {
  return {
    id: r.id,
    firstName: r.first_name,
    lastName: r.last_name,
    email: r.email,
    phone: r.phone,
    status: r.status as Tenant["status"],
    notes: r.notes ?? undefined,
  };
}

function toLease(r: LeaseRow): Lease {
  return {
    id: r.id,
    unitId: r.unit_id,
    tenantId: r.tenant_id,
    startDate: r.start_date,
    endDate: r.end_date,
    monthlyRent: r.monthly_rent,
    deposit: r.deposit,
    status: r.status as Lease["status"],
  };
}

function toPayment(r: PaymentRow): Payment {
  return {
    id: r.id,
    leaseId: r.lease_id,
    amount: r.amount,
    dueDate: r.due_date,
    paidDate: r.paid_date ?? undefined,
    status: r.status as Payment["status"],
    method: (r.method as Payment["method"]) ?? undefined,
  };
}

function toMaintenance(r: MaintenanceRow): MaintenanceRequest {
  return {
    id: r.id,
    unitId: r.unit_id,
    title: r.title,
    description: r.description,
    category: r.category as MaintenanceRequest["category"],
    priority: r.priority as MaintenanceRequest["priority"],
    status: r.status as MaintenanceRequest["status"],
    createdAt: r.created_at,
    resolvedAt: r.resolved_at ?? undefined,
  };
}

export function listProperties(): Property[] {
  return db.prepare<[], PropertyRow>("SELECT * FROM properties ORDER BY name").all().map(toProperty);
}

export function getProperty(id: string): Property | undefined {
  const row = db.prepare<[string], PropertyRow>("SELECT * FROM properties WHERE id = ?").get(id);
  return row ? toProperty(row) : undefined;
}

export function listUnits(): Unit[] {
  return db.prepare<[], UnitRow>("SELECT * FROM units ORDER BY number").all().map(toUnit);
}

export function listUnitsForProperty(propertyId: string): Unit[] {
  return db
    .prepare<[string], UnitRow>("SELECT * FROM units WHERE property_id = ? ORDER BY number")
    .all(propertyId)
    .map(toUnit);
}

export function listTenants(): Tenant[] {
  return db
    .prepare<[], TenantRow>("SELECT * FROM tenants ORDER BY first_name, last_name")
    .all()
    .map(toTenant);
}

export function getTenant(id: string): Tenant | undefined {
  const row = db.prepare<[string], TenantRow>("SELECT * FROM tenants WHERE id = ?").get(id);
  return row ? toTenant(row) : undefined;
}

export function listLeases(): Lease[] {
  return db.prepare<[], LeaseRow>("SELECT * FROM leases ORDER BY start_date DESC").all().map(toLease);
}

export function listLeasesForTenant(tenantId: string): Lease[] {
  return db
    .prepare<[string], LeaseRow>("SELECT * FROM leases WHERE tenant_id = ? ORDER BY start_date DESC")
    .all(tenantId)
    .map(toLease);
}

export function listPayments(): Payment[] {
  return db.prepare<[], PaymentRow>("SELECT * FROM payments ORDER BY due_date DESC").all().map(toPayment);
}

export function listPaymentsForLeases(leaseIds: string[]): Payment[] {
  if (leaseIds.length === 0) return [];
  const placeholders = leaseIds.map(() => "?").join(",");
  return db
    .prepare<
      string[],
      PaymentRow
    >(`SELECT * FROM payments WHERE lease_id IN (${placeholders}) ORDER BY due_date DESC`)
    .all(...leaseIds)
    .map(toPayment);
}

export function listMaintenanceRequests(): MaintenanceRequest[] {
  return db
    .prepare<[], MaintenanceRow>("SELECT * FROM maintenance_requests ORDER BY created_at DESC")
    .all()
    .map(toMaintenance);
}
