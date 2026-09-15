"use server";

import { revalidatePath } from "next/cache";
import { makeId, query, queryOne } from "./db";
import { requireAuth } from "./auth";
import {
  blogPostSchema,
  idSchema,
  leaseSchema,
  maintenanceRequestSchema,
  maintenanceStatusSchema,
  paymentSchema,
  propertySchema,
  tenantSchema,
  unitSchema,
} from "./schemas";

function refreshAll() {
  revalidatePath("/", "layout");
}

async function ownedRow(table: string, id: string, ownerId: string): Promise<{ id: string } | undefined> {
  return queryOne<{ id: string }>(`SELECT id FROM ${table} WHERE id = $1 AND owner_id = $2`, [id, ownerId]);
}

// ----- Immeubles -----

export async function createProperty(input: unknown) {
  const user = await requireAuth();
  const data = propertySchema.parse(input);
  const id = makeId("p");
  await query(
    `INSERT INTO properties (id, owner_id, name, address, city, postal_code, type, year_built, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [id, user.id, data.name, data.address, data.city, data.postalCode, data.type, data.yearBuilt, data.notes || null]
  );
  refreshAll();
  return { id };
}

export async function deleteProperty(input: unknown) {
  const user = await requireAuth();
  const id = idSchema.parse(input);
  await query("DELETE FROM properties WHERE id = $1 AND owner_id = $2", [id, user.id]);
  refreshAll();
}

// ----- Unites -----

export async function createUnit(input: unknown) {
  const user = await requireAuth();
  const data = unitSchema.parse(input);
  if (!(await ownedRow("properties", data.propertyId, user.id))) throw new Error("Immeuble introuvable");
  const id = makeId("u");
  await query(
    `INSERT INTO units (id, owner_id, property_id, number, type, area, rent, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [id, user.id, data.propertyId, data.number, data.type, data.area, data.rent, data.status]
  );
  refreshAll();
  return { id };
}

export async function updateUnit(id: unknown, input: unknown) {
  const user = await requireAuth();
  const unitId = idSchema.parse(id);
  const data = unitSchema.partial().parse(input);
  const existing = await queryOne<Record<string, unknown>>("SELECT * FROM units WHERE id = $1 AND owner_id = $2", [
    unitId,
    user.id,
  ]);
  if (!existing) throw new Error("Unite introuvable");

  await query(
    `UPDATE units SET number = $1, type = $2, area = $3, rent = $4, status = $5 WHERE id = $6 AND owner_id = $7`,
    [
      data.number ?? existing.number,
      data.type ?? existing.type,
      data.area ?? existing.area,
      data.rent ?? existing.rent,
      data.status ?? existing.status,
      unitId,
      user.id,
    ]
  );
  refreshAll();
}

export async function deleteUnit(input: unknown) {
  const user = await requireAuth();
  const id = idSchema.parse(input);
  await query("DELETE FROM units WHERE id = $1 AND owner_id = $2", [id, user.id]);
  refreshAll();
}

// ----- Locataires -----

export async function createTenant(input: unknown) {
  const user = await requireAuth();
  const data = tenantSchema.parse(input);
  const id = makeId("t");
  await query(
    `INSERT INTO tenants (id, owner_id, first_name, last_name, email, phone, status, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [id, user.id, data.firstName, data.lastName, data.email, data.phone, data.status, data.notes || null]
  );
  refreshAll();
  return { id };
}

export async function updateTenant(id: unknown, input: unknown) {
  const user = await requireAuth();
  const tenantId = idSchema.parse(id);
  const data = tenantSchema.parse(input);
  if (!(await ownedRow("tenants", tenantId, user.id))) throw new Error("Locataire introuvable");
  await query(
    `UPDATE tenants SET first_name = $1, last_name = $2, email = $3, phone = $4, status = $5, notes = $6
     WHERE id = $7 AND owner_id = $8`,
    [data.firstName, data.lastName, data.email, data.phone, data.status, data.notes || null, tenantId, user.id]
  );
  refreshAll();
}

export async function deleteTenant(input: unknown) {
  const user = await requireAuth();
  const id = idSchema.parse(input);
  await query("DELETE FROM tenants WHERE id = $1 AND owner_id = $2", [id, user.id]);
  refreshAll();
}

// ----- Baux -----

export async function createLease(input: unknown) {
  const user = await requireAuth();
  const data = leaseSchema.parse(input);
  if (!(await ownedRow("units", data.unitId, user.id))) throw new Error("Unite introuvable");
  if (!(await ownedRow("tenants", data.tenantId, user.id))) throw new Error("Locataire introuvable");

  const id = makeId("l");
  await query(
    `INSERT INTO leases (id, owner_id, unit_id, tenant_id, start_date, end_date, monthly_rent, deposit, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      id,
      user.id,
      data.unitId,
      data.tenantId,
      data.startDate,
      data.endDate,
      data.monthlyRent,
      data.deposit,
      data.status,
    ]
  );

  if (data.status === "actif" || data.status === "a_renouveler") {
    await query("UPDATE units SET status = 'occupee' WHERE id = $1 AND owner_id = $2", [data.unitId, user.id]);
  }

  refreshAll();
  return { id };
}

export async function updateLease(id: unknown, input: unknown) {
  const user = await requireAuth();
  const leaseId = idSchema.parse(id);
  const data = leaseSchema.parse(input);
  if (!(await ownedRow("leases", leaseId, user.id))) throw new Error("Bail introuvable");
  if (!(await ownedRow("units", data.unitId, user.id))) throw new Error("Unite introuvable");
  if (!(await ownedRow("tenants", data.tenantId, user.id))) throw new Error("Locataire introuvable");

  await query(
    `UPDATE leases SET unit_id = $1, tenant_id = $2, start_date = $3, end_date = $4, monthly_rent = $5, deposit = $6, status = $7
     WHERE id = $8 AND owner_id = $9`,
    [
      data.unitId,
      data.tenantId,
      data.startDate,
      data.endDate,
      data.monthlyRent,
      data.deposit,
      data.status,
      leaseId,
      user.id,
    ]
  );

  refreshAll();
}

export async function deleteLease(input: unknown) {
  const user = await requireAuth();
  const id = idSchema.parse(input);
  await query("DELETE FROM leases WHERE id = $1 AND owner_id = $2", [id, user.id]);
  refreshAll();
}

// ----- Paiements -----

export async function createPayment(input: unknown) {
  const user = await requireAuth();
  const data = paymentSchema.parse(input);
  if (!(await ownedRow("leases", data.leaseId, user.id))) throw new Error("Bail introuvable");

  const id = makeId("pay");
  const paidDate = data.status === "paye" ? data.paidDate ?? new Date().toISOString().slice(0, 10) : null;
  await query(
    `INSERT INTO payments (id, owner_id, lease_id, amount, due_date, paid_date, status, method)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [id, user.id, data.leaseId, data.amount, data.dueDate, paidDate, data.status, data.method ?? null]
  );
  refreshAll();
  return { id };
}

export async function markPaymentPaid(input: unknown) {
  const user = await requireAuth();
  const id = idSchema.parse(input);
  if (!(await ownedRow("payments", id, user.id))) throw new Error("Paiement introuvable");
  await query("UPDATE payments SET status = 'paye', paid_date = $1 WHERE id = $2 AND owner_id = $3", [
    new Date().toISOString().slice(0, 10),
    id,
    user.id,
  ]);
  refreshAll();
}

export async function deletePayment(input: unknown) {
  const user = await requireAuth();
  const id = idSchema.parse(input);
  await query("DELETE FROM payments WHERE id = $1 AND owner_id = $2", [id, user.id]);
  refreshAll();
}

// ----- Maintenance -----

export async function createMaintenanceRequest(input: unknown) {
  const user = await requireAuth();
  const data = maintenanceRequestSchema.parse(input);
  if (!(await ownedRow("units", data.unitId, user.id))) throw new Error("Unite introuvable");

  const id = makeId("m");
  await query(
    `INSERT INTO maintenance_requests (id, owner_id, unit_id, title, description, category, priority, status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'ouverte', $8)`,
    [
      id,
      user.id,
      data.unitId,
      data.title,
      data.description || "",
      data.category,
      data.priority,
      new Date().toISOString().slice(0, 10),
    ]
  );
  refreshAll();
  return { id };
}

export async function updateMaintenanceStatus(id: unknown, status: unknown) {
  const user = await requireAuth();
  const requestId = idSchema.parse(id);
  const newStatus = maintenanceStatusSchema.parse(status);
  if (!(await ownedRow("maintenance_requests", requestId, user.id))) throw new Error("Demande introuvable");

  const resolvedAt = newStatus === "resolue" ? new Date().toISOString().slice(0, 10) : null;
  await query("UPDATE maintenance_requests SET status = $1, resolved_at = $2 WHERE id = $3 AND owner_id = $4", [
    newStatus,
    resolvedAt,
    requestId,
    user.id,
  ]);
  refreshAll();
}

export async function deleteMaintenanceRequest(input: unknown) {
  const user = await requireAuth();
  const id = idSchema.parse(input);
  await query("DELETE FROM maintenance_requests WHERE id = $1 AND owner_id = $2", [id, user.id]);
  refreshAll();
}

// ----- Blog -----

export async function createBlogPost(input: unknown) {
  const user = await requireAuth();
  const data = blogPostSchema.parse(input);
  const id = makeId("post");
  const now = new Date().toISOString();
  await query(
    `INSERT INTO blog_posts (id, owner_id, title, content, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [id, user.id, data.title, data.content, data.status, now, now]
  );
  refreshAll();
  return { id };
}

export async function updateBlogPost(id: unknown, input: unknown) {
  const user = await requireAuth();
  const postId = idSchema.parse(id);
  const data = blogPostSchema.parse(input);
  if (!(await ownedRow("blog_posts", postId, user.id))) throw new Error("Billet introuvable");

  await query(
    `UPDATE blog_posts SET title = $1, content = $2, status = $3, updated_at = $4 WHERE id = $5 AND owner_id = $6`,
    [data.title, data.content, data.status, new Date().toISOString(), postId, user.id]
  );
  refreshAll();
}

export async function deleteBlogPost(input: unknown) {
  const user = await requireAuth();
  const id = idSchema.parse(input);
  await query("DELETE FROM blog_posts WHERE id = $1 AND owner_id = $2", [id, user.id]);
  refreshAll();
}
