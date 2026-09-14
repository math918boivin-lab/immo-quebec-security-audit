"use server";

import { revalidatePath } from "next/cache";
import { db, makeId } from "./db";
import { requireAuth } from "./auth";
import {
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

// ----- Immeubles -----

export async function createProperty(input: unknown) {
  await requireAuth();
  const data = propertySchema.parse(input);
  const id = makeId("p");
  db.prepare(
    `INSERT INTO properties (id, name, address, city, postal_code, type, year_built, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.name, data.address, data.city, data.postalCode, data.type, data.yearBuilt, data.notes || null);
  refreshAll();
  return { id };
}

export async function deleteProperty(input: unknown) {
  await requireAuth();
  const id = idSchema.parse(input);
  db.prepare("DELETE FROM properties WHERE id = ?").run(id);
  refreshAll();
}

// ----- Unites -----

export async function createUnit(input: unknown) {
  await requireAuth();
  const data = unitSchema.parse(input);
  const property = db.prepare("SELECT id FROM properties WHERE id = ?").get(data.propertyId);
  if (!property) throw new Error("Immeuble introuvable");
  const id = makeId("u");
  db.prepare(
    `INSERT INTO units (id, property_id, number, type, area, rent, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.propertyId, data.number, data.type, data.area, data.rent, data.status);
  refreshAll();
  return { id };
}

export async function updateUnit(id: unknown, input: unknown) {
  await requireAuth();
  const unitId = idSchema.parse(id);
  const data = unitSchema.partial().parse(input);
  const existing = db.prepare("SELECT * FROM units WHERE id = ?").get(unitId) as
    | Record<string, unknown>
    | undefined;
  if (!existing) throw new Error("Unite introuvable");

  db.prepare(
    `UPDATE units SET number = ?, type = ?, area = ?, rent = ?, status = ? WHERE id = ?`
  ).run(
    data.number ?? existing.number,
    data.type ?? existing.type,
    data.area ?? existing.area,
    data.rent ?? existing.rent,
    data.status ?? existing.status,
    unitId
  );
  refreshAll();
}

export async function deleteUnit(input: unknown) {
  await requireAuth();
  const id = idSchema.parse(input);
  db.prepare("DELETE FROM units WHERE id = ?").run(id);
  refreshAll();
}

// ----- Locataires -----

export async function createTenant(input: unknown) {
  await requireAuth();
  const data = tenantSchema.parse(input);
  const id = makeId("t");
  db.prepare(
    `INSERT INTO tenants (id, first_name, last_name, email, phone, status, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.firstName, data.lastName, data.email, data.phone, data.status, data.notes || null);
  refreshAll();
  return { id };
}

export async function updateTenant(id: unknown, input: unknown) {
  await requireAuth();
  const tenantId = idSchema.parse(id);
  const data = tenantSchema.parse(input);
  const existing = db.prepare("SELECT id FROM tenants WHERE id = ?").get(tenantId);
  if (!existing) throw new Error("Locataire introuvable");
  db.prepare(
    `UPDATE tenants SET first_name = ?, last_name = ?, email = ?, phone = ?, status = ?, notes = ? WHERE id = ?`
  ).run(data.firstName, data.lastName, data.email, data.phone, data.status, data.notes || null, tenantId);
  refreshAll();
}

export async function deleteTenant(input: unknown) {
  await requireAuth();
  const id = idSchema.parse(input);
  db.prepare("DELETE FROM tenants WHERE id = ?").run(id);
  refreshAll();
}

// ----- Baux -----

export async function createLease(input: unknown) {
  await requireAuth();
  const data = leaseSchema.parse(input);
  const unit = db.prepare("SELECT id FROM units WHERE id = ?").get(data.unitId);
  const tenant = db.prepare("SELECT id FROM tenants WHERE id = ?").get(data.tenantId);
  if (!unit) throw new Error("Unite introuvable");
  if (!tenant) throw new Error("Locataire introuvable");

  const id = makeId("l");
  db.prepare(
    `INSERT INTO leases (id, unit_id, tenant_id, start_date, end_date, monthly_rent, deposit, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.unitId, data.tenantId, data.startDate, data.endDate, data.monthlyRent, data.deposit, data.status);

  if (data.status === "actif" || data.status === "a_renouveler") {
    db.prepare("UPDATE units SET status = 'occupee' WHERE id = ?").run(data.unitId);
  }

  refreshAll();
  return { id };
}

export async function updateLease(id: unknown, input: unknown) {
  await requireAuth();
  const leaseId = idSchema.parse(id);
  const data = leaseSchema.parse(input);
  const existing = db.prepare("SELECT id FROM leases WHERE id = ?").get(leaseId);
  if (!existing) throw new Error("Bail introuvable");
  const unit = db.prepare("SELECT id FROM units WHERE id = ?").get(data.unitId);
  const tenant = db.prepare("SELECT id FROM tenants WHERE id = ?").get(data.tenantId);
  if (!unit) throw new Error("Unite introuvable");
  if (!tenant) throw new Error("Locataire introuvable");

  db.prepare(
    `UPDATE leases SET unit_id = ?, tenant_id = ?, start_date = ?, end_date = ?, monthly_rent = ?, deposit = ?, status = ?
     WHERE id = ?`
  ).run(data.unitId, data.tenantId, data.startDate, data.endDate, data.monthlyRent, data.deposit, data.status, leaseId);

  refreshAll();
}

export async function deleteLease(input: unknown) {
  await requireAuth();
  const id = idSchema.parse(input);
  db.prepare("DELETE FROM leases WHERE id = ?").run(id);
  refreshAll();
}

// ----- Paiements -----

export async function createPayment(input: unknown) {
  await requireAuth();
  const data = paymentSchema.parse(input);
  const lease = db.prepare("SELECT id FROM leases WHERE id = ?").get(data.leaseId);
  if (!lease) throw new Error("Bail introuvable");

  const id = makeId("pay");
  const paidDate = data.status === "paye" ? data.paidDate ?? new Date().toISOString().slice(0, 10) : null;
  db.prepare(
    `INSERT INTO payments (id, lease_id, amount, due_date, paid_date, status, method)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.leaseId, data.amount, data.dueDate, paidDate, data.status, data.method ?? null);
  refreshAll();
  return { id };
}

export async function markPaymentPaid(input: unknown) {
  await requireAuth();
  const id = idSchema.parse(input);
  const existing = db.prepare("SELECT id FROM payments WHERE id = ?").get(id);
  if (!existing) throw new Error("Paiement introuvable");
  db.prepare("UPDATE payments SET status = 'paye', paid_date = ? WHERE id = ?").run(
    new Date().toISOString().slice(0, 10),
    id
  );
  refreshAll();
}

export async function deletePayment(input: unknown) {
  await requireAuth();
  const id = idSchema.parse(input);
  db.prepare("DELETE FROM payments WHERE id = ?").run(id);
  refreshAll();
}

// ----- Maintenance -----

export async function createMaintenanceRequest(input: unknown) {
  await requireAuth();
  const data = maintenanceRequestSchema.parse(input);
  const unit = db.prepare("SELECT id FROM units WHERE id = ?").get(data.unitId);
  if (!unit) throw new Error("Unite introuvable");

  const id = makeId("m");
  db.prepare(
    `INSERT INTO maintenance_requests (id, unit_id, title, description, category, priority, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 'ouverte', ?)`
  ).run(id, data.unitId, data.title, data.description || "", data.category, data.priority, new Date().toISOString().slice(0, 10));
  refreshAll();
  return { id };
}

export async function updateMaintenanceStatus(id: unknown, status: unknown) {
  await requireAuth();
  const requestId = idSchema.parse(id);
  const newStatus = maintenanceStatusSchema.parse(status);
  const existing = db.prepare("SELECT id FROM maintenance_requests WHERE id = ?").get(requestId);
  if (!existing) throw new Error("Demande introuvable");

  const resolvedAt = newStatus === "resolue" ? new Date().toISOString().slice(0, 10) : null;
  db.prepare("UPDATE maintenance_requests SET status = ?, resolved_at = ? WHERE id = ?").run(
    newStatus,
    resolvedAt,
    requestId
  );
  refreshAll();
}

export async function deleteMaintenanceRequest(input: unknown) {
  await requireAuth();
  const id = idSchema.parse(input);
  db.prepare("DELETE FROM maintenance_requests WHERE id = ?").run(id);
  refreshAll();
}
