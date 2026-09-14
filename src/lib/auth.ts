import "server-only";
import { cookies } from "next/headers";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { db, makeId } from "./db";

const SESSION_COOKIE = "immo_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 jours
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 1000 * 60 * 15; // 15 minutes

export interface SessionUser {
  id: string;
  email: string;
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  failed_attempts: number;
  locked_until: string | null;
}

export type LoginResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "locked" };

export async function attemptLogin(email: string, password: string): Promise<LoginResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = db
    .prepare<[string], UserRow>("SELECT * FROM users WHERE email = ?")
    .get(normalizedEmail);

  // Toujours effectuer un hash pour eviter de reveler par le temps de reponse
  // si le compte existe ou non (attenuation d'attaque par canal temporel).
  const decoyHash = "$2a$12$C6UzMDM.H6dfI/f/IKcEeO0wgAKr2qk3hZQ7/8h5f6qX7wZ8sD5Pm";

  if (!user) {
    await bcrypt.compare(password, decoyHash);
    return { ok: false, reason: "invalid" };
  }

  if (user.locked_until && new Date(user.locked_until).getTime() > Date.now()) {
    return { ok: false, reason: "locked" };
  }

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    const attempts = user.failed_attempts + 1;
    if (attempts >= MAX_FAILED_ATTEMPTS) {
      const lockedUntil = new Date(Date.now() + LOCKOUT_MS).toISOString();
      db.prepare("UPDATE users SET failed_attempts = ?, locked_until = ? WHERE id = ?").run(
        attempts,
        lockedUntil,
        user.id
      );
      return { ok: false, reason: "locked" };
    }
    db.prepare("UPDATE users SET failed_attempts = ? WHERE id = ?").run(attempts, user.id);
    return { ok: false, reason: "invalid" };
  }

  db.prepare("UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE id = ?").run(user.id);
  await createSession(user.id);
  return { ok: true };
}

export async function createSession(userId: string): Promise<void> {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();

  db.prepare(
    "INSERT INTO sessions (id, token_hash, user_id, expires_at) VALUES (?, ?, ?, ?)"
  ).run(makeId("sess"), tokenHash, userId, expiresAt);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const tokenHash = hashToken(token);
  const row = db
    .prepare<[string], { user_id: string; expires_at: string; email: string }>(
      `SELECT sessions.user_id as user_id, sessions.expires_at as expires_at, users.email as email
       FROM sessions JOIN users ON users.id = sessions.user_id
       WHERE sessions.token_hash = ?`
    )
    .get(tokenHash);

  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash);
    return null;
  }

  return { id: row.user_id, email: row.email };
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(hashToken(token));
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}

export function ensureAdminUser(): void {
  const existing = db.prepare("SELECT id FROM users LIMIT 1").get();
  if (existing) return;

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn(
      "[auth] Aucun utilisateur admin trouve et ADMIN_EMAIL/ADMIN_PASSWORD non definis. " +
        "Definissez ces variables d'environnement puis redemarrez pour creer le premier compte."
    );
    return;
  }

  if (password.length < 12) {
    console.warn("[auth] ADMIN_PASSWORD doit contenir au moins 12 caracteres. Compte non cree.");
    return;
  }

  const passwordHash = bcrypt.hashSync(password, 12);
  db.prepare("INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)").run(
    makeId("user"),
    email.trim().toLowerCase(),
    passwordHash
  );
  console.warn(`[auth] Compte administrateur cree pour ${email}.`);
}
