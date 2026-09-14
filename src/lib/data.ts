import "server-only";
import { db } from "./db";
import type {
  BlogPost,
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

interface BlogPostRow {
  id: string;
  title: string;
  content: string;
  status: string;
  created_at: string;
  updated_at: string;
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

function toBlogPost(r: BlogPostRow): BlogPost {
  return {
    id: r.id,
    title: r.title,
    content: r.content,
    status: r.status as BlogPost["status"],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function listProperties(ownerId: string): Property[] {
  return db
    .prepare<[string], PropertyRow>("SELECT * FROM properties WHERE owner_id = ? ORDER BY name")
    .all(ownerId)
    .map(toProperty);
}

export function getProperty(ownerId: string, id: string): Property | undefined {
  const row = db
    .prepare<[string, string], PropertyRow>("SELECT * FROM properties WHERE id = ? AND owner_id = ?")
    .get(id, ownerId);
  return row ? toProperty(row) : undefined;
}

export function listUnits(ownerId: string): Unit[] {
  return db
    .prepare<[string], UnitRow>("SELECT * FROM units WHERE owner_id = ? ORDER BY number")
    .all(ownerId)
    .map(toUnit);
}

export function listUnitsForProperty(ownerId: string, propertyId: string): Unit[] {
  return db
    .prepare<
      [string, string],
      UnitRow
    >("SELECT * FROM units WHERE property_id = ? AND owner_id = ? ORDER BY number")
    .all(propertyId, ownerId)
    .map(toUnit);
}

export function listTenants(ownerId: string): Tenant[] {
  return db
    .prepare<[string], TenantRow>(
      "SELECT * FROM tenants WHERE owner_id = ? ORDER BY first_name, last_name"
    )
    .all(ownerId)
    .map(toTenant);
}

export function getTenant(ownerId: string, id: string): Tenant | undefined {
  const row = db
    .prepare<[string, string], TenantRow>("SELECT * FROM tenants WHERE id = ? AND owner_id = ?")
    .get(id, ownerId);
  return row ? toTenant(row) : undefined;
}

export function listLeases(ownerId: string): Lease[] {
  return db
    .prepare<[string], LeaseRow>("SELECT * FROM leases WHERE owner_id = ? ORDER BY start_date DESC")
    .all(ownerId)
    .map(toLease);
}

export function listLeasesForTenant(ownerId: string, tenantId: string): Lease[] {
  return db
    .prepare<
      [string, string],
      LeaseRow
    >("SELECT * FROM leases WHERE tenant_id = ? AND owner_id = ? ORDER BY start_date DESC")
    .all(tenantId, ownerId)
    .map(toLease);
}

export function listPayments(ownerId: string): Payment[] {
  return db
    .prepare<[string], PaymentRow>("SELECT * FROM payments WHERE owner_id = ? ORDER BY due_date DESC")
    .all(ownerId)
    .map(toPayment);
}

export function listPaymentsForLeases(ownerId: string, leaseIds: string[]): Payment[] {
  if (leaseIds.length === 0) return [];
  const placeholders = leaseIds.map(() => "?").join(",");
  return db
    .prepare<
      string[],
      PaymentRow
    >(`SELECT * FROM payments WHERE owner_id = ? AND lease_id IN (${placeholders}) ORDER BY due_date DESC`)
    .all(ownerId, ...leaseIds)
    .map(toPayment);
}

export function listMaintenanceRequests(ownerId: string): MaintenanceRequest[] {
  return db
    .prepare<
      [string],
      MaintenanceRow
    >("SELECT * FROM maintenance_requests WHERE owner_id = ? ORDER BY created_at DESC")
    .all(ownerId)
    .map(toMaintenance);
}

export function listBlogPosts(ownerId: string): BlogPost[] {
  return db
    .prepare<[string], BlogPostRow>(
      "SELECT * FROM blog_posts WHERE owner_id = ? ORDER BY updated_at DESC"
    )
    .all(ownerId)
    .map(toBlogPost);
}

export function getBlogPost(ownerId: string, id: string): BlogPost | undefined {
  const row = db
    .prepare<[string, string], BlogPostRow>("SELECT * FROM blog_posts WHERE id = ? AND owner_id = ?")
    .get(id, ownerId);
  return row ? toBlogPost(row) : undefined;
}
