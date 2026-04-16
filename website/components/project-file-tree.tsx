import { projectFileHref } from "@/lib/file-links";
import type { TreeEntry } from "@/lib/file-tree";
import { ChevronDown, FolderOpen } from "lucide-react";
import Link from "next/link";
import { FileTypeIcon } from "@/components/file-type-icon";

function padClass(depth: number): string {
  if (depth <= 0) return "pl-6";
  if (depth === 1) return "pl-12";
  if (depth === 2) return "pl-[4.5rem]";
  return "pl-24";
}

export function ProjectFileTree({
  projectId,
  nodes,
  selectedPath,
  depth = 0,
}: {
  projectId: string;
  nodes: TreeEntry[];
  selectedPath: string | null;
  depth?: number;
}) {
  const pad = padClass(depth);

  return (
    <div className="space-y-1">
      {nodes.map((node) => {
        if (node.kind === "file") {
          const active = node.path === selectedPath;
          return (
            <Link
              key={node.path}
              href={projectFileHref(projectId, node.path)}
              className={
                active
                  ? `flex min-h-9 min-w-0 items-center gap-2 border-r-4 border-primary bg-primary/10 py-1.5 text-primary ${pad}`
                  : `flex min-h-9 min-w-0 items-center gap-2 py-1.5 text-slate-400 hover:bg-surface-container-high ${pad}`
              }
            >
              <FileTypeIcon
                name={node.name}
                className="size-4 shrink-0"
                strokeWidth={2}
              />
              <span className="min-w-0 truncate text-sm font-medium">{node.name}</span>
            </Link>
          );
        }

        return (
          <div key={`${depth}-${node.name}`} className="space-y-1">
            <div
              className={`flex items-center gap-2 py-1.5 text-slate-400 ${pad}`}
            >
              <ChevronDown className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              <FolderOpen
                className="size-4 shrink-0 text-secondary"
                strokeWidth={2}
                aria-hidden
              />
              <span className="text-sm font-medium">{node.name}</span>
            </div>
            <ProjectFileTree
              projectId={projectId}
              nodes={node.children}
              selectedPath={selectedPath}
              depth={depth + 1}
            />
          </div>
        );
      })}
    </div>
  );
}
