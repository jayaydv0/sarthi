import { BrandLogo } from "@/components/brand-logo";
import { prisma } from "@/lib/prisma";
import { createServerSupabase } from "@/lib/supabase-server";
import {
  Bell,
  CirclePlus,
  History,
  LayoutDashboard,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProjectLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}>) {
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
    select: { id: true, name: true },
  });

  if (!project) {
    notFound();
  }
  const avatarUrl =
    user?.user_metadata?.avatar_url ??
    user?.user_metadata?.picture ??
    null;

  return (
    <div className="ao-app flex min-h-screen min-w-0 flex-col">
      <header className="fixed left-0 right-0 top-0 z-50 flex h-20 min-w-0 max-w-full items-center justify-between gap-3 overflow-x-clip border-t border-white/10 bg-[#081425]/80 px-4 shadow-ambient backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-8">
          <BrandLogo href="/dashboard" />
          <nav className="hidden min-w-0 items-center gap-4 md:flex lg:gap-6">
            <Link
              href="/dashboard"
              className="border-b-2 border-primary pb-1 text-primary transition-colors hover:text-white"
            >
              Overview
            </Link>
            <Link
              href="/dashboard/new"
              className="font-medium text-slate-400 transition-colors hover:text-white"
            >
              Add Project
            </Link>
            <Link
              href="/dashboard/profile"
              className="font-medium text-slate-400 transition-colors hover:text-white"
            >
              Profile
            </Link>
            <Link
              href="/dashboard/settings"
              className="font-medium text-slate-400 transition-colors hover:text-white"
            >
              Settings
            </Link>
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-400 hover:bg-white/5 hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="size-5" strokeWidth={2} aria-hidden />
          </button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-400 hover:bg-white/5 hover:text-white"
            aria-label="History"
          >
            <History className="size-5" strokeWidth={2} aria-hidden />
          </button>
          <Link
            href="/dashboard/profile"
            className="h-10 w-10 overflow-hidden rounded-full border border-primary/20 outline-none ring-primary/40 ring-offset-2 ring-offset-[#081425] transition-opacity hover:opacity-90 focus-visible:ring-2"
            aria-label="Profile"
          >
            {typeof avatarUrl === "string" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surface-container-high text-sm font-bold text-primary">
                {(user?.email ?? "?").slice(0, 1).toUpperCase()}
              </div>
            )}
          </Link>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col pb-24 pt-20 md:pb-0">
        {children}
      </main>

      <nav
        className="glass-panel fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 px-2 py-2 shadow-2xl md:hidden"
        aria-label="Workspace"
      >
        <Link
          href="/dashboard"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full text-primary hover:bg-white/5"
        >
          <LayoutDashboard
            className="size-6 text-primary"
            strokeWidth={2}
            fill="currentColor"
            aria-hidden
          />
        </Link>
        <Link
          href="/dashboard/new"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <CirclePlus className="size-6" strokeWidth={2} aria-hidden />
        </Link>
        <Link
          href="/dashboard/profile"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <User className="size-6" strokeWidth={2} aria-hidden />
        </Link>
        <Link
          href="/dashboard/settings"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <Settings className="size-6" strokeWidth={2} aria-hidden />
        </Link>
      </nav>
    </div>
  );
}
