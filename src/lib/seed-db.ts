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

export function seedDatabaseIfEmpty(): void {
  const existing = db.prepare("SELECT id FROM properties LIMIT 1").get();
  if (existing) return;

  const insertMany = db.transaction(() => {
    const insertProperty = db.prepare(
      `INSERT INTO properties (id, name, address, city, postal_code, type, year_built, notes)
       VALUES (@id, @name, @address, @city, @postalCode, @type, @yearBuilt, @notes)`
    );
    for (const p of seedProperties) insertProperty.run({ ...p, notes: p.notes ?? null });

    const insertUnit = db.prepare(
      `INSERT INTO units (id, property_id, number, type, area, rent, status)
       VALUES (@id, @propertyId, @number, @type, @area, @rent, @status)`
    );
    for (const u of seedUnits) insertUnit.run(u);

    const insertTenant = db.prepare(
      `INSERT INTO tenants (id, first_name, last_name, email, phone, status, notes)
       VALUES (@id, @firstName, @lastName, @email, @phone, @status, @notes)`
    );
    for (const t of seedTenants) insertTenant.run({ ...t, notes: t.notes ?? null });

    const insertLease = db.prepare(
      `INSERT INTO leases (id, unit_id, tenant_id, start_date, end_date, monthly_rent, deposit, status)
       VALUES (@id, @unitId, @tenantId, @startDate, @endDate, @monthlyRent, @deposit, @status)`
    );
    for (const l of seedLeases) insertLease.run(l);

    const insertPayment = db.prepare(
      `INSERT INTO payments (id, lease_id, amount, due_date, paid_date, status, method)
       VALUES (@id, @leaseId, @amount, @dueDate, @paidDate, @status, @method)`
    );
    for (const pay of seedPayments)
      insertPayment.run({ ...pay, paidDate: pay.paidDate ?? null, method: pay.method ?? null });

    const insertMaintenance = db.prepare(
      `INSERT INTO maintenance_requests (id, unit_id, title, description, category, priority, status, created_at, resolved_at)
       VALUES (@id, @unitId, @title, @description, @category, @priority, @status, @createdAt, @resolvedAt)`
    );
    for (const m of seedMaintenanceRequests)
      insertMaintenance.run({ ...m, resolvedAt: m.resolvedAt ?? null });
  });

  insertMany();
  console.warn("[db] Donnees de demonstration initialisees.");
}
