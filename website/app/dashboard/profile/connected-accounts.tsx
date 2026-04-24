"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { 
  Terminal, 
  Mail, 
  Link as LinkIcon, 
  CheckCircle2, 
  Plus,
  Loader2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface ConnectedAccountsProps {
  userIdentities: any[];
  userEmail: string;
}

export function ConnectedAccounts({ userIdentities, userEmail }: ConnectedAccountsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const identities = userIdentities || [];
  const providers = identities.map((id) => id.provider);

  const isGoogleConnected = providers.includes("google");
  const isGithubConnected = providers.includes("github");

  const handleConnect = async (provider: "google" | "github") => {
    setLoading(provider);
    const supabase = createBrowserSupabase();
    
    // Attempt to link the account
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // This will redirect back here and Supabase will automatically link 
        // the account if "Link accounts with same email" is enabled in dashboard.
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/profile`,
      },
    });

    if (error) {
      toast.error(`Connection failed: ${error.message}`);
      setLoading(null);
    }
  };

  return (
    <section className="col-span-12 rounded-xl border border-white/5 bg-surface-container-low p-8 lg:col-span-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h4 className="text-xl font-bold">Connected Accounts</h4>
          <p className="text-sm text-outline mt-1">Manage your linked social profiles</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <LinkIcon className="size-5" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Google Account */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-surface-container-highest/30 p-5 transition-all hover:bg-surface-container-highest/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-white">
                <Mail className="size-6" />
              </div>
              <div>
                <p className="font-bold text-on-surface">Google Account</p>
                <p className="text-xs text-outline">
                  {isGoogleConnected ? userEmail : "Not linked to this profile"}
                </p>
              </div>
            </div>
            
            {isGoogleConnected ? (
              <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-secondary">
                <CheckCircle2 className="size-3" />
                Active
              </div>
            ) : (
              <button
                onClick={() => handleConnect("google")}
                disabled={loading !== null}
                className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-bold text-on-primary transition-all hover:bg-primary-container active:scale-95 disabled:opacity-50"
              >
                {loading === "google" ? <Loader2 className="size-3 animate-spin" /> : <Plus className="size-3" />}
                Connect
              </button>
            )}
          </div>
        </div>

        {/* GitHub Account */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-surface-container-highest/30 p-5 transition-all hover:bg-surface-container-highest/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-white">
                <Terminal className="size-6" />
              </div>
              <div>
                <p className="font-bold text-on-surface">GitHub Profile</p>
                <p className="text-xs text-outline">
                  {isGithubConnected ? "Connected successfully" : "Enable one-click login"}
                </p>
              </div>
            </div>
            
            {isGithubConnected ? (
              <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-secondary">
                <CheckCircle2 className="size-3" />
                Active
              </div>
            ) : (
              <button
                onClick={() => handleConnect("github")}
                disabled={loading !== null}
                className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-bold text-on-primary transition-all hover:bg-primary-container active:scale-95 disabled:opacity-50"
              >
                {loading === "github" ? <Loader2 className="size-3 animate-spin" /> : <Plus className="size-3" />}
                Connect
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-start gap-3 rounded-xl bg-primary/5 p-4 border border-primary/10">
        <AlertCircle className="size-5 text-primary shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed text-on-surface-variant">
          Linking multiple accounts allows you to sign in with any of them. 
          Make sure your Google and GitHub accounts use the same email address as this profile.
        </p>
      </div>
    </section>
  );
}
