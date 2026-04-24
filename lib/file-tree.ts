export type TreeEntry =
  | { kind: "dir"; name: string; children: TreeEntry[] }
  | { kind: "file"; name: string; path: string };

type Dir = Extract<TreeEntry, { kind: "dir" }>;

function findOrCreateDir(list: TreeEntry[], name: string): Dir {
  const existing = list.find(
    (x): x is Dir => x.kind === "dir" && x.name === name,
  );
  if (existing) return existing;
  const d: Dir = { kind: "dir", name, children: [] };
  list.push(d);
  return d;
}

function sortTree(entries: TreeEntry[]) {
  entries.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "dir" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  for (const e of entries) {
    if (e.kind === "dir") sortTree(e.children);
  }
}

export function pathsToTree(paths: string[]): TreeEntry[] {
  const root: TreeEntry[] = [];

  for (const full of [...paths].sort((a, b) => a.localeCompare(b))) {
    const parts = full.split("/").filter(Boolean);
    if (parts.length === 0) continue;
    let list = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      if (isLast) {
        if (!list.some((x) => x.kind === "file" && x.path === full)) {
          list.push({ kind: "file", name: part, path: full });
        }
        break;
      }
      const dir = findOrCreateDir(list, part);
      list = dir.children;
    }
  }

  sortTree(root);
  return root;
}
