import { prisma } from "@/lib/prisma";
import { BUCKET_PROJECT_FILES } from "@/lib/storage-paths";
import { createServerSupabase } from "@/lib/supabase-server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: projectId } = await context.params;
  const filePath = request.nextUrl.searchParams.get("path");
  if (!filePath) {
    return NextResponse.json({ error: "Missing path query" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
    select: { id: true },
  });

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const row = await prisma.projectFile.findFirst({
    where: { projectId, path: filePath },
    select: { path: true, content: true, storagePath: true },
  });

  if (!row) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  if (row.storagePath) {
    const { data: signed, error: signError } = await supabase.storage
      .from(BUCKET_PROJECT_FILES)
      .createSignedUrl(row.storagePath, 120);

    if (signError || !signed?.signedUrl) {
      return NextResponse.json(
        { error: "Could not create download link" },
        { status: 500 },
      );
    }
    return NextResponse.redirect(signed.signedUrl);
  }

  const name = row.path.split("/").pop() || "file";
  return new NextResponse(row.content ?? "", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name.replace(/"/g, "")}"`,
    },
  });
}
