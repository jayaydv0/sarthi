import chokidar from "chokidar";
import path from "path";
import { addChange } from "./memory.js";

/** @type {Map<string, import("chokidar").FSWatcher>} */
const active = new Map();

function mapChangeType(event) {
  if (event === "add") return "add";
  if (event === "change") return "modify";
  if (event === "unlink") return "delete";
  return event;
}

/**
 * @param {{ id: string, root: string }} project
 */
export function startWatcher(project) {
  const { id, root } = project;
  if (active.has(id)) return;

  const watcher = chokidar.watch(root, {
    ignoreInitial: true,
    persistent: true,
    ignored: [
      "**/node_modules/**",
      "**/.git/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
    ],
  });

  const onFsEvent = (event, filePath) => {
    const rel = path.relative(root, filePath) || path.basename(filePath);
    const file_name = rel.split(path.sep).join("/");
    const change = {
      file_name,
      change_type: mapChangeType(event),
      timestamp: new Date().toISOString(),
    };
    addChange(id, change);
    console.log(
      `[watch] captured ${change.change_type}: ${file_name} (project: ${id})`,
    );
  };

  watcher.on("add", (p) => onFsEvent("add", p));
  watcher.on("change", (p) => onFsEvent("change", p));
  watcher.on("unlink", (p) => onFsEvent("unlink", p));

  watcher.on("ready", () => {
    console.log(`[watch] started for "${id}" → ${root}`);
  });

  watcher.on("error", (err) => {
    console.error(`[watch] error (${id}):`, err.message);
  });

  active.set(id, watcher);
}

/**
 * @param {string} id
 */
export async function stopWatcher(id) {
  const w = active.get(id);
  if (!w) return;
  await w.close();
  active.delete(id);
  console.log(`[watch] stopped for "${id}"`);
}

/**
 * Start watchers for new projects and stop watchers for removed ones.
 * @param {{ id: string, root: string }[]} projects
 */
export async function reconcileWatchers(projects) {
  const nextIds = new Set(projects.map((p) => p.id));
  for (const id of [...active.keys()]) {
    if (!nextIds.has(id)) {
      await stopWatcher(id);
    }
  }
  for (const p of projects) {
    startWatcher(p);
  }
}
