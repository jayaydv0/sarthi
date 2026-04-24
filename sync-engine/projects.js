import path from "path";
import { supabase } from "./supabase.js";

/** @type {{ id: string, root: string }[]} */
let cache = [];
let lastProjectCount = -1;

export function getWatchedProjects() {
  return cache;
}

/**
 * Load projects for SYNC_USER_ID from Supabase and resolve local_path to absolute roots.
 * @returns {Promise<{ id: string, root: string }[]>}
 */
export async function loadProjectsFromSupabase() {
  const userId = process.env.SYNC_USER_ID?.trim();
  if (!userId) {
    console.error(
      "[engine] Set SYNC_USER_ID to your account UUID (Dashboard → Settings → Local sync).",
    );
    cache = [];
    return cache;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("id, local_path")
    .eq("user_id", userId);

  if (error) {
    console.error("[engine] Failed to load projects:", error.message);
    cache = [];
    return cache;
  }

  const cwd = process.cwd();
  cache = (data ?? []).map((row) => {
    const lp = String(row.local_path ?? "").trim();
    const root = path.isAbsolute(lp) ? lp : path.resolve(cwd, lp);
    return { id: row.id, root };
  });

  if (cache.length !== lastProjectCount) {
    if (cache.length === 0) {
      console.warn(
        "[engine] No projects returned for this user. Create a project in the web app and set its local folder path.",
      );
    } else {
      console.log(`[engine] loaded ${cache.length} project(s) from Supabase`);
    }
    lastProjectCount = cache.length;
  }

  return cache;
}
