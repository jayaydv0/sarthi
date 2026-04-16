import { createProject } from "@/app/dashboard/actions";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Circle,
  CloudCheck,
  FolderArchive,
  Server,
  SquarePen,
  Upload,
  Zap,
} from "lucide-react";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error: errorCode } = await searchParams;
  const errorMessage =
    errorCode === "validation"
      ? "Enter a project name and local path."
      : errorCode === "save"
        ? "Could not save the project. Check that the Supabase projects table and RLS policies match website/supabase-schema.sql."
        : null;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-10%] left-[5%] h-[300px] w-[300px] rounded-full bg-secondary/5 blur-[80px]" />

      <header className="relative mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="mb-4 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-primary">
            Workspace Initialization
          </p>
          <h2 className="mb-6 text-[2.5rem] font-extrabold leading-none tracking-[-0.03em] md:text-[3.5rem]">
            Start a New <br />
            <span className="text-primary-container">Architectural Journey</span>
          </h2>
          <p className="text-lg font-light leading-relaxed text-on-surface-variant">
            Define the parameters for your next high-performance development
            environment. We&apos;ll handle the scaffolding and infrastructure
            orchestration.
          </p>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-outline-variant/10 bg-surface-container-high p-6">
          <Zap
            className="text-3xl text-secondary"
            strokeWidth={2}
            fill="currentColor"
            aria-hidden
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Active Tier
            </p>
            <p className="font-bold text-on-surface">Pro Cloud Infrastructure</p>
          </div>
        </div>
      </header>

      {errorMessage ? (
        <div
          className="relative mb-8 flex gap-3 rounded-xl border border-[#ffb4ab]/30 bg-[rgba(255,180,171,0.08)] px-5 py-4 text-sm text-[#ffb4ab]"
          role="alert"
        >
          <AlertCircle className="mt-0.5 size-5 shrink-0" strokeWidth={2} aria-hidden />
          <p>{errorMessage}</p>
        </div>
      ) : null}

      <form action={createProject} className="relative grid grid-cols-12 gap-8">
        <div className="col-span-12 space-y-8 lg:col-span-7">
          <div className="rounded-xl bg-surface-container-low p-10">
            <h3 className="mb-8 flex items-center gap-3 text-xl font-bold">
              <SquarePen className="text-primary" strokeWidth={2} aria-hidden />
              Project Identity
            </h3>
            <div className="space-y-10">
              <div className="group">
                <label
                  htmlFor="name"
                  className="mb-4 block text-xs font-bold uppercase tracking-[0.1em] text-slate-400 transition-colors group-focus-within:text-primary"
                >
                  Project Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  placeholder="e.g. ArchitectOS Engine"
                  className="w-full min-w-0 rounded border-none bg-surface-container-lowest px-6 py-4 text-lg text-white outline-none transition-all placeholder:text-slate-600 focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="group">
                <label
                  htmlFor="description"
                  className="mb-4 block text-xs font-bold uppercase tracking-[0.1em] text-slate-400 transition-colors group-focus-within:text-primary"
                >
                  Project Narrative &amp; Scope
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Briefly describe the architectural intent and primary tech stack..."
                  className="w-full min-w-0 resize-none rounded border-none bg-surface-container-lowest px-6 py-4 text-base text-white outline-none transition-all placeholder:text-slate-600 focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="group">
                <label
                  htmlFor="local_path"
                  className="mb-4 block text-xs font-bold uppercase tracking-[0.1em] text-slate-400 transition-colors group-focus-within:text-primary"
                >
                  Local Path
                </label>
                <input
                  id="local_path"
                  name="local_path"
                  required
                  placeholder="C:\dev\my-app"
                  className="w-full min-w-0 rounded border-none bg-surface-container-lowest px-6 py-4 font-mono text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:ring-2 focus:ring-primary/30 break-all sm:break-normal"
                />
              </div>
            </div>
          </div>

          <div className="group relative cursor-pointer overflow-hidden rounded-xl border border-transparent bg-surface-container-low p-10 transition-all hover:border-primary/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="flex items-center gap-3 text-xl font-bold">
                  <FolderArchive
                    className="text-secondary"
                    strokeWidth={2}
                    aria-hidden
                  />
                  Local Environment
                </h3>
                <span className="rounded-full bg-secondary-container/10 px-3 py-1 text-[0.6rem] font-black uppercase text-secondary">
                  Recommended
                </span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-outline-variant/20 p-12 transition-colors group-hover:border-primary/40">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-highest shadow-xl transition-transform group-hover:scale-110">
                  <Upload
                    className="text-3xl text-primary"
                    strokeWidth={2}
                    aria-hidden
                  />
                </div>
                <p className="mb-2 text-lg font-medium text-white">
                  Connect local folder
                </p>
                <p className="max-w-xs text-center text-sm text-slate-400">
                  Use the path above so your sync client can map this project on
                  disk.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 space-y-8 lg:col-span-5">
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-surface-container-high p-8">
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high via-transparent to-transparent" />
            <div className="relative z-10 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-md">
                <div className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-secondary">
                  Real-time Visualization
                </span>
              </div>
              <h4 className="text-2xl font-black text-white">Instance Preview</h4>
              <p className="mt-2 text-sm text-slate-300">
                Visualizing your metadata architecture...
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-surface-container-low p-8">
            <h3 className="mb-8 text-sm font-bold uppercase tracking-widest text-slate-500">
              Deployment Strategy
            </h3>
            <div className="space-y-4">
              <div className="flex cursor-pointer items-center justify-between rounded-lg border border-outline-variant/10 bg-surface-container-highest p-4 transition-colors hover:bg-surface-bright">
                <div className="flex items-center gap-4">
                  <CloudCheck
                    className="text-primary"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <div>
                    <p className="text-sm font-bold">Serverless Edge</p>
                    <p className="text-xs text-slate-500">
                      Auto-scaling latency optimization
                    </p>
                  </div>
                </div>
                <CheckCircle2
                  className="text-primary"
                  strokeWidth={2}
                  aria-hidden
                />
              </div>
              <div className="flex cursor-pointer items-center justify-between rounded-lg border border-outline-variant/10 bg-surface-container-lowest/50 p-4 opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                <div className="flex items-center gap-4">
                  <Server className="text-slate-400" strokeWidth={2} aria-hidden />
                  <div>
                    <p className="text-sm font-bold">Dedicated Node</p>
                    <p className="text-xs text-slate-500">
                      Persistent compute resources
                    </p>
                  </div>
                </div>
                <Circle className="text-slate-600" strokeWidth={2} aria-hidden />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="group relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary-container py-8 shadow-[0_20px_40px_rgba(192,193,255,0.2)] transition-all hover:translate-y-[-4px] active:translate-y-0"
            >
              <span className="relative z-10 text-xl font-black tracking-tight text-on-primary-container">
                Create Project
              </span>
              <ArrowRight
                className="relative z-10 text-2xl text-on-primary-container transition-transform group-hover:translate-x-2"
                strokeWidth={2}
                aria-hidden
              />
            </button>
            <p className="mt-6 text-center text-xs text-slate-500">
              By creating this project, you agree to our{" "}
              <span className="cursor-pointer text-primary hover:underline">
                Computational Standards
              </span>
              .
            </p>
          </div>
        </div>
      </form>

      <footer className="relative mt-24 flex flex-col items-start justify-between gap-12 border-t border-white/5 pb-12 pt-12 text-slate-500 md:flex-row">
        <div className="flex flex-wrap gap-16">
          <div>
            <p className="mb-4 text-[0.65rem] font-black uppercase tracking-[0.2em]">
              Core Engine
            </p>
            <p className="text-sm font-medium">v4.12.0-stable</p>
          </div>
          <div>
            <p className="mb-4 text-[0.65rem] font-black uppercase tracking-[0.2em]">
              Node Affinity
            </p>
            <p className="text-sm font-medium">Global Distributed</p>
          </div>
          <div>
            <p className="mb-4 text-[0.65rem] font-black uppercase tracking-[0.2em]">
              Uptime SLA
            </p>
            <p className="text-sm font-medium text-secondary">99.999%</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-xs">
            System Status: <span className="font-bold text-secondary">Optimal</span>
          </span>
          <div className="h-2 w-2 rounded-full bg-secondary" />
        </div>
      </footer>
    </div>
  );
}
