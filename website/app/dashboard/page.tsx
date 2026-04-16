import { prisma } from "@/lib/prisma";
import { createServerSupabase } from "@/lib/supabase-server";
import { Clock, Database, Ellipsis, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type DashboardProject = {
  id: string;
  name: string;
  localPath: string;
  liveUrl: string | null;
  createdAt: Date | null;
  notes: string | null;
};

function statusForId(id: string): "ok" | "warn" | "err" {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * (i + 1)) % 3;
  return h === 0 ? "ok" : h === 1 ? "warn" : "err";
}

function formatAgo(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return `${Math.floor(s / 86400)} d ago`;
}

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const list: DashboardProject[] = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      localPath: true,
      liveUrl: true,
      createdAt: true,
      notes: true,
    },
  });

  return (
    <>
      <section className="mb-8 flex flex-col justify-between gap-6 md:mb-10 md:flex-row md:items-end">
        <div className="min-w-0">
          <p className="ao-kicker">Workspace</p>
          <h1 className="ao-title-page">Active projects</h1>
        </div>
        <div className="ao-panel shrink-0 px-5 py-4">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b9cb8]">
            Total
          </span>
          <span className="text-2xl font-bold text-white">{list.length}</span>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => {
          const st = statusForId(p.id);
          const dot =
            st === "ok"
              ? "bg-[#4ae176] shadow-[0_0_14px_rgba(74,225,118,0.45)]"
              : st === "warn"
                ? "bg-[#f7be1d] shadow-[0_0_14px_rgba(247,190,29,0.35)]"
                : "bg-[#ffb4ab] shadow-[0_0_14px_rgba(255,180,171,0.35)]";
          return (
            <div
              key={p.id}
              className="ao-panel ao-panel--interactive flex min-w-0 flex-col p-6 sm:p-7"
            >
              <div className="pointer-events-none absolute right-5 top-5 sm:right-6 sm:top-6">
                <div className={`h-2.5 w-2.5 rounded-full ${dot}`} />
              </div>
              <div className="relative min-w-0 pr-7">
                <h2 className="mb-2 truncate text-lg font-bold text-white sm:text-xl">
                  {p.name}
                </h2>
                <p className="line-clamp-2 text-sm leading-relaxed text-[#8b9cb8]">
                  {p.notes?.trim() || p.localPath}
                </p>
              </div>
              <div className="mt-5 space-y-3 border-t border-[rgba(255,255,255,0.08)] pt-5">
                <div className="flex min-w-0 items-start gap-2 text-sm text-[#8b9cb8]">
                  <Database
                    className="mt-0.5 size-4 shrink-0 text-[#64748b]"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span className="min-w-0 break-all font-mono text-[13px] leading-snug text-[#94a3b8]">
                    {p.localPath}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium uppercase tracking-[0.06em] text-[#64748b]">
                  <span className="inline-flex items-center gap-1.5 normal-case tracking-normal">
                    <Clock className="size-4" strokeWidth={2} aria-hidden />
                    {formatAgo(p.createdAt?.toISOString() ?? null)}
                  </span>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/project/${p.id}/files`}
                    className="ao-btn-primary px-5"
                  >
                    Open
                  </Link>
                  <Link
                    href={`/project/${p.id}/edit`}
                    className="ao-btn-ghost"
                    aria-label="Settings"
                  >
                    <Settings className="size-5" strokeWidth={2} aria-hidden />
                  </Link>
                </div>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#64748b] hover:bg-[rgba(255,255,255,0.06)] hover:text-white"
                  aria-label="More"
                >
                  <Ellipsis className="size-5" strokeWidth={2} aria-hidden />
                </button>
              </div>
            </div>
          );
        })}

        <Link
          href="/dashboard/new"
          className="ao-panel ao-panel--interactive ao-panel-dashed flex min-h-[260px] flex-col items-center justify-center gap-3 p-8 text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(192,193,255,0.1)] text-[#c0c1ff]">
            <Plus className="size-8" strokeWidth={2} aria-hidden />
          </div>
          <h2 className="text-lg font-bold text-white">New project</h2>
          <p className="max-w-xs text-sm text-[#8b9cb8]">
            Add a name and local path to start syncing.
          </p>
        </Link>
      </div>
    </>
  );
}
