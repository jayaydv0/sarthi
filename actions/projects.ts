"use server";

import { prisma } from "@/lib/prisma";
import { createServerSupabase } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return projects;
}

export async function createProject(data: { name: string; localPath: string; notes?: string }) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.create({
    data: {
      userId: user.id,
      name: data.name,
      localPath: data.localPath,
      notes: data.notes,
    },
  });

  revalidatePath("/dashboard");
  return project;
}

export async function deleteProject(id: string) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.project.findUnique({
    where: { id },
  });

  if (!existing || existing.userId !== user.id) {
    throw new Error("Not found or unauthorized");
  }

  await prisma.project.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
}
