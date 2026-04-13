import { supabase } from "./supabase.js";

export const BUCKET_PROJECT_FILES = "project-files";

/**
 * @param {string} userId
 * @param {string} projectId
 * @param {string} filePath posix relative path
 */
export function projectFileStorageKey(userId, projectId, filePath) {
  const rel = filePath
    .split("/")
    .filter((s) => s.length > 0 && s !== "." && s !== "..")
    .join("/");
  return `${userId}/${projectId}/${rel}`;
}

/**
 * @param {string} ext lowercase without dot
 */
function guessContentType(ext) {
  const map = {
    html: "text/html",
    css: "text/css",
    js: "text/javascript",
    mjs: "text/javascript",
    json: "application/json",
    svg: "image/svg+xml",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    woff2: "font/woff2",
    woff: "font/woff",
    txt: "text/plain",
    md: "text/markdown",
    xml: "application/xml",
    wasm: "application/wasm",
  };
  return map[ext] ?? "application/octet-stream";
}

function extFromPath(filePath) {
  const base = filePath.split("/").pop() ?? "";
  const i = base.lastIndexOf(".");
  return i >= 0 ? base.slice(i + 1).toLowerCase() : "";
}

const MAX_INLINE_BYTES = 512 * 1024;

/**
 * @param {Buffer} buf
 * @returns {{ content: string, isBinary: boolean }}
 */
export function bufferToDbContent(buf) {
  if (buf.length === 0) {
    return { content: "", isBinary: false };
  }
  if (buf.includes(0)) {
    return {
      content: `[Binary file — ${buf.length} bytes in Storage; use Download in the web app]`,
      isBinary: true,
    };
  }
  if (buf.length > MAX_INLINE_BYTES) {
    return {
      content: `[Large file — ${buf.length} bytes in Storage; use Download in the web app]`,
      isBinary: true,
    };
  }
  return { content: buf.toString("utf8"), isBinary: false };
}

/**
 * @param {{ userId: string, projectId: string, filePath: string, buffer: Buffer }} opts
 * @returns {Promise<string|null>} storage object path, or null if upload failed
 */
export async function uploadProjectFileObject(opts) {
  const { userId, projectId, filePath, buffer } = opts;
  const key = projectFileStorageKey(userId, projectId, filePath);
  const ext = extFromPath(filePath);
  const contentType = guessContentType(ext);

  const { error } = await supabase.storage
    .from(BUCKET_PROJECT_FILES)
    .upload(key, buffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.warn(`[storage] upload failed for "${key}": ${error.message}`);
    return null;
  }
  return key;
}

/**
 * @param {string} userId
 * @param {string} projectId
 * @param {string} filePath
 */
export async function removeProjectFileObject(userId, projectId, filePath) {
  const key = projectFileStorageKey(userId, projectId, filePath);
  const { error } = await supabase.storage.from(BUCKET_PROJECT_FILES).remove([key]);
  if (error) {
    console.warn(`[storage] remove failed for "${key}": ${error.message}`);
  }
}
