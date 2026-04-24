"use client";

import type { LucideIcon } from "lucide-react";
import {
  CirclePlus,
  DraftingCompass,
  LayoutDashboard,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type StudioNavId = "overview" | "add" | "profile" | "settings";

const items: {
  id: StudioNavId;
  href: string;
  label: string;
  Icon: LucideIcon;
}[] = [
  { id: "overview", href: "/dashboard", label: "Overview", Icon: LayoutDashboard },
  {
    id: "add",
    href: "/dashboard/new",
    label: "Add Project",
    Icon: CirclePlus,
  },
  {
    id: "profile",
    href: "/dashboard/profile",
    label: "Profile",
    Icon: User,
  },
  {
    id: "settings",
    href: "/dashboard/settings",
    label: "Settings",
    Icon: Settings,
  },
];

function pathToActive(pathname: string): StudioNavId {
  if (pathname.startsWith("/dashboard/new")) return "add";
  if (pathname.startsWith("/dashboard/profile")) return "profile";
  if (pathname.startsWith("/dashboard/settings")) return "settings";
  return "overview";
}

export function StudioSidebar() {
  const pathname = usePathname();
  const active = pathToActive(pathname);

  return (
    <aside className="ao-sidebar">
      <div className="ao-sidebar-brand">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] shadow-lg">
            <DraftingCompass
              className="size-5 text-[#0d0096]"
              strokeWidth={2}
              fill="currentColor"
              aria-hidden
            />
          </div>
          <div>
            <p className="text-lg font-bold text-[#c0c1ff]">Dev Studio</p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748b]">
              Premium
            </p>
          </div>
        </div>
      </div>
      <nav className="flex flex-1 flex-col px-0 pt-1">
        {items.map((item) => {
          const isActive = item.id === active;
          const Icon = item.Icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className="ao-navlink"
              data-active={isActive ? "true" : "false"}
            >
              <Icon
                className="size-6 shrink-0"
                strokeWidth={isActive ? 2.5 : 2}
                aria-hidden
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="ao-sidebar-cta">
        <Link href="/dashboard/new">Deploy new</Link>
      </div>
    </aside>
  );
}
