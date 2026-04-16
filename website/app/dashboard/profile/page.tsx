import { AvatarForm } from "@/app/dashboard/profile/avatar-form";
import { LogoutButton } from "@/app/dashboard/profile/logout-button";
import {
  BadgeCheck,
  BarChart3,
  ChevronRight,
  Key,
  Lock,
  Mail,
  Network,
  Pencil,
} from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function ProfilePage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Developer";
  const email = user?.email ?? "—";
  const avatarUrl =
    typeof user?.user_metadata?.avatar_url === "string"
      ? user.user_metadata.avatar_url
      : null;

  return (
    <>
      <header className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-start">
        <div>
          <h2 className="mb-2 text-[2.5rem] font-bold leading-tight tracking-[-0.02em] text-on-background md:text-[3.5rem]">
            User Profile
          </h2>
          <p className="text-[0.6875rem] uppercase tracking-[0.05em] text-outline">
            Account Management &amp; Security
          </p>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-surface-container-high px-6 py-3 text-on-surface transition-colors hover:bg-surface-bright"
          >
            <Pencil className="size-4" strokeWidth={2} aria-hidden />
            Edit Profile
          </button>
          <LogoutButton />
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-12 flex flex-col items-center gap-10 rounded-xl border border-white/5 bg-surface-container-low p-8 lg:col-span-8 md:flex-row">
          <div className="relative group">
            <div className="h-48 w-48 overflow-hidden rounded-xl shadow-ambient transition-transform duration-300 group-hover:scale-105">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface-container-highest text-4xl font-bold text-primary">
                  {name.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <div className="absolute -bottom-4 -right-4 flex h-12 w-12 items-center justify-center rounded-full border-4 border-surface-container-low bg-secondary shadow-lg">
              <BadgeCheck
                className="size-4 text-on-secondary"
                strokeWidth={2}
                fill="currentColor"
                aria-hidden
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-6">
              <span className="mb-2 block text-[0.6875rem] font-bold uppercase tracking-widest text-primary">
                System Architect
              </span>
              <h3 className="mb-1 text-3xl font-bold text-on-surface">{name}</h3>
              <p className="flex items-center gap-2 text-on-surface-variant">
                <Mail className="size-5" strokeWidth={2} aria-hidden />
                {email}
              </p>
            </div>
            <AvatarForm />
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-3 rounded-lg bg-surface-container-highest px-4 py-2">
                <span className="text-[0.6875rem] font-bold text-outline">
                  TIER
                </span>
                <span className="font-medium text-secondary">PREMIUM</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-surface-container-highest px-4 py-2">
                <span className="text-[0.6875rem] font-bold text-outline">
                  SINCE
                </span>
                <span className="font-medium text-on-surface">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="col-span-12 grid grid-rows-2 gap-8 lg:col-span-4">
          <div className="flex flex-col justify-between rounded-xl border border-white/5 bg-surface-container-high p-6">
            <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-outline">
              Uptime Contribution
            </span>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-black text-secondary">99.9%</span>
              <BarChart3
                className="size-14 text-secondary/30 md:size-16"
                strokeWidth={1.5}
                aria-hidden
              />
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-xl border border-white/5 bg-surface-container-high p-6">
            <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-outline">
              Account
            </span>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-black text-primary">Active</span>
              <Network
                className="size-14 text-primary/30 md:size-16"
                strokeWidth={1.5}
                aria-hidden
              />
            </div>
          </div>
        </div>

        <section className="col-span-12 rounded-xl border border-white/5 bg-surface-container-low p-8 lg:col-span-6">
          <div className="mb-8 flex items-center justify-between">
            <h4 className="text-xl font-bold">Connected Accounts</h4>
            <button
              type="button"
              className="text-sm font-bold text-primary hover:underline"
            >
              Link New
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-surface-container-highest p-5 transition-all group hover:bg-surface-bright">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-[#ea4335]/10">
                  <svg className="h-5 w-5" fill="#ea4335" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.909 3.292-2.09 4.479-1.217 1.218-2.811 2.019-5.75 2.019-4.894 0-8.805-4.027-8.805-9.182s3.911-9.182 8.805-9.182c2.81 0 4.88 1.109 6.27 2.441l2.31-2.31c-2.09-2-5.02-3.41-8.58-3.41-6.62 0-12 5.38-12 12s5.38 12 12 12c3.58 0 6.27-1.17 8.37-3.35 2.16-2.16 2.84-5.21 2.84-7.67 0-.77-.07-1.49-.19-2.14z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Google</p>
                  <p className="text-xs text-outline">{email}</p>
                </div>
              </div>
              <span className="rounded bg-secondary/10 px-2 py-1 text-[0.6875rem] font-bold uppercase text-secondary">
                Active
              </span>
            </div>
          </div>
        </section>

        <section className="col-span-12 rounded-xl border border-white/5 bg-surface-container-low p-8 lg:col-span-6">
          <h4 className="mb-8 text-xl font-bold">Security &amp; Privacy</h4>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Lock
                  className="text-primary"
                  strokeWidth={2}
                  fill="currentColor"
                  aria-hidden
                />
              </div>
              <div>
                <p className="font-bold text-on-surface">
                  Two-Factor Authentication
                </p>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  Secure your account with an extra layer of protection using your
                  mobile device.
                </p>
                <button
                  type="button"
                  className="mt-2 flex items-center gap-1 text-sm font-bold text-secondary"
                >
                  Learn more
                  <ChevronRight className="size-4" strokeWidth={2} aria-hidden />
                </button>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-tertiary/10">
                <Key className="text-tertiary" strokeWidth={2} aria-hidden />
              </div>
              <div>
                <p className="font-bold text-on-surface">Session</p>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  You&apos;re signed in with a secure session. Log out from this
                  device anytime.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-20 flex items-center justify-between border-t border-white/5 pt-10">
        <BrandLogoFooter />
        <p className="text-[0.6875rem] font-medium uppercase tracking-widest text-outline">
          © 2026 ARCHITECTOS CLOUD SERVICES. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </>
  );
}

function BrandLogoFooter() {
  return (
    <span className="text-2xl font-bold tracking-tighter bg-gradient-to-br from-primary to-primary-container bg-clip-text text-transparent">
      ArchitectOS
    </span>
  );
}
