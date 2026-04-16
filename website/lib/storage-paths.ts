/** Must match `storage.buckets.id` in supabase-storage.sql */
export const BUCKET_PROJECT_FILES = "project-files";
export const BUCKET_AVATARS = "avatars";

/** Safe relative file path (no empty or traversal segments). */
export function normalizeProjectFilePath(relPath: string): string {
  return relPath
    .split("/")
    .filter((s) => s.length > 0 && s !== "." && s !== "..")
    .join("/");
}

/**
 * Object key inside `project-files`: `{userId}/{projectId}/{path}`.
 * Sync-engine and website must use the same shape.
 */
export function projectFileStorageKey(
  userId: string,
  projectId: string,
  filePath: string,
): string {
  const rel = normalizeProjectFilePath(filePath);
  return `${userId}/${projectId}/${rel}`;
}

export function avatarObjectPath(userId: string, extension: string): string {
  const ext = extension.replace(/^\./, "").toLowerCase();
  const safe =
    ext === "png" ||
    ext === "jpg" ||
    ext === "jpeg" ||
    ext === "webp" ||
    ext === "gif"
      ? ext === "jpeg" || ext === "jpg"
        ? "jpg"
        : ext
      : "png";
  return `${userId}/avatar.${safe}`;
}
