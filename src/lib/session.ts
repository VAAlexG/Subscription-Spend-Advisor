import { headers } from "next/headers";
import { getDb, getBindings } from "@/lib/cloudflare";

export type AdvisorSession = { userId: string; email: string; name: string; firmId: string; role: "FIRM_ADMIN" | "ADVISOR" };

export async function requireAdvisor(): Promise<AdvisorSession> {
  const requestHeaders = await headers();
  const env = await getBindings();
  const accessEmail = requestHeaders.get("cf-access-authenticated-user-email")?.toLowerCase();
  const devEmail = process.env.NODE_ENV !== "production" ? "advisor@versatileaccounting.com.au" : undefined;
  const email = accessEmail ?? devEmail;
  if (!email) throw new Error("Cloudflare Access authentication is required");

  const db = await getDb();
  const firmId = env.FIRM_ID || "firm_va";
  const firmName = env.FIRM_NAME || "Versatile Accounting";
  await db.prepare("INSERT OR IGNORE INTO firms (id, name) VALUES (?, ?)").bind(firmId, firmName).run();
  const userId = `user_${await sha256(email)}`;
  await db.prepare("INSERT OR IGNORE INTO users (id, email, name, external_subject) VALUES (?, ?, ?, ?)")
    .bind(userId, email, email.split("@")[0], email).run();
  const count = await db.prepare("SELECT COUNT(*) AS total FROM memberships WHERE firm_id = ?").bind(firmId).first<{ total: number }>();
  if (Number(count?.total ?? 0) === 0) {
    await db.prepare("INSERT INTO memberships (id, firm_id, user_id, role) VALUES (?, ?, ?, 'FIRM_ADMIN')")
      .bind(crypto.randomUUID(), firmId, userId).run();
  }
  const membership = await db.prepare("SELECT role FROM memberships WHERE firm_id = ? AND user_id = ? AND client_id IS NULL")
    .bind(firmId, userId).first<{ role: string }>();
  if (!membership || !["FIRM_ADMIN", "ADVISOR"].includes(membership.role)) throw new Error("Advisor access is not configured for this account");
  return { userId, email, name: email.split("@")[0], firmId, role: membership.role as AdvisorSession["role"] };
}

async function sha256(input: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(bytes)).map((byte) => byte.toString(16).padStart(2, "0")).join("").slice(0, 24);
}
