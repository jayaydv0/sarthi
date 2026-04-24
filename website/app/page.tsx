import { LandingPage } from "@/components/landing-page";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function Home() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <LandingPage hasUser={!!user} />;
}
