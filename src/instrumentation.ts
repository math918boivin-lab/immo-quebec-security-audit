export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { ensureAdminUser } = await import("./lib/auth");
    const { seedDatabaseIfEmpty } = await import("./lib/seed-db");
    seedDatabaseIfEmpty();
    ensureAdminUser();
  }
}
