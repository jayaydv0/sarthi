"use client";

import { createBrowserSupabase } from "@/lib/supabase-browser";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Terminal } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(urlError);
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createBrowserSupabase();
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.refresh();
    router.push("/dashboard");
  }

  async function handleGoogle() {
    setError(null);
    setLoading(true);
    const supabase = createBrowserSupabase();
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
    }
  }

  async function handleGitHub() {
    setError(null);
    setLoading(true);
    const supabase = createBrowserSupabase();
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden text-on-surface">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="ambient-glow absolute -left-[10%] -top-[20%] h-[60%] w-[60%] rounded-full" />
        <div className="ambient-glow absolute -bottom-[20%] -right-[10%] h-[60%] w-[60%] rounded-full" />
      </div>

      <main className="relative z-10 w-full max-w-md px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-2 bg-gradient-to-br from-primary to-primary-container bg-clip-text text-3xl font-black tracking-tighter text-transparent">
            ArchitectOS
          </h1>
          <p className="text-sm font-medium uppercase tracking-wide text-outline">
            Development Environment
          </p>
        </div>

        <div className="glass-panel rounded-xl p-8 shadow-[0_20px_40px_rgba(8,20,37,0.6)]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-on-surface">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              Please enter your details to continue.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSignIn}>
            <div>
              <label
                className="mb-2 ml-1 block text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-outline"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                id="email"
                className="auth-input w-full rounded border-none bg-surface-container-lowest px-4 py-3.5 text-on-surface outline-none transition-all duration-200 placeholder:text-surface-container-highest"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dev@architectos.io"
              />
            </div>
            <div>
              <div className="mb-2 ml-1 flex items-center justify-between">
                <label
                  className="block text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-outline"
                  htmlFor="password"
                >
                  Password
                </label>
                <span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary">
                  Forgot?
                </span>
              </div>
              <input
                id="password"
                className="auth-input w-full rounded border-none bg-surface-container-lowest px-4 py-3.5 text-on-surface outline-none transition-all duration-200 placeholder:text-surface-container-highest"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {error ? (
              <p className="text-sm text-error" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-br from-primary to-primary-container py-4 font-bold text-on-primary shadow-lg shadow-primary/20 transition-transform duration-200 active:scale-[0.98] disabled:opacity-50"
            >
              Login
            </button>
          </form>

          <div className="relative my-8">
            <div aria-hidden className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-[0.6875rem] uppercase tracking-widest">
              <span className="bg-surface-variant/40 px-3 text-outline">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 rounded-full border border-white/5 bg-surface-container-highest/50 py-3.5 text-on-surface transition-all duration-300 hover:bg-surface-container-highest disabled:opacity-50"
            >
              <svg className="h-5 w-5 opacity-80 group-hover:opacity-100" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm font-semibold">Continue with Google</span>
            </button>
            <button
              type="button"
              onClick={handleGitHub}
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 rounded-full border border-white/5 bg-surface-container-highest/50 py-3.5 text-on-surface transition-all duration-300 hover:bg-surface-container-highest disabled:opacity-50"
            >
              <Terminal
                className="size-5 opacity-80 group-hover:opacity-100"
                strokeWidth={2}
                aria-hidden
              />
              <span className="text-sm font-semibold">Continue with GitHub</span>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-on-surface-variant">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="ml-1 font-bold text-primary transition-all hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

        <div className="pointer-events-none fixed bottom-8 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-3 rounded-full border border-white/5 bg-surface-container-low/80 px-4 py-2 backdrop-blur-md">
            <div className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-outline">
              ArchitectOS Systems Operational
            </span>
          </div>
        </div>
      </main>

      <div className="pointer-events-none fixed right-0 top-0 hidden p-12 opacity-20 lg:block">
        <div className="h-32 w-32 rounded-tr-xl border-r border-t border-primary/30" />
      </div>
      <div className="pointer-events-none fixed bottom-0 left-0 hidden p-12 opacity-20 lg:block">
        <div className="h-32 w-32 rounded-bl-xl border-b border-l border-primary/30" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface text-on-surface">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
