"use server";

import {
  avatarObjectPath,
  BUCKET_AVATARS,
} from "@/lib/storage-paths";
import { createServerSupabase } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

export async function uploadAvatar(formData: FormData) {
  const file = formData.get("avatar");
  if (!file || !(file instanceof File) || file.size === 0) {
    return { error: "Choose an image file." };
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return { error: "Image must be 5 MB or smaller." };
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not signed in." };
  }

  const rawName = file.name || "avatar.png";
  const ext = rawName.includes(".")
    ? rawName.slice(rawName.lastIndexOf(".") + 1)
    : "png";

  const objectPath = avatarObjectPath(user.id, ext);
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: upError } = await supabase.storage
    .from(BUCKET_AVATARS)
    .upload(objectPath, bytes, {
      contentType: file.type || "image/png",
      upsert: true,
    });

  if (upError) {
    return { error: upError.message };
  }

  const { data: pub } = supabase.storage
    .from(BUCKET_AVATARS)
    .getPublicUrl(objectPath);

  const { error: metaError } = await supabase.auth.updateUser({
    data: {
      avatar_url: `${pub.publicUrl}?t=${Date.now()}`,
    },
  });

  if (metaError) {
    return { error: metaError.message };
  }

  revalidatePath("/dashboard/profile");
  return { ok: true as const };
}
