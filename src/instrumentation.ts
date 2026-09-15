export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { runMigrations } = await import("./lib/db");
    const { ensureAdminUser } = await import("./lib/auth");
    const { seedDatabaseForOwner } = await import("./lib/seed-db");
    await runMigrations();
    const adminUserId = await ensureAdminUser();
    if (adminUserId) {
      await seedDatabaseForOwner(adminUserId);
    }
  }
}
