"use client";

import { Bell, History } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { toast } from "sonner";

function navLinkClass(active: boolean) {
  return active
    ? "border-b-2 border-primary pb-1 text-sm font-semibold text-primary"
    : "text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface";
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
          onClick={() => toast.info("You have no new notifications.")}
          className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
          aria-label="Notifications"
        >
          <Bell className="size-5" strokeWidth={2} aria-hidden />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-secondary ring-2 ring-surface" />
        </button>
        <button
          type="button"
          onClick={() => toast.info("No recent sync activity detected.")}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
          aria-label="History"
        >
          <History className="size-5" strokeWidth={2} aria-hidden />
        </button>
        <Link
          href="/dashboard/profile"
          className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 p-0.5 outline-none ring-offset-2 ring-offset-surface transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary"
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
            <div className="flex h-full w-full items-center justify-center rounded-full bg-surface-container-high text-sm font-bold text-primary">
              {(emailHint ?? "?").slice(0, 1).toUpperCase()}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}
