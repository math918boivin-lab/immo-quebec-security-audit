import "server-only";
import { pool, queryOne } from "./db";
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
export async function seedDatabaseForOwner(ownerId: string): Promise<void> {
  const existing = await queryOne<{ id: string }>("SELECT id FROM properties WHERE owner_id = $1 LIMIT 1", [
    ownerId,
  ]);
  if (existing) return;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const p of seedProperties) {
      await client.query(
        `INSERT INTO properties (id, owner_id, name, address, city, postal_code, type, year_built, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [p.id, ownerId, p.name, p.address, p.city, p.postalCode, p.type, p.yearBuilt, p.notes ?? null]
      );
    }

    for (const u of seedUnits) {
      await client.query(
        `INSERT INTO units (id, owner_id, property_id, number, type, area, rent, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [u.id, ownerId, u.propertyId, u.number, u.type, u.area, u.rent, u.status]
      );
    }

    for (const t of seedTenants) {
      await client.query(
        `INSERT INTO tenants (id, owner_id, first_name, last_name, email, phone, status, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [t.id, ownerId, t.firstName, t.lastName, t.email, t.phone, t.status, t.notes ?? null]
      );
    }

    for (const l of seedLeases) {
      await client.query(
        `INSERT INTO leases (id, owner_id, unit_id, tenant_id, start_date, end_date, monthly_rent, deposit, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [l.id, ownerId, l.unitId, l.tenantId, l.startDate, l.endDate, l.monthlyRent, l.deposit, l.status]
      );
    }

    for (const pay of seedPayments) {
      await client.query(
        `INSERT INTO payments (id, owner_id, lease_id, amount, due_date, paid_date, status, method)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [pay.id, ownerId, pay.leaseId, pay.amount, pay.dueDate, pay.paidDate ?? null, pay.status, pay.method ?? null]
      );
    }

    for (const m of seedMaintenanceRequests) {
      await client.query(
        `INSERT INTO maintenance_requests (id, owner_id, unit_id, title, description, category, priority, status, created_at, resolved_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          m.id,
          ownerId,
          m.unitId,
          m.title,
          m.description,
          m.category,
          m.priority,
          m.status,
          m.createdAt,
          m.resolvedAt ?? null,
        ]
      );
    }

    await client.query("COMMIT");
    console.warn(`[db] Donnees de demonstration initialisees pour le compte ${ownerId}.`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
