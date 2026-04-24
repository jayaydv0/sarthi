import {
  ExternalLink,
  History,
  Palette,
  RefreshCw,
  Terminal,
  Trash2,
  TriangleAlert,
  WifiOff,
} from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-server";
import { InteractiveToastButton } from "@/components/interactive-toast-button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default async function SettingsPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const display =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <div className="relative">
      <header className="mb-16 flex items-end justify-between">
        <div className="max-w-2xl">
          <h2 className="mb-4 text-[2.5rem] font-bold leading-none tracking-[-0.02em] text-on-surface md:text-[3.5rem]">
            Settings
          </h2>
          <p className="max-w-lg text-lg leading-relaxed text-on-surface-variant">
            Configure your workspace environment, manage cloud synchronization, and
            monitor system resources.
          </p>
        </div>
        <div className="hidden lg:block">
          <div className="flex items-center gap-4 rounded-full border border-outline-variant/10 bg-surface-container-high p-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-highest text-lg font-bold text-primary">
              {display.slice(0, 1).toUpperCase()}
            </div>
            <div className="pr-6">
              <p className="text-sm font-bold text-on-surface">{display}</p>
              <p className="text-xs text-secondary">Pro Account</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 items-start gap-8">
        <div className="col-span-12 space-y-8 lg:col-span-7">
          <ThemeSwitcher />

          <section className="rounded-xl bg-surface-container-high p-10">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h3 className="mb-1 text-2xl font-semibold">Cloud Sync</h3>
                <p className="text-sm text-on-surface-variant">
                  Manage automated repository backups
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container/20 text-secondary">
                <RefreshCw
                  className="size-6"
                  strokeWidth={2}
                  aria-hidden
                />
              </div>
            </div>
            <div className="space-y-6">
              {user?.id ? (
                <div className="rounded-lg border border-outline-variant/15 bg-surface-container-lowest p-4">
                  <p className="mb-2 text-sm font-semibold text-on-surface">
                    Local sync engine
                  </p>
                  <p className="mb-3 text-xs leading-relaxed text-on-surface-variant">
                    Run <code className="text-primary/90">sync-engine</code> on your machine
                    with the same Supabase project. Set{" "}
                    <code className="text-primary/90">SYNC_USER_ID</code> in{" "}
                    <code className="text-primary/90">sync-engine/.env</code> to this value, and
                    use your project&apos;s <span className="font-medium">local folder path</span>{" "}
                    in the app so it matches the directory you watch.
                  </p>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    SYNC_USER_ID
                  </p>
                  <code className="block break-all rounded-md bg-surface-container-high px-3 py-2 font-mono text-[11px] text-slate-300 select-all">
                    {user.id}
                  </code>
                </div>
              ) : null}
              <div className="flex items-center justify-between rounded-lg bg-surface-container-lowest p-4">
                <div className="flex items-center gap-4">
                  <History className="text-outline" strokeWidth={2} aria-hidden />
                  <div>
                    <p className="font-medium">Real-time Auto-Sync</p>
                    <p className="text-xs text-on-surface-variant">
                      Sync changes immediately as they occur
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold uppercase text-secondary">
                  On
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container-lowest p-4">
                <div className="flex items-center gap-4">
                  <WifiOff className="text-outline" strokeWidth={2} aria-hidden />
                  <div>
                    <p className="font-medium">Offline Mode</p>
                    <p className="text-xs text-on-surface-variant">
                      Enable local-only work during outages
                    </p>
                  </div>
                </div>
                <span className="text-xs text-outline">Off</span>
              </div>
            </div>
          </section>
        </div>

        <div className="col-span-12 space-y-8 lg:col-span-5">
          <section className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-10">
            <h3 className="mb-6 text-xl font-semibold">System Storage</h3>
            <div className="mb-10">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <span className="text-4xl font-bold tracking-tighter text-primary">
                    —
                  </span>
                  <span className="ml-1 text-lg font-medium text-on-surface-variant">
                    tracked
                  </span>
                </div>
                <span className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                  Via sync client
                </span>
              </div>
              <div className="flex h-4 w-full overflow-hidden rounded-full bg-surface-container-high">
                <div className="h-full w-[45%] bg-gradient-to-r from-primary to-primary-container" />
                <div className="ml-[2px] h-full w-[15%] bg-secondary" />
                <div className="ml-[2px] h-full w-[10%] bg-tertiary" />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <Legend dot="bg-primary" label="Projects (45%)" />
                <Legend dot="bg-secondary" label="Backups (15%)" />
                <Legend dot="bg-tertiary" label="Cache (10%)" />
                <Legend dot="bg-surface-container-high" label="Free (30%)" />
              </div>
            </div>
            <InteractiveToastButton
              message="System cache and unused references have been cleared! (45MB freed)"
              className="w-full rounded-lg border border-outline-variant/30 py-3 text-sm font-semibold transition-colors hover:bg-surface-container-high"
            >
              Clean Up Workspace
            </InteractiveToastButton>
          </section>

          <section className="rounded-xl border border-error/20 bg-error-container/5 p-10">
            <div className="mb-8 flex gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-container text-on-error-container">
                <TriangleAlert className="size-5" strokeWidth={2} aria-hidden />
              </div>
              <div>
                <h3 className="text-xl font-bold text-error">Danger Zone</h3>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Irreversible actions for your account
                </p>
              </div>
            </div>
            <p className="mb-8 text-sm leading-relaxed text-on-surface-variant">
              Once you delete your account, there is no going back. All repository
              history, synced configurations, and premium credits will be
              permanently removed.
            </p>
            <InteractiveToastButton
              message="For security, please contact support to initiate complete account deletion."
              className="group flex w-full items-center justify-center gap-3 rounded-xl border border-error/40 py-4 font-bold text-error transition-all duration-300 hover:bg-error hover:text-on-error"
            >
              <Trash2 className="size-5" strokeWidth={2} aria-hidden />
              Delete Account Permanently
            </InteractiveToastButton>
          </section>

          <div className="relative overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-surface-container-high to-surface p-8">
            <div className="relative z-10">
              <h4 className="mb-2 font-bold text-primary">Need Help?</h4>
              <p className="mb-6 text-xs text-on-surface-variant">
                Explore our technical documentation for advanced configuration
                flags.
              </p>
              <span className="inline-flex cursor-pointer items-center gap-2 border-b border-primary pb-1 text-sm font-bold transition-colors hover:text-white">
                Visit Documentation
                <ExternalLink className="size-4" strokeWidth={2} aria-hidden />
              </span>
            </div>
            <div className="pointer-events-none absolute -bottom-4 -right-4 opacity-10">
              <Terminal
                className="size-40 max-w-none"
                strokeWidth={1}
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-outline-variant/10 pt-10 md:flex-row">
        <div className="flex flex-wrap items-center gap-8">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
            © 2026 ARCHITECTOS
          </span>
          <nav className="flex gap-6">
            <InteractiveToastButton as="span" message="Loading Privacy Policy..." className="cursor-pointer text-xs text-on-surface-variant hover:text-primary">
              Privacy
            </InteractiveToastButton>
            <InteractiveToastButton as="span" message="Loading Terms of Service..." className="cursor-pointer text-xs text-on-surface-variant hover:text-primary">
              Terms
            </InteractiveToastButton>
            <InteractiveToastButton as="span" message="Security whitepapers are forwarded to your email." className="cursor-pointer text-xs text-on-surface-variant hover:text-primary">
              Security
            </InteractiveToastButton>
          </nav>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-secondary/5 px-4 py-2 text-xs text-secondary">
          <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
          All Systems Operational
        </div>
      </footer>
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-3 w-3 rounded-full ${dot}`} />
      <span className="text-xs text-on-surface-variant">{label}</span>
    </div>
  );
}
