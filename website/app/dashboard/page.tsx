import { prisma } from "@/lib/prisma";
import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const list = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      localPath: true,
      liveUrl: true,
      createdAt: true,
      notes: true,
    },
  });

  return <DashboardClient initialProjects={list} />;
}
