import { updateProjectSettings } from "@/app/project/actions";
import { prisma } from "@/lib/prisma";
import { createServerSupabase } from "@/lib/supabase-server";
import { Save } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    notFound();
  }

  const project = await prisma.project.findFirst({
    where: { id, userId: user.id },
    select: {
      id: true,
      name: true,
      localPath: true,
      liveUrl: true,
      envSecrets: true,
      notes: true,
    },
  });

  if (!project) {
    notFound();
  }

  const action = updateProjectSettings.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-0">
      <div className="mb-6 flex items-center gap-3 text-sm text-slate-500">
        <Link
          href={`/project/${id}/files`}
          className="text-primary hover:underline"
        >
          ← Code
        </Link>
        <span className="text-white/20">/</span>
        <span>Settings</span>
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-white">
        Project settings
      </h1>
      <p className="mt-2 text-on-surface-variant">
        Live URL, notes, and environment values for your own reference.
      </p>

      <div
        className="mt-6 rounded-xl border border-tertiary/30 bg-tertiary/10 px-4 py-3 text-sm text-tertiary-fixed"
        role="note"
      >
        Secrets are stored as plain text in your Supabase database. Use RLS and a
        trusted project; do not commit real production keys if this is a demo.
      </div>

      <form action={action} className="mt-8 flex flex-col gap-6">
        <label className="flex flex-col gap-2">
          <span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-outline">
            Name
          </span>
          <input
            name="name"
            required
            defaultValue={project.name}
            className="rounded border-none bg-surface-container-lowest px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-outline">
            Local path
          </span>
          <input
            name="local_path"
            required
            defaultValue={project.localPath}
            className="rounded border-none bg-surface-container-lowest px-4 py-3 font-mono text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-outline">
            Live URL
          </span>
          <input
            name="live_url"
            type="url"
            placeholder="https://my-app.vercel.app"
            defaultValue={project.liveUrl ?? ""}
            className="rounded border-none bg-surface-container-lowest px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-outline">
            Environment (.env)
          </span>
          <textarea
            name="env_secrets"
            rows={10}
            placeholder={"API_KEY=...\nDATABASE_URL=..."}
            defaultValue={project.envSecrets ?? ""}
            className="resize-none rounded border-none bg-surface-container-lowest px-4 py-3 font-mono text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
            autoComplete="off"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-outline">
            Notes
          </span>
          <textarea
            name="notes"
            rows={4}
            placeholder="Deploy notes, team contacts, …"
            defaultValue={project.notes ?? ""}
            className="resize-none rounded border-none bg-surface-container-lowest px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <button
          type="submit"
          className="flex w-fit items-center gap-2 rounded-full bg-gradient-to-br from-primary to-primary-container px-8 py-3 text-sm font-bold text-on-primary-container transition-transform active:scale-95"
        >
          <Save className="size-5" strokeWidth={2} aria-hidden />
          Save
        </button>
      </form>
    </div>
  );
}
