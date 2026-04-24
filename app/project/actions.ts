"use server";

import { prisma } from "@/lib/prisma";
import { createServerSupabase } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateProjectSchema, deleteProjectSchema } from "@/lib/schemas";
import { buildErrorRedirect } from "@/lib/errors";

export async function updateProjectSettings(projectId: string, formData: FormData) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") ?? "");
  const local_path = String(formData.get("local_path") ?? "");
  const live_url = String(formData.get("live_url") ?? "");
  const env_secrets = String(formData.get("env_secrets") ?? "");
  const notes = String(formData.get("notes") ?? "");

  const parsed = updateProjectSchema.safeParse({
    name,
    local_path,
    live_url,
    env_secrets,
    notes,
  });

  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => issue.message).join(", ");
    redirect(buildErrorRedirect(`/project/${projectId}/edit`, "validation", message));
  }

  await prisma.project.updateMany({
    where: { id: projectId, userId: user.id },
    data: {
      name: parsed.data.name,
      localPath: parsed.data.local_path,
      liveUrl: parsed.data.live_url,
      envSecrets: parsed.data.env_secrets,
      notes: parsed.data.notes,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/project/${projectId}/edit`);
  revalidatePath(`/project/${projectId}/files`);
}

export async function deleteProject(projectId: string) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = deleteProjectSchema.safeParse({ projectId });
  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => issue.message).join(", ");
    redirect(buildErrorRedirect(`/project/${projectId}/edit`, "validation", message));
  }

  try {
    await prisma.project.deleteMany({
      where: { id: parsed.data.projectId, userId: user.id },
    });
  } catch (error) {
    console.error("[deleteProject]", error);
    redirect(buildErrorRedirect(`/project/${projectId}/edit`, "delete"));
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
