"use server";

import { prisma } from "@/lib/prisma";
import { createServerSupabase } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProject(formData: FormData) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  const local_path = String(formData.get("local_path") ?? "").trim();
  const notes = String(formData.get("description") ?? "").trim() || null;
  if (!name || !local_path) {
    redirect("/dashboard/new?error=validation");
  }

  try {
    await prisma.project.create({
      data: {
        userId: user.id,
        name,
        localPath: local_path,
        notes,
      },
    });
  } catch (e) {
    console.error("[createProject]", e);
    redirect("/dashboard/new?error=save");
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
