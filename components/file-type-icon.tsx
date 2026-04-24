import { FileCode2, FileJson, FileText } from "lucide-react";

function isCodeLike(name: string): boolean {
  const lower = name.toLowerCase();
  return (
    lower.endsWith(".tsx") ||
    lower.endsWith(".jsx") ||
    lower.endsWith(".ts") ||
    lower.endsWith(".js") ||
    lower.endsWith(".css") ||
    lower.endsWith(".scss") ||
    lower.endsWith(".less")
  );
}

export function FileTypeIcon({
  name,
  className,
  strokeWidth = 2,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const lower = name.toLowerCase();
  if (isCodeLike(name)) {
    return (
      <FileCode2 className={className} strokeWidth={strokeWidth} aria-hidden />
    );
  }
  if (lower.endsWith(".json")) {
    return (
      <FileJson className={className} strokeWidth={strokeWidth} aria-hidden />
    );
  }
  return <FileText className={className} strokeWidth={strokeWidth} aria-hidden />;
}
