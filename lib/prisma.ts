import { PrismaClient } from "@prisma/client";

/** Prisma rejects URLs with stray CR/LF or BOM around the value (common on Windows .env files). */
function normalizeDatabaseUrlEnv(): void {
  const raw = process.env.DATABASE_URL;
  if (typeof raw !== "string") return;
  let s = raw.trim();
  if (s.charCodeAt(0) === 0xfeff) s = s.slice(1).trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  if (s !== raw) process.env.DATABASE_URL = s;
}

/**
 * Unescaped @ ? # or spaces in the password break URL parsing (Prisma often reports "invalid port").
 * Supabase hosts always match @aws-…pooler… or @db.….supabase.co — split there, then encode the password.
 */
function encodePasswordIfSupabasePostgresUrl(url: string): string {
  const lower = url.toLowerCase();
  const atAws = lower.indexOf("@aws-");
  const atDb = lower.indexOf("@db.");
  let split = -1;
  if (atAws !== -1 && (atDb === -1 || atAws < atDb)) split = atAws;
  else if (atDb !== -1) split = atDb;
  if (split === -1) return url;

  const prefix = url.slice(0, split);
  const hostAndRest = url.slice(split + 1);
  const m = prefix.match(/^(postgres(?:ql)?:\/\/)([^:]+):([\s\S]*)$/i);
  if (!m) return url;
  const [, scheme, user, password] = m;
  if (!/[?#@\s]/.test(password)) return url;
  return `${scheme}${user}:${encodeURIComponent(password)}@${hostAndRest}`;
}

function applyDatabaseUrlFixes(): void {
  normalizeDatabaseUrlEnv();
  const cur = process.env.DATABASE_URL;
  if (typeof cur !== "string" || cur.length === 0) return;
  const fixed = encodePasswordIfSupabasePostgresUrl(cur);
  if (fixed !== cur) process.env.DATABASE_URL = fixed;
}

applyDatabaseUrlFixes();

type GlobalPrisma = typeof globalThis & {
  __prisma?: PrismaClient;
  __prismaDatabaseUrl?: string;
};

const g = globalThis as GlobalPrisma;

const resolvedDatabaseUrl = process.env.DATABASE_URL ?? "";

if (g.__prisma && g.__prismaDatabaseUrl !== resolvedDatabaseUrl) {
  void g.__prisma.$disconnect().catch(() => {});
  g.__prisma = undefined;
}

export const prisma = g.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  g.__prisma = prisma;
  g.__prismaDatabaseUrl = resolvedDatabaseUrl;
}
