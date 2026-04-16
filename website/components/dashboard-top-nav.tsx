"use client";

import { Bell, History } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";

function navLinkClass(active: boolean) {
  return active
    ? "border-b-2 border-[#c0c1ff] pb-1 text-sm font-semibold text-[#c0c1ff]"
    : "text-sm font-medium text-[#64748b] transition-colors hover:text-white";
}

export function DashboardTopNav({
  avatarUrl,
  emailHint,
}: {
  avatarUrl?: string | null;
  emailHint?: string | null;
}) {
  const pathname = usePathname();
  const dashboardActive = pathname === "/dashboard";
  const resourcesActive = pathname.startsWith("/dashboard/resources");
  const analyticsActive = pathname.startsWith("/dashboard/analytics");

  return (
    <header className="ao-dash-header">
      <div className="flex min-w-0 flex-1 items-center gap-6 md:gap-10">
        <BrandLogo href="/dashboard" />
        <nav className="hidden min-w-0 items-center gap-6 md:flex lg:gap-8">
          <Link href="/dashboard" className={navLinkClass(dashboardActive)}>
            Dashboard
          </Link>
          <Link href="/dashboard/resources" className={navLinkClass(resourcesActive)}>
            Resources
          </Link>
          <Link href="/dashboard/analytics" className={navLinkClass(analyticsActive)}>
            Analytics
          </Link>
        </nav>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl text-[#94a3b8] hover:bg-[rgba(255,255,255,0.06)] hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="size-5" strokeWidth={2} aria-hidden />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#4ae176] ring-2 ring-[rgba(8,20,37,0.95)]" />
        </button>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-[#94a3b8] hover:bg-[rgba(255,255,255,0.06)] hover:text-white"
          aria-label="History"
        >
          <History className="size-5" strokeWidth={2} aria-hidden />
        </button>
        <Link
          href="/dashboard/profile"
          className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-[rgba(192,193,255,0.25)] p-0.5 outline-none ring-offset-2 ring-offset-[#081425] transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#c0c1ff]"
          aria-label="Profile"
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt=""
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#1c2739] text-sm font-bold text-[#c0c1ff]">
              {(emailHint ?? "?").slice(0, 1).toUpperCase()}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}
