"use client";

import { createBrowserSupabase } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    const supabase = createBrowserSupabase();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="flex items-center gap-2 rounded-full bg-error-container px-6 py-3 text-on-error-container transition-colors hover:bg-[#93000a] disabled:opacity-50"
    >
      <LogOut className="size-4" strokeWidth={2} aria-hidden />
      Logout
    </button>
  );
}
