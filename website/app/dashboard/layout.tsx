import { DashboardTopNav } from "@/components/dashboard-top-nav";
import { StudioSidebar } from "@/components/studio-sidebar";
import { createServerSupabase } from "@/lib/supabase-server";
import { Rocket } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const avatarUrl =
    user?.user_metadata?.avatar_url ??
    user?.user_metadata?.picture ??
    null;

  return (
    <div className="ao-app min-w-0">
      <DashboardTopNav
        avatarUrl={typeof avatarUrl === "string" ? avatarUrl : null}
        emailHint={user?.email ?? null}
      />
      <StudioSidebar />
      <div className="flex min-w-0 pt-20">
        <div className="hidden w-72 shrink-0 md:block" aria-hidden />
        <main className="mx-auto min-h-[calc(100vh-5rem)] w-full min-w-0 max-w-[1600px] flex-1 p-4 sm:p-6 lg:p-10">
          {children}
        </main>
      </div>
      <Link href="/dashboard/new" className="ao-fab" aria-label="New project">
        <Rocket
          className="size-7 text-[#0d0096]"
          strokeWidth={2}
          fill="currentColor"
          aria-hidden
        />
      </Link>
    </div>
  );
}
