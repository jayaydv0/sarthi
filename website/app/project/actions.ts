"use server";

import { prisma } from "@/lib/prisma";
import { createServerSupabase } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function updateProjectSettings(projectId: string, formData: FormData) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const name = String(formData.get("name") ?? "").trim();
  const local_path = String(formData.get("local_path") ?? "").trim();
  const live_url = String(formData.get("live_url") ?? "").trim() || null;
  const env_secrets = String(formData.get("env_secrets") ?? "");
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!name || !local_path) return;

  await prisma.project.updateMany({
    where: { id: projectId, userId: user.id },
    data: {
      name,
      localPath: local_path,
      liveUrl: live_url,
      envSecrets: env_secrets.length > 0 ? env_secrets : null,
      notes,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/project/${projectId}/edit`);
  revalidatePath(`/project/${projectId}/files`);
}
