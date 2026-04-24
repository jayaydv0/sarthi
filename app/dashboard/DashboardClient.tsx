"use client";

import { Clock, Database, Ellipsis, Plus, Settings, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useProjects } from "@/hooks/useProjects";
import { useState } from "react";
import { deleteProject } from "@/actions/projects";
import { toast } from "sonner";

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

function formatAgo(iso: string | null | Date): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return `${Math.floor(s / 86400)} d ago`;
}

export function DashboardClient({ initialProjects }: { initialProjects: DashboardProject[] }) {
  const { projects: fetchedProjects, isLoading, mutate } = useProjects();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the project "${name}"? This action cannot be undone.`)) return;
    
    setDeletingId(id);
    try {
      await deleteProject(id);
      toast.success(`Project "${name}" deleted successfully.`);
      mutate();
    } catch (err: any) {
      toast.error(`Failed to delete: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };
  
  // Use initial server data if client data is loading the first time, ensuring no flash of empty content
  const list = fetchedProjects.length > 0 ? fetchedProjects : (isLoading ? initialProjects : []);

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

      <motion.div 
        layout 
        className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3"
      >
        <AnimatePresence>
          {list.map((p) => {
            const st = statusForId(p.id);
            const dot =
              st === "ok"
                ? "bg-[#4ae176] shadow-[0_0_14px_rgba(74,225,118,0.45)]"
                : st === "warn"
                  ? "bg-[#f7be1d] shadow-[0_0_14px_rgba(247,190,29,0.35)]"
                  : "bg-[#ffb4ab] shadow-[0_0_14px_rgba(255,180,171,0.35)]";
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
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
                      {formatAgo(p.createdAt)}
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
                    onClick={() => handleDelete(p.id, p.name)}
                    disabled={deletingId === p.id}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#64748b] hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-50"
                    aria-label="Delete Project"
                  >
                    {deletingId === p.id ? (
                      <Loader2 className="size-5 animate-spin text-red-400" />
                    ) : (
                      <Trash2 className="size-5" strokeWidth={2} aria-hidden />
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <motion.div layout>
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
        </motion.div>
      </motion.div>
    </>
  );
}
