import "server-only";
import { query, queryOne } from "./db";
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

export async function listProperties(ownerId: string): Promise<Property[]> {
  const rows = await query<PropertyRow>("SELECT * FROM properties WHERE owner_id = $1 ORDER BY name", [ownerId]);
  return rows.map(toProperty);
}

export async function getProperty(ownerId: string, id: string): Promise<Property | undefined> {
  const row = await queryOne<PropertyRow>("SELECT * FROM properties WHERE id = $1 AND owner_id = $2", [id, ownerId]);
  return row ? toProperty(row) : undefined;
}

export async function listUnits(ownerId: string): Promise<Unit[]> {
  const rows = await query<UnitRow>("SELECT * FROM units WHERE owner_id = $1 ORDER BY number", [ownerId]);
  return rows.map(toUnit);
}

export async function listUnitsForProperty(ownerId: string, propertyId: string): Promise<Unit[]> {
  const rows = await query<UnitRow>(
    "SELECT * FROM units WHERE property_id = $1 AND owner_id = $2 ORDER BY number",
    [propertyId, ownerId]
  );
  return rows.map(toUnit);
}

export async function listTenants(ownerId: string): Promise<Tenant[]> {
  const rows = await query<TenantRow>(
    "SELECT * FROM tenants WHERE owner_id = $1 ORDER BY first_name, last_name",
    [ownerId]
  );
  return rows.map(toTenant);
}

export async function getTenant(ownerId: string, id: string): Promise<Tenant | undefined> {
  const row = await queryOne<TenantRow>("SELECT * FROM tenants WHERE id = $1 AND owner_id = $2", [id, ownerId]);
  return row ? toTenant(row) : undefined;
}

export async function listLeases(ownerId: string): Promise<Lease[]> {
  const rows = await query<LeaseRow>("SELECT * FROM leases WHERE owner_id = $1 ORDER BY start_date DESC", [ownerId]);
  return rows.map(toLease);
}

export async function listLeasesForTenant(ownerId: string, tenantId: string): Promise<Lease[]> {
  const rows = await query<LeaseRow>(
    "SELECT * FROM leases WHERE tenant_id = $1 AND owner_id = $2 ORDER BY start_date DESC",
    [tenantId, ownerId]
  );
  return rows.map(toLease);
}

export async function listPayments(ownerId: string): Promise<Payment[]> {
  const rows = await query<PaymentRow>("SELECT * FROM payments WHERE owner_id = $1 ORDER BY due_date DESC", [
    ownerId,
  ]);
  return rows.map(toPayment);
}

export async function listPaymentsForLeases(ownerId: string, leaseIds: string[]): Promise<Payment[]> {
  if (leaseIds.length === 0) return [];
  const placeholders = leaseIds.map((_, i) => `$${i + 2}`).join(",");
  const rows = await query<PaymentRow>(
    `SELECT * FROM payments WHERE owner_id = $1 AND lease_id IN (${placeholders}) ORDER BY due_date DESC`,
    [ownerId, ...leaseIds]
  );
  return rows.map(toPayment);
}

export async function listMaintenanceRequests(ownerId: string): Promise<MaintenanceRequest[]> {
  const rows = await query<MaintenanceRow>(
    "SELECT * FROM maintenance_requests WHERE owner_id = $1 ORDER BY created_at DESC",
    [ownerId]
  );
  return rows.map(toMaintenance);
}

export async function listBlogPosts(ownerId: string): Promise<BlogPost[]> {
  const rows = await query<BlogPostRow>("SELECT * FROM blog_posts WHERE owner_id = $1 ORDER BY updated_at DESC", [
    ownerId,
  ]);
  return rows.map(toBlogPost);
}

export async function getBlogPost(ownerId: string, id: string): Promise<BlogPost | undefined> {
  const row = await queryOne<BlogPostRow>("SELECT * FROM blog_posts WHERE id = $1 AND owner_id = $2", [id, ownerId]);
  return row ? toBlogPost(row) : undefined;
}
