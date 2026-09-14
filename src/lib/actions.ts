"use server";

import { revalidatePath } from "next/cache";
import { db, makeId } from "./db";
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

function ownedRow(table: string, id: string, ownerId: string): { id: string } | undefined {
  return db
    .prepare<[string, string], { id: string }>(`SELECT id FROM ${table} WHERE id = ? AND owner_id = ?`)
    .get(id, ownerId);
}

// ----- Immeubles -----

export async function createProperty(input: unknown) {
  const user = await requireAuth();
  const data = propertySchema.parse(input);
  const id = makeId("p");
  db.prepare(
    `INSERT INTO properties (id, owner_id, name, address, city, postal_code, type, year_built, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, user.id, data.name, data.address, data.city, data.postalCode, data.type, data.yearBuilt, data.notes || null);
  refreshAll();
  return { id };
}

export async function deleteProperty(input: unknown) {
  const user = await requireAuth();
  const id = idSchema.parse(input);
  db.prepare("DELETE FROM properties WHERE id = ? AND owner_id = ?").run(id, user.id);
  refreshAll();
}

// ----- Unites -----

export async function createUnit(input: unknown) {
  const user = await requireAuth();
  const data = unitSchema.parse(input);
  if (!ownedRow("properties", data.propertyId, user.id)) throw new Error("Immeuble introuvable");
  const id = makeId("u");
  db.prepare(
    `INSERT INTO units (id, owner_id, property_id, number, type, area, rent, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, user.id, data.propertyId, data.number, data.type, data.area, data.rent, data.status);
  refreshAll();
  return { id };
}

export async function updateUnit(id: unknown, input: unknown) {
  const user = await requireAuth();
  const unitId = idSchema.parse(id);
  const data = unitSchema.partial().parse(input);
  const existing = db
    .prepare("SELECT * FROM units WHERE id = ? AND owner_id = ?")
    .get(unitId, user.id) as Record<string, unknown> | undefined;
  if (!existing) throw new Error("Unite introuvable");

  db.prepare(
    `UPDATE units SET number = ?, type = ?, area = ?, rent = ?, status = ? WHERE id = ? AND owner_id = ?`
  ).run(
    data.number ?? existing.number,
    data.type ?? existing.type,
    data.area ?? existing.area,
    data.rent ?? existing.rent,
    data.status ?? existing.status,
    unitId,
    user.id
  );
  refreshAll();
}

export async function deleteUnit(input: unknown) {
  const user = await requireAuth();
  const id = idSchema.parse(input);
  db.prepare("DELETE FROM units WHERE id = ? AND owner_id = ?").run(id, user.id);
  refreshAll();
}

// ----- Locataires -----

export async function createTenant(input: unknown) {
  const user = await requireAuth();
  const data = tenantSchema.parse(input);
  const id = makeId("t");
  db.prepare(
    `INSERT INTO tenants (id, owner_id, first_name, last_name, email, phone, status, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, user.id, data.firstName, data.lastName, data.email, data.phone, data.status, data.notes || null);
  refreshAll();
  return { id };
}

export async function updateTenant(id: unknown, input: unknown) {
  const user = await requireAuth();
  const tenantId = idSchema.parse(id);
  const data = tenantSchema.parse(input);
  if (!ownedRow("tenants", tenantId, user.id)) throw new Error("Locataire introuvable");
  db.prepare(
    `UPDATE tenants SET first_name = ?, last_name = ?, email = ?, phone = ?, status = ?, notes = ?
     WHERE id = ? AND owner_id = ?`
  ).run(data.firstName, data.lastName, data.email, data.phone, data.status, data.notes || null, tenantId, user.id);
  refreshAll();
}

export async function deleteTenant(input: unknown) {
  const user = await requireAuth();
  const id = idSchema.parse(input);
  db.prepare("DELETE FROM tenants WHERE id = ? AND owner_id = ?").run(id, user.id);
  refreshAll();
}

// ----- Baux -----

export async function createLease(input: unknown) {
  const user = await requireAuth();
  const data = leaseSchema.parse(input);
  if (!ownedRow("units", data.unitId, user.id)) throw new Error("Unite introuvable");
  if (!ownedRow("tenants", data.tenantId, user.id)) throw new Error("Locataire introuvable");

  const id = makeId("l");
  db.prepare(
    `INSERT INTO leases (id, owner_id, unit_id, tenant_id, start_date, end_date, monthly_rent, deposit, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, user.id, data.unitId, data.tenantId, data.startDate, data.endDate, data.monthlyRent, data.deposit, data.status);

  if (data.status === "actif" || data.status === "a_renouveler") {
    db.prepare("UPDATE units SET status = 'occupee' WHERE id = ? AND owner_id = ?").run(data.unitId, user.id);
  }

  refreshAll();
  return { id };
}

export async function updateLease(id: unknown, input: unknown) {
  const user = await requireAuth();
  const leaseId = idSchema.parse(id);
  const data = leaseSchema.parse(input);
  if (!ownedRow("leases", leaseId, user.id)) throw new Error("Bail introuvable");
  if (!ownedRow("units", data.unitId, user.id)) throw new Error("Unite introuvable");
  if (!ownedRow("tenants", data.tenantId, user.id)) throw new Error("Locataire introuvable");

  db.prepare(
    `UPDATE leases SET unit_id = ?, tenant_id = ?, start_date = ?, end_date = ?, monthly_rent = ?, deposit = ?, status = ?
     WHERE id = ? AND owner_id = ?`
  ).run(data.unitId, data.tenantId, data.startDate, data.endDate, data.monthlyRent, data.deposit, data.status, leaseId, user.id);

  refreshAll();
}

export async function deleteLease(input: unknown) {
  const user = await requireAuth();
  const id = idSchema.parse(input);
  db.prepare("DELETE FROM leases WHERE id = ? AND owner_id = ?").run(id, user.id);
  refreshAll();
}

// ----- Paiements -----

export async function createPayment(input: unknown) {
  const user = await requireAuth();
  const data = paymentSchema.parse(input);
  if (!ownedRow("leases", data.leaseId, user.id)) throw new Error("Bail introuvable");

  const id = makeId("pay");
  const paidDate = data.status === "paye" ? data.paidDate ?? new Date().toISOString().slice(0, 10) : null;
  db.prepare(
    `INSERT INTO payments (id, owner_id, lease_id, amount, due_date, paid_date, status, method)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, user.id, data.leaseId, data.amount, data.dueDate, paidDate, data.status, data.method ?? null);
  refreshAll();
  return { id };
}

export async function markPaymentPaid(input: unknown) {
  const user = await requireAuth();
  const id = idSchema.parse(input);
  if (!ownedRow("payments", id, user.id)) throw new Error("Paiement introuvable");
  db.prepare("UPDATE payments SET status = 'paye', paid_date = ? WHERE id = ? AND owner_id = ?").run(
    new Date().toISOString().slice(0, 10),
    id,
    user.id
  );
  refreshAll();
}

export async function deletePayment(input: unknown) {
  const user = await requireAuth();
  const id = idSchema.parse(input);
  db.prepare("DELETE FROM payments WHERE id = ? AND owner_id = ?").run(id, user.id);
  refreshAll();
}

// ----- Maintenance -----

export async function createMaintenanceRequest(input: unknown) {
  const user = await requireAuth();
  const data = maintenanceRequestSchema.parse(input);
  if (!ownedRow("units", data.unitId, user.id)) throw new Error("Unite introuvable");

  const id = makeId("m");
  db.prepare(
    `INSERT INTO maintenance_requests (id, owner_id, unit_id, title, description, category, priority, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'ouverte', ?)`
  ).run(id, user.id, data.unitId, data.title, data.description || "", data.category, data.priority, new Date().toISOString().slice(0, 10));
  refreshAll();
  return { id };
}

export async function updateMaintenanceStatus(id: unknown, status: unknown) {
  const user = await requireAuth();
  const requestId = idSchema.parse(id);
  const newStatus = maintenanceStatusSchema.parse(status);
  if (!ownedRow("maintenance_requests", requestId, user.id)) throw new Error("Demande introuvable");

  const resolvedAt = newStatus === "resolue" ? new Date().toISOString().slice(0, 10) : null;
  db.prepare("UPDATE maintenance_requests SET status = ?, resolved_at = ? WHERE id = ? AND owner_id = ?").run(
    newStatus,
    resolvedAt,
    requestId,
    user.id
  );
  refreshAll();
}

export async function deleteMaintenanceRequest(input: unknown) {
  const user = await requireAuth();
  const id = idSchema.parse(input);
  db.prepare("DELETE FROM maintenance_requests WHERE id = ? AND owner_id = ?").run(id, user.id);
  refreshAll();
}

// ----- Blog -----

export async function createBlogPost(input: unknown) {
  const user = await requireAuth();
  const data = blogPostSchema.parse(input);
  const id = makeId("post");
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO blog_posts (id, owner_id, title, content, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, user.id, data.title, data.content, data.status, now, now);
  refreshAll();
  return { id };
}

export async function updateBlogPost(id: unknown, input: unknown) {
  const user = await requireAuth();
  const postId = idSchema.parse(id);
  const data = blogPostSchema.parse(input);
  if (!ownedRow("blog_posts", postId, user.id)) throw new Error("Billet introuvable");

  db.prepare(
    `UPDATE blog_posts SET title = ?, content = ?, status = ?, updated_at = ? WHERE id = ? AND owner_id = ?`
  ).run(data.title, data.content, data.status, new Date().toISOString(), postId, user.id);
  refreshAll();
}

export async function deleteBlogPost(input: unknown) {
  const user = await requireAuth();
  const id = idSchema.parse(input);
  db.prepare("DELETE FROM blog_posts WHERE id = ? AND owner_id = ?").run(id, user.id);
  refreshAll();
}
