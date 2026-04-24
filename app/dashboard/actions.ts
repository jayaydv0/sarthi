"use server";

import { prisma } from "@/lib/prisma";
import { createServerSupabase } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createProjectSchema } from "@/lib/schemas";
import { buildErrorRedirect } from "@/lib/errors";

export async function createProject(formData: FormData) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") ?? "");
  const local_path = String(formData.get("local_path") ?? "");
  const description = String(formData.get("description") ?? "");

  const parsed = createProjectSchema.safeParse({
    name,
    local_path,
    description,
  });

  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => issue.message).join(", ");
    redirect(buildErrorRedirect("/dashboard/new", "validation", message));
  }

  try {
    await prisma.project.create({
      data: {
        userId: user.id,
        name: parsed.data.name,
        localPath: parsed.data.local_path,
        notes: parsed.data.description,
      },
    });
  } catch (error) {
    console.error("[createProject]", error);
    redirect(buildErrorRedirect("/dashboard/new", "save"));
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
