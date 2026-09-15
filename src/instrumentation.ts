export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { ensureAdminUser } = await import("./lib/auth");
    const { seedDatabaseForOwner } = await import("./lib/seed-db");
    const adminUserId = ensureAdminUser();
    if (adminUserId) {
      seedDatabaseForOwner(adminUserId);
    }
  }
}
