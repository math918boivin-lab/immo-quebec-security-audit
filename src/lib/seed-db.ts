import "server-only";
import { db } from "./db";
import {
  seedLeases,
  seedMaintenanceRequests,
  seedPayments,
  seedProperties,
  seedTenants,
  seedUnits,
} from "./seed";

/**
 * Peuple la base avec le jeu de donnees de demonstration, rattache a un
 * seul compte (ownerId) — typiquement le compte admin cree par
 * ensureAdminUser() au premier demarrage. N'est jamais execute pour un
 * compte cree via l'inscription libre : un nouveau compte demarre avec des
 * donnees vides et privees.
 */
export function seedDatabaseForOwner(ownerId: string): void {
  const existing = db.prepare("SELECT id FROM properties WHERE owner_id = ? LIMIT 1").get(ownerId);
  if (existing) return;

  const insertMany = db.transaction(() => {
    const insertProperty = db.prepare(
      `INSERT INTO properties (id, owner_id, name, address, city, postal_code, type, year_built, notes)
       VALUES (@id, @ownerId, @name, @address, @city, @postalCode, @type, @yearBuilt, @notes)`
    );
    for (const p of seedProperties) insertProperty.run({ ...p, ownerId, notes: p.notes ?? null });

    const insertUnit = db.prepare(
      `INSERT INTO units (id, owner_id, property_id, number, type, area, rent, status)
       VALUES (@id, @ownerId, @propertyId, @number, @type, @area, @rent, @status)`
    );
    for (const u of seedUnits) insertUnit.run({ ...u, ownerId });

    const insertTenant = db.prepare(
      `INSERT INTO tenants (id, owner_id, first_name, last_name, email, phone, status, notes)
       VALUES (@id, @ownerId, @firstName, @lastName, @email, @phone, @status, @notes)`
    );
    for (const t of seedTenants) insertTenant.run({ ...t, ownerId, notes: t.notes ?? null });

    const insertLease = db.prepare(
      `INSERT INTO leases (id, owner_id, unit_id, tenant_id, start_date, end_date, monthly_rent, deposit, status)
       VALUES (@id, @ownerId, @unitId, @tenantId, @startDate, @endDate, @monthlyRent, @deposit, @status)`
    );
    for (const l of seedLeases) insertLease.run({ ...l, ownerId });

    const insertPayment = db.prepare(
      `INSERT INTO payments (id, owner_id, lease_id, amount, due_date, paid_date, status, method)
       VALUES (@id, @ownerId, @leaseId, @amount, @dueDate, @paidDate, @status, @method)`
    );
    for (const pay of seedPayments)
      insertPayment.run({ ...pay, ownerId, paidDate: pay.paidDate ?? null, method: pay.method ?? null });

    const insertMaintenance = db.prepare(
      `INSERT INTO maintenance_requests (id, owner_id, unit_id, title, description, category, priority, status, created_at, resolved_at)
       VALUES (@id, @ownerId, @unitId, @title, @description, @category, @priority, @status, @createdAt, @resolvedAt)`
    );
    for (const m of seedMaintenanceRequests)
      insertMaintenance.run({ ...m, ownerId, resolvedAt: m.resolvedAt ?? null });
  });

  insertMany();
  console.warn(`[db] Donnees de demonstration initialisees pour le compte ${ownerId}.`);
}
