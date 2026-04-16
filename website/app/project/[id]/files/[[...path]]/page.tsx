import { FileTypeIcon } from "@/components/file-type-icon";
import { ProjectFileTree } from "@/components/project-file-tree";
import { pathsToTree } from "@/lib/file-tree";
import { prisma } from "@/lib/prisma";
import { createServerSupabase } from "@/lib/supabase-server";
import { CheckCircle2, Download, FolderPlus, Rocket } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

function formatSynced(iso: string | null | undefined): string {
  if (!iso) return "—";
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 120) return "2 mins ago";
  if (s < 3600) return `${Math.floor(s / 60)} mins ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} hours ago`;
  return `${Math.floor(s / 86400)} days ago`;
}

export default async function ProjectFilesPage({
  params,
}: {
  params: Promise<{ id: string; path?: string[] }>;
}) {
  const { id, path: pathSegments } = await params;
  const filePath =
    pathSegments && pathSegments.length > 0
      ? pathSegments.map((s) => decodeURIComponent(s)).join("/")
      : null;

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    notFound();
  }

  const project = await prisma.project.findFirst({
    where: { id, userId: user.id },
    select: { id: true, name: true, createdAt: true },
  });

  if (!project) {
    notFound();
  }

  type FileRow = {
    path: string;
    content: string;
    storagePath: string | null;
    updatedAt: Date | null;
  };
  const files: FileRow[] = await prisma.projectFile.findMany({
    where: { projectId: id },
    select: {
      path: true,
      content: true,
      storagePath: true,
      updatedAt: true,
    },
    orderBy: { path: "asc" },
  });
  const selected = filePath
    ? files.find((f) => f.path === filePath)
    : undefined;

  if (filePath && !selected) {
    notFound();
  }

  const paths = files.map((f) => f.path);
  const tree = pathsToTree(paths);
  const lastTouch = files.reduce<string | null>((acc, f) => {
    const t = f.updatedAt?.toISOString() ?? null;
    if (!t) return acc;
    if (!acc || t > acc) return t;
    return acc;
  }, null);

  const lines =
    selected?.content != null
      ? selected.content.replace(/\r\n/g, "\n").split("\n")
      : [];

  const downloadHref =
    filePath && selected
      ? `/api/project/${id}/files/download?path=${encodeURIComponent(selected.path)}`
      : null;

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-1 overflow-hidden">
      <aside className="flex w-72 shrink-0 flex-col border-r border-white/5 bg-[#111c2d]">
        <div className="border-b border-white/5 p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Explorer
            </span>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-white"
              aria-label="New folder (coming soon)"
            >
              <FolderPlus className="size-4" strokeWidth={2} aria-hidden />
            </button>
          </div>
          <h2 className="text-lg font-bold text-on-surface">{project.name}</h2>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto py-4">
          {files.length === 0 ? (
            <p className="px-6 text-sm text-slate-500">
              No files yet. Your sync tool can insert rows into{" "}
              <code className="font-mono text-xs text-primary/80">
                project_files
              </code>
              .
            </p>
          ) : (
            <ProjectFileTree
              projectId={id}
              nodes={tree}
              selectedPath={filePath}
            />
          )}
        </nav>
        <div className="p-6">
          <Link
            href="/dashboard/new"
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-primary to-primary-container py-4 text-sm font-bold uppercase tracking-wide text-on-primary transition-transform active:scale-95"
          >
            Deploy New
          </Link>
        </div>
      </aside>

      <main className="flex min-h-0 min-w-0 flex-1 flex-col bg-surface">
        <div className="flex min-h-20 shrink-0 flex-col gap-4 border-b border-white/5 bg-[#081425] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold tracking-tight text-on-surface sm:text-xl">
                {project.name}
              </h1>
              <div className="mt-1 flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-secondary" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Last synced: {formatSynced(lastTouch)}
                </span>
              </div>
            </div>
            <div className="hidden h-8 w-px shrink-0 bg-white/5 sm:block" />
            <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
              <span className="rounded-full border border-secondary/20 bg-surface-container-high px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-secondary-fixed">
                Main Branch
              </span>
              <span className="text-xs text-slate-500">workspace</span>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end sm:gap-3">
            {downloadHref ? (
              <a
                href={downloadHref}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/5 bg-surface-container-high px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-bright sm:px-5 sm:py-2.5"
              >
                <Download className="size-5" strokeWidth={2} aria-hidden />
                <span className="hidden sm:inline">Download file</span>
                <span className="sm:hidden">Download</span>
              </a>
            ) : (
              <span
                className="inline-flex min-h-10 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/5 px-4 py-2 text-sm font-semibold text-slate-600 opacity-70 sm:px-5 sm:py-2.5"
                title="Select a file in the explorer"
              >
                <Download className="size-5" strokeWidth={2} aria-hidden />
                <span className="hidden sm:inline">Download file</span>
                <span className="sm:hidden">Download</span>
              </span>
            )}
            <Link
              href={`/project/${id}/edit`}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-on-primary hover:opacity-90 sm:px-5 sm:py-2.5"
            >
              <Rocket className="size-5" strokeWidth={2} aria-hidden />
              <span className="hidden sm:inline">Project settings</span>
              <span className="sm:hidden">Settings</span>
            </Link>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden bg-surface-container-lowest p-8">
          {!filePath ? (
            <div className="text-sm text-slate-500">
              {files.length === 0
                ? "Add files to browse source here."
                : "Select a file from the explorer."}
            </div>
          ) : selected ? (
            <div className="flex h-full min-h-[320px] w-full flex-col overflow-hidden rounded-xl border border-white/5 bg-surface-container-low shadow-2xl">
              <div className="flex h-12 shrink-0 items-center rounded-t-xl bg-surface-container-high px-2">
                <div className="flex h-full items-center gap-2 border-t-2 border-primary bg-surface-container-low px-4 text-sm font-medium text-on-surface">
                  <FileTypeIcon
                    name={selected.path.split("/").pop() ?? selected.path}
                    className="size-4 text-primary"
                    strokeWidth={2}
                  />
                  {selected.path.split("/").pop()}
                </div>
              </div>
              <div className="relative min-h-0 flex-1 overflow-auto p-6 font-mono text-sm leading-relaxed">
                <div className="grid grid-cols-[3rem_1fr] gap-6">
                  <div className="space-y-1 text-right text-slate-600 opacity-50 select-none">
                    {lines.map((_line: string, i: number) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  <pre className="min-w-0 whitespace-pre-wrap break-words text-slate-300">
                    <code>{selected.content}</code>
                  </pre>
                </div>
                <div className="glass-panel pointer-events-none absolute bottom-6 right-4 flex items-center gap-4 rounded-2xl border border-white/10 p-3 shadow-2xl sm:bottom-8 sm:right-8 sm:gap-6 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-container/20">
                      <CheckCircle2
                        className="size-4 text-secondary"
                        strokeWidth={2}
                        fill="currentColor"
                        aria-hidden
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">
                        Viewer
                      </span>
                      <span className="text-xs font-bold text-on-surface">
                        Read-only
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
